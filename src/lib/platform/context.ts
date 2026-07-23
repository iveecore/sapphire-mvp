import type { StyleAnswer } from './types'

export function answersToContext(answers: StyleAnswer[]) {
  const map = Object.fromEntries(answers.map((a) => [a.questionId, a.answer]))
  return {
    vibe: map['style-vibe'] ?? null,
    colors: map['favorite-colors'] ?? null,
    budget: map['budget'] ?? null,
    lifestyle: map['lifestyle'] ?? null,
    priority: map['priority'] ?? null
  }
}

