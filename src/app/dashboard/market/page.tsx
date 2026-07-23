'use client'
import { useState } from 'react'

const PROVIDERS = [
  { name: 'Layla Hassan', type: 'Personal Stylist', rating: 4.9, reviews: 128, price: '$80/session', location: 'Cairo, EG', emoji: '👩🏽', tags: ['Quiet Luxury', 'Office Siren', 'Dark Feminine'] },
  { name: 'Sofia Chen', type: 'Wardrobe Curator', rating: 5.0, reviews: 74, price: '$60/session', location: 'Dubai, AE', emoji: '👩🏻', tags: ['Minimalist', 'Y2K', 'Boho'] },
  { name: 'Amara Osei', type: 'Personal Stylist', rating: 4.8, reviews: 203, price: '$100/session', location: 'London, UK', emoji: '👩🏾', tags: ['Streetwear', 'Glam', 'Afrocentric'] },
  { name: 'Yuki Tanaka', type: 'Alterations & Tailor', rating: 4.9, reviews: 56, price: '$35/piece', location: 'Online', emoji: '🧵', tags: ['Alterations', 'Custom Fit', 'Repair'] },
  { name: 'Zara Boutique', type: 'Vintage Reseller', rating: 4.7, reviews: 312, price: 'From $15', location: 'Online', emoji: '🛍️', tags: ['Vintage', 'Y2K', 'Thrift'] },
  { name: 'Lens & Style', type: 'Outfit Photography', rating: 5.0, reviews: 41, price: '$150/shoot', location: 'Cairo, EG', emoji: '📸', tags: ['Content', 'Editorial', 'OOTD'] },
]

const FILTERS = ['All', 'Stylists', 'Tailors', 'Resellers', 'Photographers']

export default function MarketPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PROVIDERS.filter(p => {
    const matchFilter = filter === 'All'
      || (filter === 'Stylists' && p.type.includes('Stylist'))
      || (filter === 'Tailors' && p.type.includes('Tailor'))
      || (filter === 'Resellers' && p.type.includes('Reseller'))
      || (filter === 'Photographers' && p.type.includes('Photo'))
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto space-y-5">
      <div>
        <div className="micro-label mb-1">Marketplace</div>
        <h1 className="display-serif text-3xl font-black text-[#1a1626]">Find your <span className="gradient-text">style team.</span></h1>
        <p className="text-sm text-[#9e97a8] mt-1">Stylists, tailors, photographers, and curated shops — all vetted for Sapphire women.</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, vibe, or service..."
          className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/20"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === f ? 'bg-[#7a4cf5] text-white' : 'bg-white border border-black/10 text-[#6d6875] hover:border-[#7a4cf5]/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Provider grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.name} className="panel rounded-[1.75rem] p-5 card-hover">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center text-2xl shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1a1626]">{p.name}</div>
                <div className="text-xs text-[#9e97a8]">{p.type} · {p.location}</div>
                <div className="text-xs font-semibold text-amber-500 mt-0.5">⭐ {p.rating} ({p.reviews} reviews)</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.tags.map(t => (
                <span key={t} className="rounded-full bg-[#f3edff] px-2.5 py-0.5 text-xs font-semibold text-[#7a4cf5]">{t}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1a1626]">{p.price}</span>
              <button className="rounded-full bg-[#1a1626] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d2838] transition">
                Book →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-[#9e97a8] py-4">
        Live booking + payments coming soon · Powered by open-source marketplace infrastructure
      </div>
    </div>
  )
}
