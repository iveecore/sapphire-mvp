'use client'
import { useState } from 'react'

const quizQuestions = [
  { id: 1, question: 'What\'s your style vibe?', options: ['Casual', 'Formal', 'Athletic', 'Minimalist'] },
  { id: 2, question: 'Favorite colors?', options: ['Neutrals', 'Pastels', 'Bold', 'Earth tones'] },
  { id: 3, question: 'Budget per outfit?', options: ['$0-50', '$50-100', '$100-200', '$200+'] },
  { id: 4, question: 'Lifestyle?', options: ['Office', 'Casual', 'Active', 'Mixed'] },
  { id: 5, question: 'Priority?', options: ['Comfort', 'Trend', 'Quality', 'Sustainability'] },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Quiz Complete! 🎉</h2>
          <p className="text-gray-600 mb-8">
            Your style profile is ready. We've matched you with 6 personalized outfit recommendations based on your preferences.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            See My Recommendations
          </a>
          <button
            onClick={resetQuiz}
            className="block w-full mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1}/{quizQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition font-medium text-gray-900"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
