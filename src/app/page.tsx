'use client'
import { useState } from 'react'

const VIBES = ['Quiet Luxury', 'Y2K Revival', 'Dark Feminine', 'Coastal Girl', 'Office Siren', 'Soft Glam', 'Street Chic', 'Boho Luxe']

const STATS = [
  { value: '94%', label: 'feel more confident', emoji: '✨' },
  { value: '3.2×', label: 'less decision fatigue', emoji: '🧠' },
  { value: '80%', label: 'stopped impulse buying', emoji: '💳' },
]

const COMMUNITY_POSTS = [
  { name: 'Layla K.', handle: '@laylak', vibe: 'Office Siren', text: 'Sapphire found me the perfect business casual fit in 30 seconds. My manager asked where I shop now 😭', avatar: '👩🏽' },
  { name: 'Zoe M.', handle: '@zoemiller', vibe: 'Dark Feminine', text: 'I uploaded my whole wardrobe and it literally styled me better than Pinterest ever did. Main character unlocked.', avatar: '👩🏻' },
  { name: 'Amara J.', handle: '@amaraj', vibe: 'Coastal Girl', text: 'The fit-aware thing is REAL. Finally an app that gets that a size 8 looks different on everyone.', avatar: '👩🏾' },
]

const HOW_IT_WORKS = [
  { step: '01', emoji: '📋', title: 'Take the style quiz', body: '5 questions. Your vibe, your body, your lifestyle. Takes 2 minutes, changes everything.' },
  { step: '02', emoji: '👗', title: 'Upload your wardrobe', body: 'Snap or upload what you own. Sapphire finds the gaps, spots the hidden gems, and builds your signature look.' },
  { step: '03', emoji: '✨', title: 'Get your daily fit', body: 'Every morning, a curated outfit that fits your day — weather, occasion, and main character energy included.' },
]

export default function Home() {
  const [activeVibe, setActiveVibe] = useState('Quiet Luxury')
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <div className="blob-bg min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />

        {/* Floating decorative blobs */}
        <div className="absolute top-12 right-[8%] w-64 h-64 rounded-full bg-gradient-to-br from-purple-200/40 to-rose-200/30 blur-3xl float pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-48 h-48 rounded-full bg-gradient-to-tr from-rose-200/30 to-orange-200/20 blur-3xl float-delay pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="fade-up inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-700 mb-6">
                <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-purple-500" />
                Now in beta · 2,400 women styling up
              </div>

              <h1 className="fade-up-delay-1 display-serif text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a1626] mb-4">
                Dress like<br/>
                <span className="gradient-text">you mean it.</span>
              </h1>

              <p className="fade-up-delay-2 text-lg sm:text-xl text-[#6d6875] leading-8 max-w-lg mb-8">
                Your AI stylist that actually gets your body, your budget, and your vibe — not a generic algorithm pushing fast fashion.
              </p>

              {/* Vibe selector */}
              <div className="fade-up-delay-2 mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9e97a8] mb-3">Pick your vibe</p>
                <div className="flex flex-wrap gap-2">
                  {VIBES.map(v => (
                    <button
                      key={v}
                      onClick={() => setActiveVibe(v)}
                      className={`vibe-pill text-sm transition-all ${
                        activeVibe === v
                          ? 'bg-[#7a4cf5] text-white border-[#7a4cf5] shadow-lg shadow-purple-200'
                          : 'bg-white text-[#4a4654] border-black/10 hover:border-[#7a4cf5]/40'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fade-up-delay-2 flex flex-wrap gap-3">
                <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#2d2838] transition hover:-translate-y-0.5 shadow-lg shadow-black/15">
                  Start styling free ✨
                </a>
                <a href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-7 py-3.5 text-sm font-semibold text-[#1a1626] hover:bg-purple-50 transition hover:-translate-y-0.5">
                  See plans
                </a>
              </div>

              {/* Social proof */}
              <div className="fade-up-delay-3 mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['👩🏻', '👩🏽', '👩🏾', '👩🏿', '👩🏼'].map((e, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-rose-100 border-2 border-white flex items-center justify-center text-base shadow">
                      {e}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1a1626]">2,400+ women styling up</div>
                  <div className="text-xs text-[#9e97a8]">⭐⭐⭐⭐⭐ &nbsp;4.9 rating</div>
                </div>
              </div>
            </div>

            {/* Right — interactive style card */}
            <div className="relative flex justify-center">
              <div className="float relative">
                <div className="glass rounded-[2.5rem] p-5 w-full max-w-sm mx-auto shadow-2xl shadow-purple-100">
                  <div className="rounded-[2rem] bg-gradient-to-br from-[#f3edff] via-[#fce4f0] to-[#ffeee8] p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="micro-label mb-1">Today's fit</div>
                        <div className="text-xl font-bold text-[#1a1626]">{activeVibe}</div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-2xl shadow-sm">✨</div>
                    </div>

                    {/* Outfit preview cards */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { emoji: '👗', label: 'Dress', color: 'from-violet-100 to-purple-50' },
                        { emoji: '👜', label: 'Bag', color: 'from-rose-100 to-pink-50' },
                        { emoji: '👟', label: 'Shoes', color: 'from-orange-100 to-amber-50' },
                      ].map(item => (
                        <div key={item.label} className={`rounded-2xl bg-gradient-to-br ${item.color} p-3 text-center`}>
                          <div className="text-2xl mb-1">{item.emoji}</div>
                          <div className="text-xs font-semibold text-[#6d6875]">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {['fit-aware', 'on-budget', 'weather-ready'].map(t => (
                        <span key={t} className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#7a4cf5]">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <div>
                      <div className="text-sm font-semibold text-[#1a1626]">92% confidence match</div>
                      <div className="text-xs text-[#9e97a8]">Based on your body profile + vibe</div>
                    </div>
                    <a href="/signup" className="rounded-full bg-[#7a4cf5] px-4 py-2 text-xs font-bold text-white hover:bg-[#6b3ee8] transition">
                      Try it →
                    </a>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 text-xs font-bold text-[#7a4cf5] shadow-lg float-delay">
                  🔥 Trending in your city
                </div>
                <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-3 py-2 text-xs font-bold text-emerald-700 shadow-lg float">
                  ✓ Fit verified for your body
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="panel rounded-[1.75rem] p-6 text-center card-hover">
              <div className="text-4xl mb-1">{s.emoji}</div>
              <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-[#6d6875] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <div className="micro-label mb-3">The flow</div>
          <h2 className="display-serif text-4xl sm:text-5xl font-black text-[#1a1626]">
            Three steps to your<br/><span className="gradient-text">main character era.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="panel rounded-[2rem] p-7 card-hover relative overflow-hidden">
              <div className="absolute top-4 right-5 text-5xl font-black text-[#7a4cf5]/8">{item.step}</div>
              <div className="text-4xl mb-4">{item.emoji}</div>
              <div className="text-lg font-bold text-[#1a1626] mb-2">{item.title}</div>
              <p className="text-sm leading-7 text-[#6d6875]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY WALL ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <div className="micro-label mb-3">Real women, real fits</div>
          <h2 className="display-serif text-4xl sm:text-5xl font-black text-[#1a1626]">
            They said what we<br/><span className="gradient-text">were thinking.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {COMMUNITY_POSTS.map(post => (
            <div key={post.handle} className="panel rounded-[1.75rem] p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center text-xl">
                  {post.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1a1626]">{post.name}</div>
                  <div className="text-xs text-[#9e97a8]">{post.handle}</div>
                </div>
                <span className="ml-auto rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#7a4cf5]">
                  {post.vibe}
                </span>
              </div>
              <p className="text-sm leading-6 text-[#4a4654]">"{post.text}"</p>
              <div className="mt-3 text-xs text-[#9e97a8]">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── UPLOAD TEASER ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-[2.5rem] overflow-hidden" style={{background: 'linear-gradient(135deg, #1a1626 0%, #2d1f4e 50%, #1a1626 100%)'}}>
          <div className="p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 mb-6">
                📸 New feature
              </div>
              <h2 className="display-serif text-4xl sm:text-5xl font-black text-white mb-4">
                Upload. Style.<br/><span className="text-[#c084fc]">Repeat.</span>
              </h2>
              <p className="text-white/65 leading-7 mb-8 text-base">
                Snap a photo of anything in your wardrobe. Sapphire identifies the piece, adds it to your closet, and starts building outfits around it instantly.
              </p>
              <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#7a4cf5] px-6 py-3 text-sm font-bold text-white hover:bg-[#8b5cf6] transition">
                Upload your first piece 📷
              </a>
            </div>

            {/* Upload UI preview */}
            <div className="glass rounded-[2rem] p-5">
              <div className="upload-zone rounded-[1.5rem] p-8 text-center">
                <div className="text-5xl mb-3">📸</div>
                <div className="text-white font-semibold mb-1">Drop a photo here</div>
                <div className="text-white/50 text-sm mb-4">or click to browse · JPG, PNG, HEIC</div>
                <button className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/30 transition">
                  Choose file
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['👗', '👠', '🧥'].map((e, i) => (
                  <div key={i} className="rounded-2xl bg-white/10 p-3 text-center">
                    <div className="text-2xl mb-1">{e}</div>
                    <div className="shimmer h-2 rounded-full mx-2" />
                    <div className="shimmer h-2 rounded-full mx-4 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST / EMAIL CTA ── */}
      <section className="max-w-2xl mx-auto px-4 pb-24 text-center">
        <div className="micro-label mb-4">Join the movement</div>
        <h2 className="display-serif text-4xl sm:text-5xl font-black text-[#1a1626] mb-4">
          Your style era starts<br/><span className="gradient-text">right now.</span>
        </h2>
        <p className="text-[#6d6875] mb-8 text-base leading-7">No algorithms selling you stuff. Just your style, dialled in. Free forever, upgrade when you're ready.</p>

        {joined ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700">
            ✓ You're on the list — we'll be in touch!
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true) }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/30"
            />
            <button
              type="submit"
              className="rounded-full bg-[#7a4cf5] px-6 py-3 text-sm font-bold text-white hover:bg-[#6b3ee8] transition whitespace-nowrap"
            >
              Get early access ✨
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-[#9e97a8]">No spam. Just style drops and early feature access.</p>
      </section>

    </div>
  )
}
