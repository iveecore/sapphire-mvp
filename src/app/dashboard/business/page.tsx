'use client'

const SECTIONS = [
  { emoji: '👥', label: 'Client Roster', desc: 'Manage your styling clients, notes, and session history.', cta: 'Add first client' },
  { emoji: '📅', label: 'Content Calendar', desc: 'Plan your outfit posts, reels, and brand campaign dates.', cta: 'Plan first post' },
  { emoji: '🤝', label: 'Brand Collabs', desc: 'Track outreach, active partnerships, fees, and deliverables.', cta: 'Log first collab' },
  { emoji: '💰', label: 'Revenue Tracker', desc: 'Styling fees, affiliate income, and commission history.', cta: 'Log first income' },
]

export default function BusinessPage() {
  return (
    <div className="blob-bg min-h-screen p-6 lg:p-10">
      {/* Beta banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 mb-6 flex items-center gap-3">
        <span className="text-xl">💼</span>
        <div>
          <span className="text-sm font-bold text-amber-800">Business mode · Beta</span>
          <span className="text-sm text-amber-700"> · Available on </span>
          <a href="/pricing" className="text-sm font-bold text-amber-800 underline">Muse plan</a>
        </div>
      </div>

      {/* Header */}
      <div className="rounded-[2rem] overflow-hidden mb-8" style={{background: 'linear-gradient(135deg, #1a1626, #2d1f4e)'}}>
        <div className="p-8">
          <div className="micro-label text-white/50 mb-2">For stylists, influencers & boutique owners</div>
          <h1 className="display-serif text-5xl font-black text-white">
            Business <span className="text-[#c084fc]">Mode 💼</span>
          </h1>
          <p className="text-white/60 mt-2">Your fashion empire, managed in one place.</p>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {SECTIONS.map(s => (
          <div key={s.label} className="panel rounded-[2rem] p-7 card-hover">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-rose-50 flex items-center justify-center text-2xl flex-shrink-0">
                {s.emoji}
              </div>
              <div>
                <div className="font-bold text-[#1a1626]">{s.label}</div>
                <p className="text-sm text-[#6d6875] leading-6 mt-1">{s.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/5 pt-4">
              <span className="text-2xl font-black gradient-text">0</span>
              <button className="rounded-full bg-[#7a4cf5] px-4 py-2 text-xs font-bold text-white hover:bg-[#6b3ee8] transition">
                + {s.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#7a4cf5] to-[#f43f7e] p-6 text-center">
        <div className="text-white font-bold text-lg mb-1">Unlock full Business mode</div>
        <p className="text-white/80 text-sm mb-4">Upgrade to Muse ($29/mo) for unlimited clients, collab tracking, and AI business insights.</p>
        <a href="/pricing" className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#7a4cf5] hover:bg-purple-50 transition">
          Upgrade to Muse →
        </a>
      </div>
    </div>
  )
}
