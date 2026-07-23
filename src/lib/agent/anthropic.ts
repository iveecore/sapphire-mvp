import { streamChat, chat, MODELS } from '@/lib/openrouter/client'
import type { AgentDNA, AnthropicUsage } from './types'

function buildSystemPrompt(dna: AgentDNA): string {
  const { agentName, stylePersonality, bodyProfileSummary, conversationStyle } = dna
  return `You are ${agentName}, Sapphire's personal AI stylist. You're warm, confident, and speak like a stylish best friend — not a corporate chatbot. You know fashion, trends, body styling, outfit building, and Gen Z aesthetics. You give specific, actionable style advice. Keep responses conversational, under 150 words unless asked for detail. Use emojis sparingly (1-2 max). Never be generic.

Style profile: archetypes=${stylePersonality.archetypes.join(', ')}, palette=${stylePersonality.colorPalette.join(', ')}, budget=${stylePersonality.budget}, tone=${conversationStyle.preferredTone}.${bodyProfileSummary.bodyShape ? ` Body shape: ${bodyProfileSummary.bodyShape}.` : ''}${bodyProfileSummary.skinTone ? ` Skin tone: ${bodyProfileSummary.skinTone}.` : ''}`
}

export async function* streamAgentResponse(
  userMessage: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): AsyncGenerator<{ token: string; usage?: AnthropicUsage }> {
  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]

  const stream = await streamChat(fullMessages, MODELS.quality)
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let outputTokens = 0
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content ?? ''
          if (token) {
            outputTokens++
            yield { token }
          }
        } catch {
          // skip malformed SSE line
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  yield { token: '', usage: { inputTokens: 0, outputTokens } }
}

export async function generateAgentResponse(
  userMessage: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ response: string; usage: AnthropicUsage }> {
  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]
  const response = await chat(fullMessages, MODELS.quality)
  return { response, usage: { inputTokens: 0, outputTokens: Math.ceil(response.length / 4) } }
}

export function buildSystemPromptForDNA(dna: AgentDNA): string {
  return buildSystemPrompt(dna)
}
