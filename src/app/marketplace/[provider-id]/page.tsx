'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

const MOCK: Record<string, {
  name: string; avatar: string; category: string; bio: string; location: string;
  rating: number; reviews: number; verified: boolean; tags: string[];
  listings: { id: string; title: string; description: string; price: string; duration: string }[]
}> = {
  '1': {
    name: 'Layla Hassan', avatar: '👩🏽', category: 'Personal Stylist',
    bio: 'I help women build wardrobes they actually love. Specialising in quiet luxury, office siren looks, and colour theory. 200+ clients styled across MENA and Europe.',
    location: 'Cairo, Egypt', rating: 4.9, reviews: 48, verified: true,
    tags: ['Quiet Luxury', 'Office Siren', 'Colour Theory', 'Capsule Wardrobe'],
    listings: [
      { id: 'l1', title: '1-Hour Style Consultation', description: 'Video call — wardrobe audit, style direction, and a personalised shopping list.', price: '$35', duration: '60 min' },
      { id: 'l2', title: 'Full Wardrobe Overhaul', description: 'Deep-dive session: closet edit, capsule build, and outfit formula guide.', price: '$120', duration: '3 hrs' },
    ],
  },
}

export default function ProviderPage() {
  const params = useParams()
  const id = params?.['provider-id'] as string
  const provider = MOCK[id]
  const [booked, setBooked] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!provider) {
    return (
      <div className="blob-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#6d6875]">Provider not found.</p>
          <a href="/marketplace" className="mt-4 inline-flex text-[#7a4cf5] font-semibold hover:underline">← Back to marketplace</a>
        </div>
      </div>
    )
  }

  const book = async (listingId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/marketplace/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, provider_id: id }),
      })
      if (res.ok) setBooked(listingId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="blob-bg min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/marketplace" className="inline-flex items-center gap-2 text-sm text-[#9e97a8] hover:text-[#7a4cf5] transition mb-8">
          ← Back to marketplace
        </a>

        {/* Header */}
        <div className="panel rounded-[2rem] p-7 mb-5">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center text-4xl flex-shrink-0">
              {provider.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-[#1a1626]">{provider.name}</h1>
                {provider.verified && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">✓ Verified</span>
                )}
              </div>
              <div className="text-sm text-[#9e97a8] mb-1">{provider.category} · {provider.location}</div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[#1a1626]">⭐ {provider.rating}</span>
                <span className="text-sm text-[#9e97a8]">({provider.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#6d6875] leading-7 mt-5">{provider.bio}</p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {provider.tags.map(tag => (
              <span key={tag} className="vibe-pill text-xs bg-purple-50 text-[#7a4cf5] border-purple-100">{tag}</span>
            ))}
          </div>
        </div>

        {/* Listings */}
        <h2 className="font-bold text-[#1a1626] mb-3 px-1">Available services</h2>
        <div className="space-y-4">
          {provider.listings.map(listing => (
            <div key={listing.id} className="panel rounded-[1.75rem] p-6 flex items-start gap-4">
              <div className="flex-1">
                <div className="font-bold text-[#1a1626] mb-1">{listing.title}</div>
                <div className="text-sm text-[#6d6875] leading-6 mb-3">{listing.description}</div>
                <div className="flex gap-3 text-xs">
                  <span className="rounded-full bg-purple-50 px-3 py-1 font-semibold text-[#7a4cf5]">{listing.price}</span>
                  <span className="rounded-full bg-black/5 px-3 py-1 font-semibold text-[#4a4654]">⏱ {listing.duration}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {booked === listing.id ? (
                  <div className="rounded-full bg-emerald-100 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700">
                    ✓ Requested
                  </div>
                ) : (
                  <button
                    onClick={() => book(listing.id)}
                    disabled={loading}
                    className="rounded-full bg-[#7a4cf5] px-4 py-2 text-xs font-bold text-white hover:bg-[#6b3ee8] transition disabled:opacity-50"
                  >
                    Book →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
