'use client'
import { useEffect, useState } from 'react'
import type { RecommendationItem } from '@/lib/platform/types'

export default function FitsPage() {
  const [fits, setFits] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile/state').then(r => r.json()).then(d => {
      setFits(d.recommendationRuns?.[0]?.recommendation_items ?? [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="micro-label mb-1">AI styling</div>
          <h1 className="display-serif text-3xl font-black text-[#1a1626]">Your <span className="gradient-text">fits.</span></h1>
        </div>
        <a href="/quiz" className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d2838] transition">
          ✨ Regenerate
        </a>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="shimmer h-64 rounded-[1.75rem]" />)}
        </div>
      ) : fits.length === 0 ? (
        <div className="panel rounded-[2rem] p-12 text-center">
          <div className="text-5xl mb-4">✨</div>
          <div className="text-sm font-semibold text-[#1a1626] mb-1">No fits yet</div>
          <p className="text-xs text-[#9e97a8] mb-4">Complete your style quiz to generate AI outfit recommendations.</p>
          <a href="/quiz" className="inline-flex items-center gap-2 rounded-full bg-[#7a4cf5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3ee8] transition">
            Take style quiz →
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fits.map(fit => (
            <div key={fit.id} className="panel rounded-[1.75rem] overflow-hidden card-hover">
              <div className="bg-gradient-to-br from-[#f3edff] to-[#fce4f0] p-5 h-36 flex items-end">
                <span className="rounded-full bg-[#7a4cf5] text-white px-3 py-1 text-xs font-bold">{fit.score}% match</span>
              </div>
              <div className="p-4">
                <div className="text-sm font-bold text-[#1a1626] mb-1">{fit.name}</div>
                <p className="text-xs text-[#6d6875] leading-5">{fit.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
