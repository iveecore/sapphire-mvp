import type { AgentDNA, ConversationStyle, MoodPattern, StylePersonality } from './types'

export function formatTokenBalance(balance: number): string {
  if (balance < 0) return '0 tokens'
  if (balance >= 1000) return `${(balance / 1000).toFixed(1)}k tokens`
  return `${balance} tokens`
}

export function estimateResponseTime(contentLength: number): number {
  return Math.max(500, Math.min(3000, contentLength * 10))
}

export function detectMoodFromText(text: string): { mood: string; confidence: number } {
  const lowerText = text.toLowerCase()

  const moods: Record<string, { words: string[]; confidence: number }> = {
    excited: {
      words: ['excited', 'amazing', 'love', 'awesome', '!', '!!!'],
      confidence: 0.8
    },
    stressed: {
      words: ['help', 'stuck', 'not sure', 'confused', 'worried', 'panic'],
      confidence: 0.7
    },
    casual: {
      words: ['hey', 'what about', 'thinking', 'maybe', 'something'],
      confidence: 0.6
    },
    formal: {
      words: ['recommend', 'prefer', 'occasion', 'event', 'professional'],
      confidence: 0.7
    },
    playful: {
      words: ['fun', 'haha', 'lol', 'cute', 'vibes', 'slay'],
      confidence: 0.75
    }
  }

  let detectedMood = 'casual'
  let highestConfidence = 0

  for (const [mood, { words, confidence }] of Object.entries(moods)) {
    const matches = words.filter(word => lowerText.includes(word)).length
    if (matches > 0 && confidence > highestConfidence) {
      detectedMood = mood
      highestConfidence = confidence * (matches / words.length)
    }
  }

  return {
    mood: detectedMood,
    confidence: Math.min(highestConfidence, 0.95)
  }
}

export function generateSystemPromptTone(style: ConversationStyle): string {
  switch (style.preferredTone) {
    case 'formal':
      return 'Use professional language. Be structured and precise. Reference fashion terminology appropriately.'
    case 'casual':
      return 'Use conversational, relaxed language. Be friendly and approachable. Use "I" and "you" naturally.'
    case 'playful':
      return 'Be fun and engaging. Use light humor where appropriate. Show enthusiasm and energy.'
    case 'supportive':
    default:
      return 'Be warm and encouraging. Validate their feelings and choices. Celebrate their style identity.'
  }
}

export function generateMoodContext(patterns: MoodPattern, detectedMood?: string): string {
  const topTimeOfDay = Object.entries(patterns.timeOfDay).sort(([, a], [, b]) => b - a)[0]?.[0] || 'any time'

  let context = `The user typically feels most engaged in the ${topTimeOfDay}.`

  if (detectedMood) {
    context += ` Right now they seem to be feeling ${detectedMood}.`
  }

  const season = Object.entries(patterns.season).sort(([, a], [, b]) => b - a)[0]?.[0]
  if (season) {
    context += ` Their style naturally shifts with the seasons, with a preference for ${season} aesthetics.`
  }

  return context
}

export function colorPaletteToHex(palette: string[]): Record<string, string> {
  const colorMap: Record<string, string> = {
    neutral: '#a0a0a0',
    black: '#000000',
    white: '#ffffff',
    cream: '#fffdd0',
    beige: '#f5f5dc',
    gray: '#808080',
    charcoal: '#36454f',
    navy: '#000080',
    blue: '#0000ff',
    teal: '#008080',
    green: '#008000',
    olive: '#808000',
    brown: '#a52a2a',
    rust: '#b7410e',
    burgundy: '#800020',
    red: '#ff0000',
    coral: '#ff7f50',
    peach: '#ffcccb',
    pink: '#ffc0cb',
    rose: '#ff007f',
    purple: '#800080',
    lavender: '#e6e6fa',
    plum: '#dda0dd',
    gold: '#ffd700',
    yellow: '#ffff00',
    orange: '#ffa500'
  }

  return palette.reduce((acc, color) => {
    const hex = colorMap[color.toLowerCase()] || '#cccccc'
    acc[color] = hex
    return acc
  }, {} as Record<string, string>)
}

export function scoreOutfitMatch(
  outfit: { colors?: string[]; occasion?: string; style?: string },
  dna: AgentDNA
): number {
  let score = 0

  if (outfit.colors) {
    const matchedColors = outfit.colors.filter(c =>
      dna.stylePersonality.colorPalette.some(p =>
        p.toLowerCase() === c.toLowerCase()
      )
    )
    score += (matchedColors.length / outfit.colors.length) * 30
  }

  if (outfit.occasion && dna.stylePersonality.occasionPreferences[outfit.occasion]) {
    score += dna.stylePersonality.occasionPreferences[outfit.occasion] * 10
  }

  if (outfit.style) {
    const isPreferred = dna.stylePersonality.archetypes.some(a =>
      a.toLowerCase() === outfit.style.toLowerCase()
    )
    if (isPreferred) score += 20
  }

  return Math.min(Math.round(score), 100)
}

export function sessionDurationText(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt)
  const end = endedAt ? new Date(endedAt) : new Date()
  const diffMs = end.getTime() - start.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}

export function summarizeMessages(messages: Array<{ role: string; content: string }>): string {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content)

  if (userMessages.length === 0) return 'New chat'
  if (userMessages.length === 1) return userMessages[0].substring(0, 50)

  const themes = new Set<string>()
  userMessages.forEach(msg => {
    if (msg.toLowerCase().includes('color') || msg.toLowerCase().includes('palette'))
      themes.add('colors')
    if (msg.toLowerCase().includes('occasion') || msg.toLowerCase().includes('event'))
      themes.add('occasion')
    if (msg.toLowerCase().includes('style') || msg.toLowerCase().includes('fit'))
      themes.add('style')
    if (msg.toLowerCase().includes('outfit') || msg.toLowerCase().includes('wear'))
      themes.add('outfits')
  })

  if (themes.size > 0) {
    return `Chat about ${Array.from(themes).join(', ')}`
  }

  return `${userMessages.length} messages`
}
