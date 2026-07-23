'use client'
import { useState } from 'react'

const VIBES = ['Quiet Luxury', 'Y2K Revival', 'Dark Feminine', 'Coastal Girl', 'Office Siren', 'Soft Glam', 'Street Chic', 'Boho Luxe']

const STATS = [
  { value: '94%', label: 'feel more confident' },
  { value: '3.2×', label: 'less decision fatigue' },
  { value: '80%', label: 'stopped impulse buying' },
]

const REVIEWS = [
  { name: 'Layla K.', handle: '@laylak', vibe: 'Office Siren', text: 'Sapphire found me the perfect business casual fit in 30 seconds. My manager asked where I shop now.', avatar: 'L' },
  { name: 'Zoe M.', handle: '@zoemiller', vibe: 'Dark Feminine', text: 'I uploaded my whole wardrobe and it styled me better than Pinterest ever did. Main character unlocked.', avatar: 'Z' },
  { name: 'Amara J.', handle: '@amaraj', vibe: 'Coastal Girl', text: 'The fit-aware thing is real. Finally an app that gets that a size 8 looks different on everyone.', avatar: 'A' },
]

const STEPS = [
  { n: '01', title: 'Take the quiz', body: 'Five questions about your vibe, your body, your life. Takes two minutes. Changes how you get dressed.' },
  { n: '02', title: 'Upload your wardrobe', body: 'Photograph what you own. Sapphire finds the gaps, surfaces the hidden gems, builds your signature look.' },
  { n: '03', title: 'Get dressed with AI', body: 'A curated outfit every morning — calibrated to the weather, the occasion, the version of you showing up today.' },
]

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FpPG77mOlFwZqVLNywPP5PQusd/hf_20260723_221932_5339be84-ea0c-4e05-a5a8-7900573dc52a.mp4'

export default function Home() {
  const [activeVibe, setActiveVibe] = useState('Quiet Luxury')
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <div className="bg-[#080610] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 overflow-hidden">
        <video
          src={VIDEO_URL}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080610] via-[#080610]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080610]/60 via-transparent to-transparent" />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/8 bg-white/4 backdrop-blur-sm px-4 py-1.5 text-[0.65rem] font-semibold text-white/40 tracking-[0.18em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Beta — 2,400 women already inside
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/30 mb-6">Sapphire</p>
          <h1 className="display-serif font-black leading-[0.9] text-white mb-8" style={{fontSize:'clamp(3.8rem,10vw,8.5rem)'}}>
            Dress like<br/>
            <span style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              you mean it.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/45 leading-8 max-w-lg mb-10 font-light">
            An AI stylist that understands your body, your wardrobe, and your aesthetic — not a recommendation engine serving someone else&apos;s inventory.
          </p>

          <div className="mb-10">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/20 mb-3">Your vibe</p>
            <div className="flex flex-wrap gap-2">
              {VIBES.map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVibe(v)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all ${
                    activeVibe === v
                      ? 'bg-[#c084fc]/15 border-[#c084fc]/50 text-[#c084fc]'
                      : 'bg-transparent border-white/8 text-white/35 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#080610] hover:bg-white/90 transition-all shadow-2xl shadow-white/5">
              Start free
            </a>
            <a href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-medium text-white/45 hover:text-white/70 hover:border-white/20 transition-all">
              See pricing
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 right-12 hidden lg:flex flex-col items-center gap-2 text-white/15">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/15" />
          <span className="text-[0.6rem] tracking-[0.2em] uppercase rotate-0">Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid sm:grid-cols-3 sm:divide-x divide-white/5">
          {STATS.map(s => (
            <div key={s.label} className="py-10 sm:py-0 sm:px-14 first:pl-0 last:pr-0">
              <div
                className="text-5xl sm:text-6xl font-black tracking-tight"
                style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}
              >
                {s.value}
              </div>
              <div className="text-sm text-white/30 mt-2 font-light">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILM ── */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/25 mb-3">The vision</p>
            <h2 className="display-serif text-4xl sm:text-[3.25rem] font-black text-white leading-[0.95]">
              Style, reimagined<br/>
              <span style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                by intelligence.
              </span>
            </h2>
          </div>
          <a href="/signup" className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-white/30 hover:text-white/60 transition">
            Get started <span>→</span>
          </a>
        </div>

        <div className="relative rounded-[1.75rem] overflow-hidden bg-black aspect-video">
          <video src={VIDEO_URL} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[1.75rem]" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur border border-white/8 px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
            <span className="text-[0.65rem] font-semibold text-white/70 tracking-wide">Sapphire — AI style OS</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-white/5 py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/25 mb-4">How it works</p>
          <h2 className="display-serif text-4xl sm:text-[3.25rem] font-black text-white leading-[0.95] mb-20 max-w-lg">
            Three steps to your<br/>
            <span style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              signature look.
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-[1.5rem] overflow-hidden">
            {STEPS.map(s => (
              <div key={s.n} className="bg-[#080610] p-9 sm:p-11 group hover:bg-white/[0.025] transition-colors">
                <div className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/15 mb-8">{s.n}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-sm leading-[1.85] text-white/35 font-light">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-28" style={{background:'#0a0714'}}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/25 mb-4">What women say</p>
          <h2 className="display-serif text-4xl sm:text-[3.25rem] font-black text-white leading-[0.95] mb-16">
            Honest words.<br/>
            <span style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              Real closets.
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {REVIEWS.map(r => (
              <div key={r.handle} className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.025] p-7 hover:bg-white/[0.045] transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center text-xs font-bold text-white">
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.name}</div>
                    <div className="text-xs text-white/25">{r.handle}</div>
                  </div>
                  <span className="ml-auto text-[0.65rem] font-medium text-[#c084fc]/70 bg-[#c084fc]/8 px-2.5 py-0.5 rounded-full border border-[#c084fc]/10">{r.vibe}</span>
                </div>
                <p className="text-sm leading-[1.9] text-white/45 font-light">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 text-[0.6rem] text-yellow-400/40 tracking-widest">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPLOAD ── */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="rounded-[2rem] border border-white/[0.06] overflow-hidden" style={{background:'linear-gradient(135deg,#12062a,#0d0618,#080610)'}}>
          <div className="p-10 sm:p-16 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/25 mb-4">New feature</p>
              <h2 className="display-serif text-4xl sm:text-5xl font-black text-white mb-5 leading-[0.95]">
                Upload.<br/>Style.<br/>
                <span style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                  Repeat.
                </span>
              </h2>
              <p className="text-white/35 leading-[1.85] mb-8 text-sm font-light">
                Photograph anything in your wardrobe. Sapphire identifies it, catalogs it, and starts building complete outfits around it within seconds.
              </p>
              <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#c084fc] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a855f7] transition shadow-lg shadow-purple-500/15">
                Try it free
              </a>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="rounded-[1.1rem] border border-dashed border-white/8 p-10 text-center hover:border-white/15 transition">
                <div className="text-4xl mb-4 grayscale opacity-50">📷</div>
                <div className="text-white/50 font-medium mb-1 text-sm">Drop a photo here</div>
                <div className="text-white/20 text-xs mb-5">JPG, PNG or HEIC</div>
                <button className="rounded-full border border-white/8 bg-white/5 px-5 py-2 text-xs font-medium text-white/35 hover:bg-white/8 transition">
                  Browse files
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['Dress', 'Heels', 'Jacket'].map((label, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3 text-center">
                    <div className="h-8 rounded-md bg-white/5 mb-2" />
                    <div className="text-[0.6rem] text-white/20 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-36 text-center px-6 border-t border-white/5">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/20 mb-8">Join the movement</p>
        <h2
          className="display-serif font-black text-white leading-[0.9] mb-8"
          style={{fontSize:'clamp(2.8rem,8vw,6.5rem)'}}
        >
          Your style era<br/>
          <span style={{background:'linear-gradient(125deg,#c084fc 30%,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
            starts now.
          </span>
        </h2>
        <p className="text-white/30 mb-10 text-sm max-w-sm mx-auto leading-[1.85] font-light">
          No algorithms selling you things. No generic advice. Just your style, finally figured out.
        </p>

        {joined ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-6 py-3 text-sm font-medium text-emerald-400/80">
            You&apos;re in — we&apos;ll be in touch.
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setJoined(true) }}
            className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-full border border-white/8 bg-white/[0.04] px-5 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#c084fc]/30 focus:border-[#c084fc]/30"
            />
            <button
              type="submit"
              className="rounded-full bg-[#c084fc] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a855f7] transition whitespace-nowrap"
            >
              Get early access
            </button>
          </form>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[0.6rem] text-white/15 font-medium uppercase tracking-[0.18em]">
          <span>Free forever</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
          <span>No card required</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
          <span>Your data stays yours</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
          <span>Built for women</span>
        </div>
      </section>

    </div>
  )
}
