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
  { name: 'Zoe M.', handle: '@zoemiller', vibe: 'Dark Feminine', text: 'I uploaded my whole wardrobe and it styled me better than Pinterest ever did.', avatar: 'Z' },
  { name: 'Amara J.', handle: '@amaraj', vibe: 'Coastal Girl', text: 'The fit-aware thing is real. Finally an app that gets that a size 8 looks different on everyone.', avatar: 'A' },
]

const STEPS = [
  { n: '01', title: 'Take the quiz', body: 'Five questions about your vibe, your body, your life. Two minutes. Changes how you get dressed.' },
  { n: '02', title: 'Upload your wardrobe', body: 'Photograph what you own. Sapphire finds the gaps, surfaces hidden gems, builds your signature look.' },
  { n: '03', title: 'Get dressed with AI', body: 'A curated outfit every morning — calibrated to the weather, the occasion, the version of you showing up today.' },
]

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FpPG77mOlFwZqVLNywPP5PQusd/hf_20260723_221932_5339be84-ea0c-4e05-a5a8-7900573dc52a.mp4'

export default function Home() {
  const [activeVibe, setActiveVibe] = useState('Quiet Luxury')
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <div style={{background:'#FEFAF6'}} className="text-[#1a0f14] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 overflow-hidden">

        {/* Video backdrop */}
        <video
          src={VIDEO_URL}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{opacity: 0.15}}
        />
        {/* Warm overlay */}
        <div className="absolute inset-0" style={{background:'linear-gradient(to top, #FEFAF6 35%, rgba(254,250,246,0.7) 65%, rgba(254,250,246,0.2) 100%)'}} />
        <div className="absolute inset-0" style={{background:'linear-gradient(to right, rgba(254,250,246,0.8) 40%, transparent 100%)'}} />

        {/* Beta pill */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.62rem] font-semibold tracking-[0.18em] uppercase" style={{borderColor:'#E8A0B4', background:'#FFF0F4', color:'#C45C7A'}}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'#E8608A'}} />
          Beta — 2,400 women already inside
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] mb-6" style={{color:'#C4A08C'}}>Sapphire by IVEE</p>

          <h1 className="display-serif font-black leading-[0.9] mb-8" style={{fontSize:'clamp(3.8rem,10vw,8.5rem)', color:'#1a0f14'}}>
            Dress like<br/>
            <span style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              you mean it.
            </span>
          </h1>

          <p className="text-base sm:text-lg leading-8 max-w-lg mb-10 font-light" style={{color:'#8B6E7A'}}>
            An AI stylist that understands your body, your wardrobe, and your aesthetic — not a recommendation engine serving someone else&apos;s inventory.
          </p>

          {/* Vibe selector */}
          <div className="mb-10">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-3" style={{color:'#C4A08C'}}>Your vibe</p>
            <div className="flex flex-wrap gap-2">
              {VIBES.map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVibe(v)}
                  className="rounded-full px-4 py-1.5 text-xs font-medium border transition-all"
                  style={activeVibe === v
                    ? {background:'#E8608A', borderColor:'#E8608A', color:'#fff'}
                    : {background:'#FFF0F4', borderColor:'#F0D0DC', color:'#C45C7A'}
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all shadow-lg" style={{background:'#E8608A', boxShadow:'0 8px 30px rgba(232,96,138,0.25)'}}>
              Start free
            </a>
            <a href="/pricing" className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all" style={{borderColor:'#E8C4D0', color:'#B07088', background:'#FFF7F9'}}>
              See pricing
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 right-12 hidden lg:flex flex-col items-center gap-2" style={{color:'#D4B0BC'}}>
          <div className="w-px h-12" style={{background:'linear-gradient(to bottom, transparent, #D4B0BC)'}} />
          <span className="text-[0.6rem] tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{borderTop:'1px solid #F0E0E8'}}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid sm:grid-cols-3" style={{borderBottom: 'none'}}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="py-10 sm:py-0 sm:px-14 first:pl-0 last:pr-0"
              style={i < 2 ? {borderRight:'1px solid #F0E0E8'} : {}}
            >
              <div className="text-5xl sm:text-6xl font-black tracking-tight" style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                {s.value}
              </div>
              <div className="text-sm mt-2 font-light" style={{color:'#A08090'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND FILM ── */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] mb-3" style={{color:'#C4A08C'}}>The vision</p>
            <h2 className="display-serif font-black leading-[0.95]" style={{fontSize:'clamp(2.2rem,5vw,3.5rem)', color:'#1a0f14'}}>
              Style, reimagined<br/>
              <span style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                by intelligence.
              </span>
            </h2>
          </div>
          <a href="/signup" className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition" style={{color:'#C4A08C'}}>
            Get started →
          </a>
        </div>

        <div className="relative rounded-[1.75rem] overflow-hidden aspect-video shadow-2xl" style={{background:'#F5E8EE', boxShadow:'0 40px 80px rgba(232,96,138,0.12)'}}>
          <video src={VIDEO_URL} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 rounded-[1.75rem]" style={{boxShadow:'inset 0 0 0 1px rgba(232,96,138,0.1)'}} />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full px-3.5 py-1.5 backdrop-blur-sm" style={{background:'rgba(255,240,244,0.85)', border:'1px solid rgba(232,96,138,0.15)'}}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'#E8608A'}} />
            <span className="text-[0.65rem] font-semibold tracking-wide" style={{color:'#C45C7A'}}>Sapphire — AI style OS</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28" style={{background:'#FDF5EE', borderTop:'1px solid #F0E0D8', borderBottom:'1px solid #F0E0D8'}}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] mb-4" style={{color:'#C4A08C'}}>How it works</p>
          <h2 className="display-serif font-black leading-[0.95] mb-20 max-w-lg" style={{fontSize:'clamp(2.2rem,5vw,3.5rem)', color:'#1a0f14'}}>
            Three steps to your<br/>
            <span style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              signature look.
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map(s => (
              <div key={s.n} className="rounded-[1.5rem] p-9 transition-all" style={{background:'#FEFAF6', border:'1px solid #F0E0D8'}}>
                <div className="text-[0.6rem] font-black uppercase tracking-[0.22em] mb-8" style={{color:'#D4B8C4'}}>{s.n}</div>
                <h3 className="text-lg font-semibold mb-3" style={{color:'#1a0f14'}}>{s.title}</h3>
                <p className="text-sm leading-[1.85] font-light" style={{color:'#9A7A88'}}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] mb-4" style={{color:'#C4A08C'}}>What women say</p>
          <h2 className="display-serif font-black leading-[0.95] mb-16" style={{fontSize:'clamp(2.2rem,5vw,3.5rem)', color:'#1a0f14'}}>
            Honest words.<br/>
            <span style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              Real closets.
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {REVIEWS.map(r => (
              <div key={r.handle} className="rounded-[1.5rem] p-7 transition-all" style={{background:'#FFF7F9', border:'1px solid #F0D8E4'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'linear-gradient(135deg,#E8608A,#F4A4C0)'}}>
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{color:'#1a0f14'}}>{r.name}</div>
                    <div className="text-xs" style={{color:'#C4A0B4'}}>{r.handle}</div>
                  </div>
                  <span className="ml-auto text-[0.65rem] font-medium px-2.5 py-0.5 rounded-full" style={{background:'#FFF0F4', color:'#E8608A', border:'1px solid #F0D0DC'}}>{r.vibe}</span>
                </div>
                <p className="text-sm leading-[1.9] font-light" style={{color:'#7A5A68'}}>&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 text-[0.6rem] tracking-widest" style={{color:'#E8B090'}}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPLOAD ── */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="rounded-[2rem] overflow-hidden" style={{background:'linear-gradient(135deg,#FFF0F4,#FDF5EE,#FEFAF6)', border:'1px solid #F0D8E4'}}>
          <div className="p-10 sm:p-16 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] mb-4" style={{color:'#C4A08C'}}>New feature</p>
              <h2 className="display-serif font-black leading-[0.95] mb-5" style={{fontSize:'clamp(2rem,4.5vw,3rem)', color:'#1a0f14'}}>
                Upload.<br/>Style.<br/>
                <span style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                  Repeat.
                </span>
              </h2>
              <p className="leading-[1.85] mb-8 text-sm font-light" style={{color:'#9A7A88'}}>
                Photograph anything in your wardrobe. Sapphire identifies it, catalogs it, and starts building complete outfits around it within seconds.
              </p>
              <a href="/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition shadow-lg" style={{background:'#E8608A', boxShadow:'0 8px 24px rgba(232,96,138,0.2)'}}>
                Try it free
              </a>
            </div>

            <div className="rounded-[1.5rem] p-5" style={{background:'rgba(255,255,255,0.7)', border:'1px solid #F0D8E4'}}>
              <div className="rounded-[1.1rem] p-10 text-center transition" style={{border:'2px dashed #F0C8D8'}}>
                <div className="text-4xl mb-4 opacity-40">📷</div>
                <div className="text-sm font-medium mb-1" style={{color:'#B07888'}}>Drop a photo here</div>
                <div className="text-xs mb-5" style={{color:'#C4A0B4'}}>JPG, PNG or HEIC</div>
                <button className="rounded-full px-5 py-2 text-xs font-medium transition" style={{background:'#FFF0F4', border:'1px solid #F0C8D8', color:'#C45C7A'}}>
                  Browse files
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['Dress', 'Heels', 'Jacket'].map((label, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{background:'#FFF7F9', border:'1px solid #F0D8E4'}}>
                    <div className="h-8 rounded-md mb-2" style={{background:'#F5E0E8'}} />
                    <div className="text-[0.6rem] font-medium" style={{color:'#C4A0B4'}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-36 text-center px-6" style={{borderTop:'1px solid #F0E0E8'}}>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] mb-8" style={{color:'#C4A08C'}}>Join the movement</p>
        <h2
          className="display-serif font-black leading-[0.9] mb-8"
          style={{fontSize:'clamp(2.8rem,8vw,6.5rem)', color:'#1a0f14'}}
        >
          Your style era<br/>
          <span style={{background:'linear-gradient(125deg,#E8608A 20%,#F4A4C0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
            starts now.
          </span>
        </h2>
        <p className="mb-10 text-sm max-w-sm mx-auto leading-[1.85] font-light" style={{color:'#9A7A88'}}>
          No algorithms selling you things. No generic advice. Just your style, finally figured out.
        </p>

        {joined ? (
          <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium" style={{background:'#F0FFF4', border:'1px solid #A8D8B0', color:'#4A9A60'}}>
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
              className="flex-1 rounded-full px-5 py-3 text-sm focus:outline-none"
              style={{border:'1px solid #F0C8D8', background:'#FFF7F9', color:'#1a0f14'}}
            />
            <button
              type="submit"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white whitespace-nowrap transition"
              style={{background:'#E8608A', boxShadow:'0 8px 24px rgba(232,96,138,0.2)'}}
            >
              Get early access
            </button>
          </form>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[0.6rem] font-medium uppercase tracking-[0.18em]" style={{color:'#D4B0BC'}}>
          <span>Free forever</span>
          <span className="w-0.5 h-0.5 rounded-full" style={{background:'#D4B0BC'}} />
          <span>No card required</span>
          <span className="w-0.5 h-0.5 rounded-full" style={{background:'#D4B0BC'}} />
          <span>Your data stays yours</span>
          <span className="w-0.5 h-0.5 rounded-full" style={{background:'#D4B0BC'}} />
          <span>Built for women</span>
        </div>
      </section>

    </div>
  )
}
