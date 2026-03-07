/**
 * Kie.ai API — генерация изображений через Nano Banana Pro (Gemini 3.0 Pro Image).
 * Документация: https://docs.kie.ai/market/google/pro-image-to-image
 * https://kie.ai/ru/nano-banana-pro
 */

const KIE_API_BASE = 'https://api.kie.ai/api/v1'

export type AspectRatio =
  | '1:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '4:5'
  | '5:4'
  | '9:16'
  | '16:9'
  | '21:9'
  | 'auto'

export type Resolution = '1K' | '2K' | '4K'
export type OutputFormat = 'png' | 'jpg'

export interface KieGenerateInput {
  prompt: string
  image_input?: string[]
  aspect_ratio?: AspectRatio
  resolution?: Resolution
  output_format?: OutputFormat
}

export interface KieGenerateResult {
  taskId: string
  imageUrl?: string
  state: 'success' | 'fail' | string
  failMsg?: string
}

function getApiKey(): string {
  const key = import.meta.env.VITE_KIE_API_KEY
  if (!key) console.warn('VITE_KIE_API_KEY не задан. Генерация изображений недоступна.')
  return key || ''
}

/** Создать задачу генерации (Nano Banana Pro) */
export async function createImageTask(input: KieGenerateInput): Promise<{ taskId: string }> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('Не задан VITE_KIE_API_KEY')

  const res = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'nano-banana-pro',
      input: {
        prompt: input.prompt,
        image_input: input.image_input ?? [],
        aspect_ratio: input.aspect_ratio ?? '1:1',
        resolution: input.resolution ?? '2K',
        output_format: input.output_format ?? 'png',
      },
    }),
  })

  const data = (await res.json()) as { code: number; msg: string; data?: { taskId: string } }
  if (data.code !== 200 || !data.data?.taskId) {
    throw new Error(data.msg || `Kie.ai: ${res.status}`)
  }
  return { taskId: data.data.taskId }
}

/** Получить статус задачи */
export async function getTaskDetail(taskId: string): Promise<{
  state: string
  resultJson?: string
  failMsg?: string
}> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('Не задан VITE_KIE_API_KEY')

  const res = await fetch(`${KIE_API_BASE}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  const data = (await res.json()) as {
    code: number
    data?: { state: string; resultJson?: string; failMsg?: string }
  }
  if (data.code !== 200 || !data.data) {
    throw new Error('Не удалось получить статус задачи')
  }
  return {
    state: data.data.state,
    resultJson: data.data.resultJson,
    failMsg: data.data.failMsg,
  }
}

/** Генерация изображения: создание задачи + опрос до success/fail */
export async function generateImageNanoBananaPro(input: KieGenerateInput): Promise<KieGenerateResult> {
  const { taskId } = await createImageTask(input)
  const maxAttempts = 60
  const intervalMs = 2000

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs))
    const detail = await getTaskDetail(taskId)
    if (detail.state === 'success') {
      let imageUrl: string | undefined
      if (detail.resultJson) {
        try {
          const parsed = JSON.parse(detail.resultJson) as { resultUrls?: string[] }
          imageUrl = parsed.resultUrls?.[0]
        } catch {
          // ignore
        }
      }
      return { taskId, state: 'success', imageUrl }
    }
    if (detail.state === 'fail') {
      return { taskId, state: 'fail', failMsg: detail.failMsg }
    }
  }
  return { taskId, state: 'fail', failMsg: 'Таймаут ожидания генерации' }
}
