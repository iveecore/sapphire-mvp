export type PrivacySettings = {
  allow_personalization: boolean
  allow_community_visibility: boolean
  allow_marketing_emails: boolean
}

export type ProfileState = 'draft' | 'onboarding' | 'complete' | 'archived'

export type StyleAnswer = {
  questionId: string
  question: string
  answer: string
}

export type RecommendationItem = {
  id: string
  name: string
  score: number
  reason: string
  tags: string[]
}

export type WardrobeItem = {
  id: string
  name: string
  category: string
  color?: string | null
  occasion?: string | null
  confidence_score: number
}

