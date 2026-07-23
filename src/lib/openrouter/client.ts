// OPENROUTER_API_KEY env var is required — set it in Vercel and .env.local

export type ModelTier = 'free' | 'pro'

export const MODELS = {
  default: 'meta-llama/llama-3.1-8b-instruct:free',
  quality: 'google/gemini-2.0-flash-exp:free',
  fast:    'mistralai/mistral-7b-instruct:free',
  light:   'microsoft/phi-3-mini-128k-instruct:free',
  // Paid tier (future — requires OpenRouter credits)
  pro:   'anthropic/claude-haiku-4-5',
  ultra: 'anthropic/claude-sonnet-4-6',
} as const

export type ModelKey = keyof typeof MODELS

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  max_tokens?: number
  temperature?: number
}

function getHeaders() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://sapphire-mvp.vercel.app',
    'X-Title': 'Sapphire AI Stylist',
  }
}

export async function streamChat(
  messages: ChatMessage[],
  model: string = MODELS.default
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ model, messages, stream: true, max_tokens: 1024, temperature: 0.8 } satisfies OpenRouterRequest),
  })
  if (!res.ok) throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`)
  if (!res.body) throw new Error('No response body from OpenRouter')
  return res.body
}

export async function chat(
  messages: ChatMessage[],
  model: string = MODELS.default
): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ model, messages, stream: false, max_tokens: 1024, temperature: 0.8 } satisfies OpenRouterRequest),
  })
  if (!res.ok) throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

export function getModelForTier(tier: ModelTier, preferred?: string | null): string {
  const allModels = Object.values(MODELS) as string[]
  const paidModels: string[] = [MODELS.pro, MODELS.ultra]
  if (preferred && allModels.includes(preferred)) {
    if (tier === 'free' && paidModels.includes(preferred)) return MODELS.default
    return preferred
  }
  return tier === 'free' ? MODELS.default : MODELS.pro
}

// Legacy compat — used by older code
export const FREE_MODEL = MODELS.default
export const PRO_DEFAULT_MODEL = MODELS.pro

export async function openRouterChat(req: OpenRouterRequest): Promise<Response> {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(req),
  })
}

export async function openRouterChatJSON(req: OpenRouterRequest): Promise<string> {
  const res = await openRouterChat({ ...req, stream: false })
  if (!res.ok) throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}
