export type ModelTier = 'free' | 'pro'

export interface OpenRouterModel {
  id: string
  name: string
  tier: ModelTier
  contextWindow: number
  costPer1kTokens: number
}

export const MODELS: Record<string, OpenRouterModel> = {
  'meta-llama/llama-3.1-8b-instruct:free': {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (Free)',
    tier: 'free',
    contextWindow: 131072,
    costPer1kTokens: 0,
  },
  'anthropic/claude-haiku-4-5': {
    id: 'anthropic/claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    tier: 'free',
    contextWindow: 200000,
    costPer1kTokens: 0.00025,
  },
  'anthropic/claude-sonnet-4-6': {
    id: 'anthropic/claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    tier: 'pro',
    contextWindow: 200000,
    costPer1kTokens: 0.003,
  },
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    tier: 'pro',
    contextWindow: 128000,
    costPer1kTokens: 0.005,
  },
  'google/gemini-flash-1.5': {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    tier: 'free',
    contextWindow: 1000000,
    costPer1kTokens: 0.000075,
  },
  'mistralai/mistral-7b-instruct:free': {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B (Free)',
    tier: 'free',
    contextWindow: 32768,
    costPer1kTokens: 0,
  },
}

export const FREE_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'
export const PRO_DEFAULT_MODEL = 'anthropic/claude-sonnet-4-6'

export function getModelForTier(tier: ModelTier, preferredModel?: string | null): string {
  if (preferredModel && MODELS[preferredModel]) {
    const model = MODELS[preferredModel]
    if (tier === 'free' && model.tier === 'pro') return FREE_MODEL
    return preferredModel
  }
  return tier === 'pro' ? PRO_DEFAULT_MODEL : FREE_MODEL
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterRequest {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  max_tokens?: number
  temperature?: number
}

export async function openRouterChat(request: OpenRouterRequest): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set')

  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://sapphire-mvp.vercel.app',
      'X-Title': 'Sapphire AI Stylist',
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      stream: request.stream ?? true,
      max_tokens: request.max_tokens ?? 1024,
      temperature: request.temperature ?? 0.8,
    }),
  })
}

export async function openRouterChatJSON(request: OpenRouterRequest): Promise<string> {
  const res = await openRouterChat({ ...request, stream: false })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}
