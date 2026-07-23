'use client'
import { useState } from 'react'

type Category = 'all' | 'stylist' | 'tailor' | 'thrift' | 'photographer' | 'brand'

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'stylist', label: 'Stylists', emoji: '💅' },
  { value: 'tailor', label: 'Tailors', emoji: '🧵' },
  { value: 'thrift', label: 'Thrift', emoji: '🛍️' },
  { value: 'photographer', label: 'Photographers', emoji: '📸' },
  { value: 'brand', label: 'Brands', emoji: '🏷️' },
]

const MOCK_PROVIDERS = [
  {
    id: '1', name: 'Layla Hassan', category: 'stylist', location: 'Cairo, Egypt',
    bio: 'Personal stylist specialising in quiet luxury & office aesthetics. 200+ clients styled.',
    avatar: '👩🏽', rating: 4.9, reviews: 48, rate: 'From $35/hr', verified: true,
    tags: ['Quiet Luxury', 'Office Siren', 'Colour Theory'],
  },
  {
    id: '2', name: 'Nour Atelier', category: 'tailor', location: 'Alexandria',
    bio: 'Custom alterations & bespoke tailoring. Same-week turnaround for most pieces.',
    avatar: '👩🏻', rating: 4.8, reviews: 31, rate: 'From $20/piece', verified: true,
    tags: ['Alterations', 'Bespoke', 'Fast turnaround'],
  },
  {
    id: '3', name: 'The Vintage Edit', category: 'thrift', location: 'Online',
    bio: 'Curated Y2K & vintage pieces. New drops every Friday.',
    avatar: '🛍️', rating: 4.7, reviews: 89, rate: 'Pieces from $8', verified: false,
    tags: ['Y2K', 'Vintage', 'Sustainable'],
  },
  {
    id: '4', name: 'Mia Shots', category: 'photographer', location: 'Dubai',
    bio: 'OOTD & brand photography. Aesthetic editorial shoots for personal branding.',
    avatar: '👩🏼', rating: 5.0, reviews: 22, rate: 'From $120/session', verified: true,
    tags: ['OOTD', 'Editorial', 'Personal Brand'],
  },
]

export default function MarketplacePage() {
  const [active, setActive] = useState<Category>('all')

  const filtered = active === 'all'
    ? MOCK_PROVIDERS
    : MOCK_PROVIDERS.filter(p => p.category === active)

  return (
    <div className="blob-bg min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="micro-label mb-3">Style ecosystem</div>
          <h1 className="display-serif text-5xl font-black text-[#1a1626] mb-3">
            Your <span className="gradient-text">style network</span>
          </h1>
          <p className="text-[#6d6875] text-lg max-w-xl mx-auto">
            Connect with stylists, tailors, vintage sellers, and photographers — all vetted for your vibe.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`vibe-pill text-sm transition-all ${
                active === cat.value
                  ? 'bg-[#7a4cf5] text-white border-[#7a4cf5] shadow-lg shadow-purple-200'
                  : 'bg-white text-[#4a4654] border-black/10 hover:border-[#7a4cf5]/40'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Provider grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(provider => (
            <a
              key={provider.id}
              href={`/marketplace/${provider.id}`}
              className="panel rounded-[2rem] p-6 card-hover block"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center text-3xl flex-shrink-0">
                  {provider.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1a1626]">{provider.name}</span>
                    {provider.verified && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">✓ Verified</span>
                    )}
                  </div>
                  <div className="text-xs text-[#9e97a8] mt-0.5">{provider.location}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-[#1a1626]">⭐ {provider.rating}</span>
                    <span className="text-xs text-[#9e97a8]">({provider.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-[#7a4cf5] text-right flex-shrink-0">{provider.rate}</div>
              </div>

              <p className="text-sm text-[#6d6875] leading-6 mb-4">{provider.bio}</p>

              <div className="flex flex-wrap gap-1.5">
                {provider.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#7a4cf5]">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Become a provider CTA */}
        <div className="mt-12 rounded-[2rem] bg-[#1a1626] p-8 text-center">
          <h2 className="display-serif text-3xl font-black text-white mb-3">
            Are you a stylist, tailor, or creator?
          </h2>
          <p className="text-white/60 mb-6 text-sm">Join the Sapphire provider network and reach thousands of style-conscious women.</p>
          <a href="/marketplace/apply" className="inline-flex rounded-full bg-[#7a4cf5] px-6 py-3 text-sm font-bold text-white hover:bg-[#8b5cf6] transition">
            Apply to join ✨
          </a>
        </div>
      </div>
    </div>
  )
}
