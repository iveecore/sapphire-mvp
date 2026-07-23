'use client'
import { useState, useCallback } from 'react'

const OUTFITS = [
  { id: 1, combo: ['👗 Slip dress', '👜 Mini bag', '👟 Platform sneakers'], vibe: 'Y2K Revival' },
  { id: 2, combo: ['🧥 Blazer', '👖 Wide-leg trousers', '👠 Pointed heels'], vibe: 'Office Siren' },
  { id: 3, combo: ['👕 Oversized tee', '🩳 Biker shorts', '🧢 Baseball cap'], vibe: 'Street Chic' },
  { id: 4, combo: ['🫧 Linen set', '🧺 Woven bag', '🩴 Strappy sandals'], vibe: 'Coastal Girl' },
  { id: 5, combo: ['🖤 Corset top', '🖤 Maxi skirt', '🥾 Combat boots'], vibe: 'Dark Feminine' },
  { id: 6, combo: ['🤍 Cashmere knit', '🤍 Tailored trousers', '💼 Leather tote'], vibe: 'Quiet Luxury' },
]

export default function StyleClashGame() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [tokens, setTokens] = useState(0)
  const [drag, setDrag] = useState<'left' | 'right' | null>(null)
  const [done, setDone] = useState(false)

  const outfit = OUTFITS[index]

  const swipe = useCallback((direction: 'left' | 'right') => {
    setDrag(direction)
    setTimeout(() => {
      setDrag(null)
      const next = index + 1
      if (direction === 'right') setScore(s => s + 1)
      if (next >= OUTFITS.length) {
        setTokens(5)
        setDone(true)
      } else {
        setIndex(next)
      }
    }, 350)
  }, [index])

  if (done) {
    return (
      <div className="blob-bg min-h-screen flex items-center justify-center px-4">
        <div className="panel rounded-[2rem] p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="display-serif text-4xl font-black text-[#1a1626] mb-2">Session done!</h2>
          <p className="text-[#6d6875] mb-6">You vibed with {score} of {OUTFITS.length} looks.</p>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 mb-6">
            <div className="text-2xl font-black text-emerald-700">+{tokens} tokens</div>
            <div className="text-sm text-emerald-600">added to your balance</div>
          </div>
          <a href="/games" className="inline-flex rounded-full bg-[#7a4cf5] px-6 py-3 text-sm font-bold text-white hover:bg-[#6b3ee8] transition">
            Back to games
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="blob-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="micro-label mb-1">Style Clash</div>
          <div className="text-sm text-[#9e97a8]">{index + 1} / {OUTFITS.length}</div>
        </div>

        {/* Card */}
        <div
          className={`panel rounded-[2rem] p-7 transition-all duration-300 ${
            drag === 'left' ? '-rotate-12 opacity-0 -translate-x-20' :
            drag === 'right' ? 'rotate-12 opacity-0 translate-x-20' : ''
          }`}
        >
          <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-100 to-rose-100 p-6 mb-4 text-center">
            <span className="vibe-pill bg-white text-[#7a4cf5] border-[#7a4cf5]/20 mb-3 inline-block">
              {outfit.vibe}
            </span>
            <ul className="space-y-2 text-left">
              {outfit.combo.map((item, i) => (
                <li key={i} className="text-sm font-medium text-[#1a1626] bg-white/60 rounded-xl px-3 py-2">{item}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-center text-[#9e97a8]">Swipe or tap a button</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => swipe('left')}
            className="w-16 h-16 rounded-full bg-white border-2 border-red-200 text-2xl hover:bg-red-50 transition shadow-lg"
          >
            ✕
          </button>
          <button
            onClick={() => swipe('right')}
            className="w-16 h-16 rounded-full bg-[#7a4cf5] text-2xl text-white hover:bg-[#6b3ee8] transition shadow-lg shadow-purple-200"
          >
            ♥
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-[#9e97a8]">
          ✕ Skip &nbsp;·&nbsp; ♥ Love it
        </div>
      </div>
    </div>
  )
}
