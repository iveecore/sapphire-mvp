'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Bookmark, ArrowRight, Sparkles } from 'lucide-react'

type CommunityPost = {
  id: string
  outfit_description: string
  image_url: string | null
  likes: number
  created_at: string
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'Popular' | 'Recent' | 'Remixable'>('Popular')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/community/feed')
        const payload = await res.json()
        if (!res.ok) throw new Error(payload.error ?? 'Could not load community.')
        setPosts(payload.posts ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load community.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="glass rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="micro-label">Community graph</div>
              <h1 className="display-title mt-3 text-4xl sm:text-5xl font-semibold text-[#1f1f26]">
                Outfits you can learn from, remix, and save.
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-8 text-[#6d6875]">
                Sapphire community is built around taste, confidence, and credit. Remixes should feel collaborative, not performative.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Popular', 'Recent', 'Remixable'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item as typeof filter)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === item ? 'bg-[#1f1f26] text-white' : 'bg-white text-[#1f1f26] hover:bg-black/5'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button className="rounded-full bg-[#7a4cf5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a3de0] inline-flex items-center gap-2">
                <Sparkles size={14} /> Share look
              </button>
            </div>
          </div>
        </div>

        {error && <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="mt-6 text-sm text-[#6d6875]">Loading community feed...</p>}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-[#fcfbfa] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(23,18,40,0.10)]">
              <div className="relative h-72 bg-[linear-gradient(135deg,rgba(122,76,245,0.18),rgba(217,86,114,0.14),rgba(15,118,110,0.14))]">
                <div className="absolute inset-0 hero-grid opacity-60" />
                <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#1f1f26]">
                  Remixable
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1f1f26]">{post.outfit_description || 'Shared outfit'}</h3>
                <p className="mt-1 text-sm text-[#6d6875]">{new Date(post.created_at).toLocaleDateString()}</p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-sm text-[#6d6875]">
                    <button className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 font-medium text-[#1f1f26]">
                      <Heart size={14} className="text-[#d95672]" /> {post.likes}
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 font-medium text-[#1f1f26]">
                      <MessageCircle size={14} /> 0
                    </button>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#1f1f26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d2838]">
                    <Bookmark size={14} /> Save
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!loading && posts.length === 0 && (
            <div className="col-span-full rounded-[1.75rem] border border-dashed border-black/10 bg-[#fcfbfa] p-10 text-center text-[#6d6875]">
              No community posts yet. This space will feel much stronger once remixes and creator credit are live.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
