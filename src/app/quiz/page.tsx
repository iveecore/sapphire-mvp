'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

const quizQuestions = [
  { id: 'style-vibe', question: "What's your style vibe?", options: ['Casual', 'Formal', 'Athletic', 'Minimalist'] },
  { id: 'favorite-colors', question: 'Favorite colors?', options: ['Neutrals', 'Pastels', 'Bold', 'Earth tones'] },
  { id: 'budget', question: 'Budget per outfit?', options: ['$0-50', '$50-100', '$100-200', '$200+'] },
  { id: 'lifestyle', question: 'Lifestyle?', options: ['Office', 'Casual', 'Active', 'Mixed'] },
  { id: 'priority', question: 'Priority?', options: ['Comfort', 'Trend', 'Quality', 'Sustainability'] }
]

type QuizAnswer = {
  questionId: string
  question: string
  answer: string
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const summary = useMemo(
    () =>
      answers.reduce<Record<string, string>>((acc, item) => {
        acc[item.questionId] = item.answer
        return acc
      }, {}),
    [answers]
  )

  const handleAnswer = async (answer: string) => {
    const nextAnswers = [...answers, { questionId: current.id, question: current.question, answer }]
    setAnswers(nextAnswers)
    window.sessionStorage.setItem('sapphire_quiz_answers', JSON.stringify(nextAnswers))

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((value) => value + 1)
      return
    }

    setLoading(true)
    setError('')

    try {
      const save = await fetch('/api/onboarding/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: nextAnswers, status: 'complete' })
      })

      if (!save.ok) {
        const payload = await save.json()
        throw new Error(payload.error ?? 'Could not save quiz answers.')
      }

      await fetch('/api/recommendations/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate: true })
      })

      window.sessionStorage.removeItem('sapphire_quiz_answers')
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not finish the quiz.')
    } finally {
      setLoading(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setError('')
    window.sessionStorage.removeItem('sapphire_quiz_answers')
  }

  if (showResults) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass rounded-[2rem] p-6 sm:p-8">
            <div className="micro-label">Profile built</div>
            <h1 className="display-title mt-4 text-4xl sm:text-5xl font-semibold text-[#1f1f26]">Your style profile is live.</h1>
            <p className="mt-4 text-base sm:text-lg leading-8 text-[#6d6875]">
              Sapphire has stored your answers and started shaping recommendations around your daily reality.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[#1f1f26] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2838]">
                Open dashboard <ArrowRight size={16} />
              </a>
              <button onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1f1f26] hover:bg-black/5">
                Retake quiz
              </button>
            </div>
          </div>

          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e]/10 text-[#0f766e]">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1f1f26]">Captured context</div>
                <div className="text-sm text-[#6d6875]">Used for fit-aware recommendations</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="rounded-2xl bg-[#fbfaf8] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6875]">{key}</div>
                  <div className="mt-2 text-sm font-medium text-[#1f1f26]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="glass rounded-[2rem] p-6 sm:p-8 sticky top-24 self-start">
          <div className="micro-label">Onboarding</div>
          <h1 className="display-title mt-4 text-4xl font-semibold text-[#1f1f26]">Build your fit profile.</h1>
          <p className="mt-4 text-sm sm:text-base leading-7 text-[#6d6875]">
            We use your answers to make recommendations feel personal, practical, and less random.
          </p>

          <div className="mt-8 rounded-[1.5rem] bg-[#1f1f26] p-5 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
              <Sparkles size={14} /> Live progress
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#7a4cf5] via-[#d95672] to-[#0f766e]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 text-sm text-white/70">
              Step {currentQuestion + 1} of {quizQuestions.length}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {answers.map((item, index) => (
              <div key={item.questionId} className="rounded-2xl border border-black/5 bg-[#fcfbfa] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6875]">
                  {index + 1}. {item.questionId}
                </div>
                <div className="mt-2 text-sm font-medium text-[#1f1f26]">{item.answer}</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="panel rounded-[2rem] p-5 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="micro-label">Question {currentQuestion + 1}</div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#1f1f26]">{current.question}</h2>
            </div>
            <div className="rounded-full bg-[#7a4cf5]/10 px-3 py-1 text-xs font-semibold text-[#7a4cf5]">
              {Math.round(progress)}%
            </div>
          </div>

          {error && <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={loading}
                className="group rounded-[1.5rem] border border-black/8 bg-[#fcfbfa] p-5 text-left transition hover:-translate-y-1 hover:border-[#7a4cf5]/30 hover:shadow-[0_16px_40px_rgba(23,18,40,0.08)] disabled:opacity-60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-semibold text-[#1f1f26]">{option}</div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#7a4cf5] transition group-hover:translate-x-1">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {loading && <p className="mt-5 text-sm text-[#6d6875]">Saving your profile and generating recommendations...</p>}
        </section>
      </div>
    </div>
  )
}
