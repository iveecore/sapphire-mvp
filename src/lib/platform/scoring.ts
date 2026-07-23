import type { RecommendationItem, StyleAnswer, WardrobeItem } from './types'

function hasAnswer(answers: StyleAnswer[], questionId: string, value: string) {
  return answers.some((a) => a.questionId === questionId && a.answer === value)
}

function scoreBySignals(base: number, answers: StyleAnswer[], tags: string[]) {
  let score = base

  if (hasAnswer(answers, 'style-vibe', 'Minimalist') && tags.includes('minimal')) score += 8
  if (hasAnswer(answers, 'style-vibe', 'Casual') && tags.includes('casual')) score += 8
  if (hasAnswer(answers, 'priority', 'Comfort') && tags.includes('comfort')) score += 8
  if (hasAnswer(answers, 'priority', 'Quality') && tags.includes('quality')) score += 7
  if (hasAnswer(answers, 'budget', '$0-50') && tags.includes('budget-friendly')) score += 6
  if (hasAnswer(answers, 'budget', '$200+') && tags.includes('premium')) score += 6
  return Math.min(99, score)
}

export function buildRecommendationItems(answers: StyleAnswer[], wardrobe: WardrobeItem[] = []): RecommendationItem[] {
  const wardrobeBonus = wardrobe.length > 0 ? 4 : 0
  const candidates: Array<Omit<RecommendationItem, 'score'> & { baseScore: number }> = [
    {
      id: 'rec-summer-casual',
      name: 'Summer Casual',
      baseScore: 82,
      reason: 'Fits casual days and flexible comfort',
      tags: ['casual', 'comfort', 'budget-friendly']
    },
    {
      id: 'rec-office-ready',
      name: 'Office Ready',
      baseScore: 80,
      reason: 'Works for structured settings and polished days',
      tags: ['quality', 'smart', 'professional']
    },
    {
      id: 'rec-weekend-vibe',
      name: 'Weekend Vibe',
      baseScore: 81,
      reason: 'Easy to wear and simple to repeat',
      tags: ['casual', 'comfort', 'minimal']
    },
    {
      id: 'rec-night-out',
      name: 'Night Out',
      baseScore: 76,
      reason: 'More expressive with a stronger visual silhouette',
      tags: ['premium', 'statement']
    },
    {
      id: 'rec-gym-fit',
      name: 'Gym Fit',
      baseScore: 73,
      reason: 'Made for movement, airflow, and support',
      tags: ['comfort', 'active']
    },
    {
      id: 'rec-travel-chic',
      name: 'Travel Chic',
      baseScore: 79,
      reason: 'Balances comfort, layering, and easy packing',
      tags: ['comfort', 'travel', 'quality']
    }
  ]

  return candidates
    .map((item) => ({
      id: item.id,
      name: item.name,
      score: scoreBySignals(item.baseScore + wardrobeBonus, answers, item.tags),
      reason: item.reason,
      tags: item.tags
    }))
    .sort((a, b) => b.score - a.score)
}

