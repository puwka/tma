/**
 * Заглушки для будущих API-вызовов к neuroapi и kie.ai
 */

export interface GenerateTextResult {
  text: string
  model: string
}

export interface TranscribeResult {
  text: string
  duration: number
}

export interface GenerateImageResult {
  url: string
  width: number
  height: number
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Генерация текста (neuroapi / kie.ai) */
export async function generateText(prompt: string): Promise<GenerateTextResult> {
  await delay(1000)
  return {
    text: `[Заглушка] Ответ на: "${prompt.slice(0, 50)}..."`,
    model: 'gpt-4',
  }
}

/** Транскрибация аудио */
export async function transcribeAudio(_audioUrl: string): Promise<TranscribeResult> {
  await delay(1000)
  return {
    text: '[Заглушка] Транскрипция аудио готова.',
    duration: 120,
  }
}

/** Генерация изображения */
export async function generateImage(_prompt: string): Promise<GenerateImageResult> {
  await delay(1000)
  return {
    url: 'https://placehold.co/512x512',
    width: 512,
    height: 512,
  }
}
