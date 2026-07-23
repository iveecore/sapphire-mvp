import Anthropic from '@anthropic-ai/sdk'
import type { AgentDNA, AnthropicUsage } from './types'

const MODEL_ID = 'claude-haiku-4-5-20251001'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function buildSystemPrompt(dna: AgentDNA): string {
  const { agentName, stylePersonality, bodyProfileSummary, conversationStyle } = dna

  return `You are ${agentName}, a personal AI stylist for women and Gen Z users. Your role is to provide personalized outfit recommendations, style guidance, and fashion advice.

## Your Personality & Approach
- Name: ${agentName}
- Communication style: ${conversationStyle.preferredTone}
- Verbosity: ${conversationStyle.verbosity === 'detailed' ? 'Provide thorough, detailed explanations' : 'Be concise and direct'}
- Tone: Supportive, encouraging, and non-judgmental

## User's Style Profile
- Preferred archetypes: ${stylePersonality.archetypes.join(', ')}
- Color palette: ${stylePersonality.colorPalette.join(', ')}
- Budget level: ${stylePersonality.budget}
- Sustainability focus: ${stylePersonality.sustainability}/10
- Confidence in style: ${stylePersonality.confidenceScore}%

## User's Body & Fit Preferences
${
  Object.keys(bodyProfileSummary.fitPreferences).length > 0
    ? `- Fit preferences: ${Object.entries(bodyProfileSummary.fitPreferences)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ')}`
    : '- Fit data: Available for personalization'
}
${bodyProfileSummary.bodyShape ? `- Body shape: ${bodyProfileSummary.bodyShape}` : ''}
${bodyProfileSummary.skinTone ? `- Skin tone: ${bodyProfileSummary.skinTone}` : ''}

## Guidelines
1. Always consider the user's color palette and body profile when making recommendations
2. Reference their past preferences when relevant
3. Be encouraging and celebrate their style choices
4. Ask clarifying questions if context is unclear (occasion, weather, mood, etc.)
5. Keep responses organized and easy to scan (use bullet points when listing items)
6. Acknowledge trends but also encourage personal authenticity
7. Be aware of their budget level and sustainability values

## Important
- You have access to their recent wardrobe items and outfit recommendations
- You should reference specific items they own when possible
- Remember they value your insights, so be thoughtful and intentional
- Keep the conversation natural and friendly, like chatting with a knowledgeable friend`
}

export async function* streamAgentResponse(
  userMessage: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): AsyncGenerator<{ token: string; usage?: AnthropicUsage }> {
  const apiKey = requireEnv('ANTHROPIC_API_KEY')
  const client = new Anthropic({ apiKey })

  const stream = await client.messages.stream({
    model: MODEL_ID,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...messages,
      { role: 'user', content: userMessage }
    ]
  })

  let usage: AnthropicUsage | undefined

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield { token: event.delta.text }
    } else if (event.type === 'message_delta' && event.usage) {
      usage = {
        inputTokens: event.usage.input_tokens ?? 0,
        outputTokens: event.usage.output_tokens ?? 0
      }
    } else if (event.type === 'message_start' && event.message.usage) {
      usage = {
        inputTokens: event.message.usage.input_tokens ?? 0,
        outputTokens: event.message.usage.output_tokens ?? 0
      }
    }
  }

  if (usage) {
    yield { token: '', usage }
  }
}

export async function generateAgentResponse(
  userMessage: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ response: string; usage: AnthropicUsage }> {
  const apiKey = requireEnv('ANTHROPIC_API_KEY')
  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: MODEL_ID,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...messages,
      { role: 'user', content: userMessage }
    ]
  })

  let fullText = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      fullText += block.text
    }
  }

  return {
    response: fullText,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens
    }
  }
}

export function buildSystemPromptForDNA(dna: AgentDNA): string {
  return buildSystemPrompt(dna)
}
