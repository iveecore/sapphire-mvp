'use client'
import { useEffect, useState } from 'react'
import type { WardrobeItem } from '@/lib/platform/types'

export default function ClosetPage() {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile/state').then(r => r.json()).then(d => {
      setWardrobe(d.wardrobe ?? [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto space-y-5">
      <div>
        <div className="micro-label mb-1">My closet</div>
        <h1 className="display-serif text-3xl font-black text-[#1a1626]">Your <span className="gradient-text">wardrobe.</span></h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="shimmer h-48 rounded-[1.75rem]" />)}
        </div>
      ) : wardrobe.length === 0 ? (
        <div className="panel rounded-[2rem] p-12 text-center">
          <div className="text-5xl mb-4">👗</div>
          <div className="text-sm font-semibold text-[#1a1626] mb-1">Your closet is empty</div>
          <p className="text-xs text-[#9e97a8] mb-4">Upload photos of your clothes to get started.</p>
          <a href="/dashboard/fits" className="inline-flex items-center gap-2 rounded-full bg-[#7a4cf5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3ee8] transition">
            Get outfit suggestions →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wardrobe.map(item => (
            <div key={item.id} className="panel rounded-[1.75rem] p-4 card-hover">
              <div className="h-32 rounded-2xl bg-gradient-to-br from-purple-50 to-rose-50 flex items-center justify-center text-4xl mb-3">👕</div>
              <div className="text-sm font-bold text-[#1a1626]">{item.name}</div>
              <div className="text-xs text-[#9e97a8]">{item.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
