import { z } from 'zod'

export const styleAnswerSchema = z.object({
  questionId: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1)
})

export const onboardingSchema = z.object({
  answers: z.array(styleAnswerSchema).min(1),
  status: z.enum(['draft', 'onboarding', 'complete']).default('complete')
})

export const wardrobeItemSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(80),
  color: z.string().max(50).optional().nullable(),
  occasion: z.string().max(80).optional().nullable(),
  confidence_score: z.number().int().min(0).max(100).default(50)
})

export const feedbackSchema = z.object({
  recommendationId: z.string().min(1),
  outcome: z.enum(['accepted', 'rejected', 'saved', 'worn', 'skipped']),
  note: z.string().max(500).optional().nullable()
})

