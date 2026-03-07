/**
 * Neuro API — чат-запросы к модели gpt-5-mini.
 * Документация: https://neuroapi.host/docs/chat-completion/
 */

const NEURO_API_BASE = 'https://neuroapi.host/v1'
const MODEL = 'gpt-5-mini'

/** Системный промпт: коуч ведёт как реальный — вопросы, отражение, поиск своих ответов */
export const COACH_SYSTEM_PROMPT = `Ты — опытный персональный коуч. Твоя задача — помогать человеку увидеть то, что он пока не замечает, и находить свои ответы. Ты не даёшь готовых советов и решений: задаёшь уточняющие вопросы, отражаешь сказанное, помогаешь прояснить цели и ограничения. Отвечай кратко, тёпло и по-человечески, на русском. Опирайся на принципы системного коучинга и нейропсихологии: фокус на клиенте, его ресурсах и выборе.`

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionResult {
  content: string
  model: string
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
}

function getApiKey(): string {
  const key = import.meta.env.VITE_NEUROAPI_API_KEY
  if (!key) {
    console.warn('VITE_NEUROAPI_API_KEY не задан. Используется заглушка.')
  }
  return key || ''
}

/**
 * Отправка запроса в Neuro API (chat completions).
 * Если API ключ не задан — возвращается заглушка.
 */
export async function chatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResult> {
  const apiKey = getApiKey()
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 800))
    return {
      content: 'Привет! Я AI-Coach. Чтобы я работал с нейросетью, добавьте VITE_NEUROAPI_API_KEY в .env и перезапустите приложение.',
      model: MODEL,
    }
  }

  const res = await fetch(`${NEURO_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Neuro API: ${res.status} ${err}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string }; finish_reason?: string }>
    model?: string
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  }
  const content = data.choices?.[0]?.message?.content ?? ''
  return {
    content: content.trim(),
    model: data.model ?? MODEL,
    usage: data.usage,
  }
}

/** Системный промпт Словоеда: аудио/текст/ссылка → аккуратный текст */
const SLOVOED_SYSTEM_PROMPT = `Ты — Словоед. Твоя задача: превращать сырую речь, ссылки или неоформленный текст в аккуратный текст. Действия: расставь знаки препинания, разбей на абзацы, исправь очевидные опечатки, выдели ключевые мысли при необходимости. Если пользователь прислал только ссылку — ответь кратко: "Пришлите текст со страницы или запишите голос — по ссылке я не могу прочитать контент." Отвечай только итоговым текстом, без пояснений и предисловий.`

/**
 * Обработка ввода Словоеда (ссылка, текст или расшифровка голоса) через Neuro API.
 * Возвращает обработанный текст или сообщение об ошибке.
 */
export async function slovoedProcess(input: string): Promise<{ text: string; error?: string }> {
  const trimmed = input.trim()
  if (!trimmed) {
    return { text: '', error: 'Введите ссылку или текст, либо запишите голос.' }
  }

  const apiKey = getApiKey()
  if (!apiKey) {
    return {
      text: '',
      error: 'Добавьте VITE_NEUROAPI_API_KEY в .env для работы Словоеда.',
    }
  }

  try {
    const result = await chatCompletion([
      { role: 'system', content: SLOVOED_SYSTEM_PROMPT },
      { role: 'user', content: trimmed },
    ])
    return { text: result.content }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка сети'
    return { text: '', error: message }
  }
}
