export type StylePersonality = {
  archetypes: string[]
  colorPalette: string[]
  occasionPreferences: Record<string, number>
  silhouettePreferences: string[]
  budget: 'budget' | 'mid' | 'luxury'
  sustainability: number
  confidenceScore: number
}

export type BodyProfileSummary = {
  measurements?: Record<string, string>
  fitPreferences: Record<string, string>
  bodyShape?: string
  skinTone?: string
  heightApprox?: string
}

export type MoodPattern = {
  timeOfDay: Record<string, number>
  season: Record<string, number>
  eventType: Record<string, number>
  mood: Record<string, number>
}

export type ConversationStyle = {
  preferredTone: 'formal' | 'casual' | 'playful' | 'supportive'
  detectedHumor: boolean
  verbosity: 'concise' | 'detailed'
  responseTimePreference: 'quick' | 'thorough'
}

export type AgentDNA = {
  id: string
  userId: string
  agentName: string
  personaName: string
  stylePersonality: StylePersonality
  bodyProfileSummary: BodyProfileSummary
  moodPatterns: MoodPattern
  conversationStyle: ConversationStyle
  totalMessagesExchanged: number
  lastActiveAt: string
  createdAt: string
  updatedAt: string
}

export type AgentSession = {
  id: string
  userId: string
  sessionToken: string
  startedAt: string
  lastActivityAt: string
  endedAt: string | null
  messageCount: number
  tokensUsedInSession: number
  contextSnapshot: AgentDNA
  createdAt: string
}

export type AgentMessage = {
  id: string
  userId: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  tokensConsumed: number | null
  metadata: {
    mood?: string
    moodConfidence?: number
    responseTimeMs?: number
  }
  createdAt: string
}

export type TokenBalance = {
  userId: string
  balance: number
  totalPurchased: number
  totalEarnedFree: number
  totalConsumed: number
  updatedAt: string
  createdAt: string
}

export type TokenTransaction = {
  id: string
  userId: string
  amount: number
  reason: 'purchase' | 'message_consumption' | 'signup_bonus' | 'event_earned'
  referenceId?: string
  createdAt: string
}

export type AnthropicUsage = {
  inputTokens: number
  outputTokens: number
}

export type StreamEventToken = {
  type: 'token'
  token: string
}

export type StreamEventDone = {
  type: 'done'
  data: {
    tokensUsed: number
    sessionId: string
  }
}

export type StreamEventError = {
  type: 'error'
  error: string
}

export type StreamEvent = StreamEventToken | StreamEventDone | StreamEventError
