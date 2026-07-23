'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const APPS = [
  { emoji: '📝', name: 'Studio', desc: 'Your style journal & mood board', href: '/dashboard/studio', color: 'from-violet-100 to-purple-50' },
  { emoji: '📊', name: 'Sheets', desc: 'Budget tracker & shopping lists', href: '/dashboard/sheets', color: 'from-rose-100 to-pink-50' },
  { emoji: '🛍', name: 'Market', desc: 'Find stylists, tailors & shops', href: '/dashboard/market', color: 'from-orange-100 to-amber-50' },
  { emoji: '🎮', name: 'Games', desc: 'Style games & earn tokens', href: '/dashboard/games', color: 'from-emerald-100 to-teal-50' },
]

const VIBES = ['Cozy 🧸', 'Elevated 👑', 'Chaotic ⚡']

const STATS = [
  { label: 'Items in closet', value: '0', icon: '👗' },
  { label: 'Fits generated', value: '0', icon: '✨' },
  { label: 'Tokens left', value: '100', icon: '💎' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', emoji: '✨' }
  if (h < 18) return { text: 'Good afternoon', emoji: '🌸' }
  return { text: 'Good evening', emoji: '🌙' }
}

export default function DashboardHome() {
  const [vibe, setVibe] = useState('Elevated 👑')
  const [greeting, setGreeting] = useState({ text: 'Good morning', emoji: '✨' })

  useEffect(() => { setGreeting(getGreeting()) }, [])

  return (
    <div className="blob-bg min-h-screen p-6 lg:p-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="display-serif text-4xl font-black text-[#1a1626]">
          {greeting.text} {greeting.emoji}
        </h1>
        <p className="text-[#6d6875] mt-1">Your style OS is ready. What are we doing today?</p>
      </div>

      {/* Vibe selector */}
      <div className="panel rounded-2xl p-5 mb-6">
        <div className="micro-label mb-3">Your vibe today</div>
        <div className="flex flex-wrap gap-2">
          {VIBES.map(v => (
            <button
              key={v}
              onClick={() => setVibe(v)}
              className={`vibe-pill text-sm transition-all ${
                vibe === v
                  ? 'bg-[#7a4cf5] text-white border-[#7a4cf5] shadow-lg shadow-purple-200'
                  : 'bg-white text-[#4a4654] border-black/10 hover:border-[#7a4cf5]/40'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Today's fit card */}
      <div className="rounded-2xl mb-6 overflow-hidden" style={{background: 'linear-gradient(135deg, #1a1626 0%, #2d1f4e 60%, #1a1626 100%)'}}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="micro-label text-white/50 mb-2">Today's fit · {vibe}</div>
            <div className="text-white text-xl font-bold mb-1">Your AI is building your look</div>
            <p className="text-white/60 text-sm">Add items to your closet to get personalized daily fits.</p>
            <Link href="/dashboard/closet" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#7a4cf5] px-5 py-2 text-sm font-bold text-white hover:bg-[#8b5cf6] transition">
              Build my closet →
            </Link>
          </div>
          <div className="text-6xl hidden sm:block">👗</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="panel rounded-2xl p-4 text-center card-hover">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black gradient-text">{s.value}</div>
            <div className="text-xs text-[#9e97a8] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* App launcher */}
      <div className="micro-label mb-3">Quick launch</div>
      <div className="grid grid-cols-2 gap-3">
        {APPS.map(app => (
          <Link key={app.name} href={app.href} className="panel rounded-2xl p-5 card-hover flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl flex-shrink-0`}>
              {app.emoji}
            </div>
            <div>
              <div className="font-bold text-[#1a1626] text-sm">{app.name}</div>
              <div className="text-xs text-[#6d6875] mt-0.5 leading-5">{app.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
