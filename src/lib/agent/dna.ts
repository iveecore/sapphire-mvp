import type { SupabaseClient } from '@supabase/supabase-js'
import type { AgentDNA, StylePersonality, BodyProfileSummary, MoodPattern, ConversationStyle } from './types'
import { createSupabaseServiceClient, createSupabaseUserClient } from '@/lib/supabase/server'
import type { AppSession } from '@/lib/auth/session'

function deriveStylePersonality(styleAnswers: any[], styleProfile: any): StylePersonality {
  return {
    archetypes: styleProfile?.archetypes ?? ['minimalist'],
    colorPalette: styleProfile?.color_palette ?? ['neutral', 'black', 'white'],
    occasionPreferences: styleProfile?.occasion_preferences ?? { casual: 0.8, work: 0.6, evening: 0.4 },
    silhouettePreferences: styleProfile?.silhouette_preferences ?? ['fitted', 'relaxed'],
    budget: styleProfile?.budget ?? 'mid',
    sustainability: styleProfile?.sustainability_score ?? 5,
    confidenceScore: styleProfile?.confidence_score ?? 50
  }
}

function deriveBodyProfileSummary(bodyProfile: any): BodyProfileSummary {
  return {
    measurements: bodyProfile?.measurements ?? {},
    fitPreferences: bodyProfile?.fit_preferences ?? {},
    bodyShape: bodyProfile?.body_shape,
    skinTone: bodyProfile?.skin_tone,
    heightApprox: bodyProfile?.height_approx
  }
}

function initializeMoodPatterns(): MoodPattern {
  return {
    timeOfDay: { morning: 0.3, afternoon: 0.4, evening: 0.3 },
    season: { spring: 0.25, summer: 0.25, fall: 0.25, winter: 0.25 },
    eventType: { casual: 0.5, work: 0.3, social: 0.2 },
    mood: { confident: 0.3, relaxed: 0.4, adventurous: 0.3 }
  }
}

function initializeConversationStyle(): ConversationStyle {
  return {
    preferredTone: 'supportive',
    detectedHumor: false,
    verbosity: 'detailed',
    responseTimePreference: 'thorough'
  }
}

export async function hydrateAgentDNA(userId: string): Promise<AgentDNA> {
  const supabase = createSupabaseServiceClient()

  const [agentDnaResult, styleProfileResult, bodyProfileResult, styleAnswersResult] = await Promise.all([
    supabase.from('agent_dna').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('style_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('body_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('style_answers').select('*').eq('user_id', userId).order('created_at', { ascending: true })
  ])

  const agentDna = agentDnaResult.data
  const styleProfile = styleProfileResult.data
  const bodyProfile = bodyProfileResult.data
  const styleAnswers = styleAnswersResult.data ?? []

  if (!agentDna) {
    const freshDNA: AgentDNA = {
      id: crypto.randomUUID(),
      userId,
      agentName: 'Sapphire',
      personaName: 'Jasmine',
      stylePersonality: deriveStylePersonality(styleAnswers, styleProfile),
      bodyProfileSummary: deriveBodyProfileSummary(bodyProfile),
      moodPatterns: initializeMoodPatterns(),
      conversationStyle: initializeConversationStyle(),
      totalMessagesExchanged: 0,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await supabase.from('agent_dna').insert(freshDNA)
    return freshDNA
  }

  return {
    id: agentDna.id,
    userId: agentDna.user_id,
    agentName: agentDna.agent_name ?? 'Sapphire',
    personaName: agentDna.persona_name ?? 'Jasmine',
    stylePersonality: agentDna.style_personality ?? deriveStylePersonality(styleAnswers, styleProfile),
    bodyProfileSummary: agentDna.body_profile_summary ?? deriveBodyProfileSummary(bodyProfile),
    moodPatterns: agentDna.mood_patterns ?? initializeMoodPatterns(),
    conversationStyle: agentDna.conversation_style ?? initializeConversationStyle(),
    totalMessagesExchanged: agentDna.total_messages_exchanged ?? 0,
    lastActiveAt: agentDna.last_active_at,
    createdAt: agentDna.created_at,
    updatedAt: agentDna.updated_at
  }
}

export async function updateAgentDNA(userId: string, updates: Partial<AgentDNA>): Promise<void> {
  const supabase = createSupabaseServiceClient()

  const payload: Record<string, any> = {
    updated_at: new Date().toISOString()
  }

  if (updates.agentName !== undefined) payload.agent_name = updates.agentName
  if (updates.personaName !== undefined) payload.persona_name = updates.personaName
  if (updates.stylePersonality !== undefined) payload.style_personality = updates.stylePersonality
  if (updates.bodyProfileSummary !== undefined) payload.body_profile_summary = updates.bodyProfileSummary
  if (updates.moodPatterns !== undefined) payload.mood_patterns = updates.moodPatterns
  if (updates.conversationStyle !== undefined) payload.conversation_style = updates.conversationStyle
  if (updates.totalMessagesExchanged !== undefined) payload.total_messages_exchanged = updates.totalMessagesExchanged
  if (updates.lastActiveAt !== undefined) payload.last_active_at = updates.lastActiveAt

  await supabase
    .from('agent_dna')
    .update(payload)
    .eq('user_id', userId)
}

export async function updateConversationStyle(userId: string, messages: string[]): Promise<void> {
  const dna = await hydrateAgentDNA(userId)

  const detectedHumor = messages.some(msg =>
    /[😄😅🤣😂😆]|lol|haha|funny|lmao/.test(msg.toLowerCase())
  )

  const isVerbose = messages.some(msg => msg.length > 200)

  const updatedStyle: ConversationStyle = {
    ...dna.conversationStyle,
    detectedHumor: detectedHumor || dna.conversationStyle.detectedHumor,
    verbosity: isVerbose ? 'detailed' : dna.conversationStyle.verbosity
  }

  await updateAgentDNA(userId, { conversationStyle: updatedStyle })
}

export async function updateMoodPatterns(userId: string, detectedMood: string, eventContext?: string): Promise<void> {
  const dna = await hydrateAgentDNA(userId)
  const moodPatterns = { ...dna.moodPatterns }

  if (moodPatterns.mood[detectedMood]) {
    moodPatterns.mood[detectedMood] += 0.05
  } else {
    moodPatterns.mood[detectedMood] = 0.05
  }

  if (eventContext && moodPatterns.eventType[eventContext]) {
    moodPatterns.eventType[eventContext] += 0.03
  }

  const now = new Date()
  const hour = now.getHours()
  if (hour < 12) moodPatterns.timeOfDay.morning += 0.02
  else if (hour < 18) moodPatterns.timeOfDay.afternoon += 0.02
  else moodPatterns.timeOfDay.evening += 0.02

  await updateAgentDNA(userId, { moodPatterns })
}

export async function getAgentName(userId: string): Promise<string> {
  const dna = await hydrateAgentDNA(userId)
  return dna.agentName
}

export async function setAgentName(userId: string, name: string): Promise<void> {
  if (!name || name.length < 2 || name.length > 30) {
    throw new Error('Agent name must be 2-30 characters')
  }
  await updateAgentDNA(userId, { agentName: name })
}
