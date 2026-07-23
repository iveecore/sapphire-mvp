'use client'

import { useEffect, useState } from 'react'
import type { ElementType } from 'react'
import { ArrowRight, Sparkles, Shirt, Heart, Plus } from 'lucide-react'
import type { RecommendationItem, WardrobeItem } from '@/lib/platform/types'

type ProfileStatePayload = {
  profile: { status?: string } | null
  wardrobe: WardrobeItem[]
  recommendationRuns: Array<{
    id: string
    created_at: string
    recommendation_items: RecommendationItem[]
  }>
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'wardrobe' | 'achievements'>('recommendations')
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [profileStatus, setProfileStatus] = useState('draft')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/profile/state')
        const payload = (await res.json()) as ProfileStatePayload & { error?: string }
        if (!res.ok) throw new Error(payload.error ?? 'Could not load dashboard.')

        setWardrobe(payload.wardrobe ?? [])
        setRecommendations(payload.recommendationRuns?.[0]?.recommendation_items ?? [])
        setProfileStatus(payload.profile?.status ?? 'draft')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load dashboard.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const achievements = [
    { icon: Sparkles, label: 'Style Starter' },
    { icon: Shirt, label: 'Quiz Master' },
    { icon: Heart, label: 'Community Helper' },
    { icon: ArrowRight, label: 'Fashion Forward' }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="glass rounded-[2rem] p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="micro-label">Daily control center</div>
              <h1 className="display-title mt-3 text-4xl sm:text-5xl font-semibold text-[#1f1f26] leading-tight">
                Your wardrobe, memory, and next best move.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#6d6875] leading-8">
                Sapphire keeps the styling loop calm and personal. Check recommendations, tune fit, and add wardrobe items from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/quiz" className="inline-flex items-center gap-2 rounded-full bg-[#1f1f26] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2838]">
                <Sparkles size={16} /> Take style quiz
              </a>
              <a href="/profile" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1f1f26] hover:bg-black/5">
                <Plus size={16} /> Update fit profile
              </a>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[#6d6875] hover:bg-black/5">
                Log out
              </button>
            </div>
          </div>

          {error && <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-white/85">
            <div className="border-b border-black/5 flex overflow-x-auto">
            {[
              ['recommendations', 'recommendations'],
              ['wardrobe', 'wardrobe'],
              ['achievements', 'achievements']
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`px-6 py-4 font-medium capitalize whitespace-nowrap ${
                  activeTab === key
                    ? 'border-b-2 border-[#7a4cf5] text-[#1f1f26]'
                    : 'text-[#6d6875] hover:text-[#1f1f26]'
                }`}
              >
                {label}
              </button>
            ))}
            </div>

            <div className="p-5 sm:p-6">
              {loading && <p className="text-sm text-[#6d6875]">Loading your state...</p>}

              {!loading && activeTab === 'recommendations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {recommendations.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-10 text-center text-[#6d6875] bg-[#fcfbfa]">
                      No recommendations yet. Complete the quiz to generate your first run.
                    </div>
                  )}
                  {recommendations.map((item) => (
                    <div key={item.id} className="group rounded-[1.75rem] border border-black/5 bg-[#fcfbfa] p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(23,18,40,0.10)]">
                      <div className="relative h-52 overflow-hidden rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(122,76,245,0.18),rgba(217,86,114,0.15),rgba(15,118,110,0.14))]">
                        <div className="absolute inset-0 opacity-70 hero-grid" />
                        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#1f1f26]">
                          {item.score}% match
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-[#1f1f26]">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6d6875]">{item.reason}</p>
                      <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f1f26] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2d2838]">
                        View Details
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!loading && activeTab === 'wardrobe' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {wardrobe.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-10 text-center text-[#6d6875] bg-[#fcfbfa]">
                      Your wardrobe is empty. Add a few items to make recommendations smarter.
                    </div>
                  )}
                  {wardrobe.map((item) => (
                    <div key={item.id} className="rounded-[1.75rem] border border-black/5 bg-[#fcfbfa] p-4">
                      <div className="h-40 rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(122,76,245,0.14),rgba(217,86,114,0.12))]" />
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1f1f26]">{item.name}</h3>
                          <p className="text-sm text-[#6d6875]">{item.category}</p>
                        </div>
                        <div className="rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-semibold text-[#0f766e]">
                          {item.confidence_score}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && activeTab === 'achievements' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map(({ icon: IconComp, label }) => {
                    return (
                      <div key={label} className="rounded-[1.75rem] border border-black/5 bg-[#fcfbfa] p-6 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f26] text-white">
                          <IconComp size={18} />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-[#1f1f26]">{label}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
