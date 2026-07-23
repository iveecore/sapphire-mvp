'use client'
import { useState } from 'react'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FpPG77mOlFwZqVLNywPP5PQusd/hf_20260723_221932_5339be84-ea0c-4e05-a5a8-7900573dc52a.mp4'

const QUIZ_STEPS = [
  { q: 'Your style in one word?', opts: ['Modest', 'Editorial', 'Minimal', 'Bold'] },
  { q: 'How do you dress daily?', opts: ['Abaya & layers', 'Smart casual', 'Classic chic', 'Free spirit'] },
  { q: 'Your wardrobe gap?', opts: ['Occasion wear', 'Work fits', 'Everyday basics', 'Everything'] },
]

const STATS = [
  { value: '94%', label: 'More confident each morning' },
  { value: '3.2x', label: 'Less decision fatigue' },
  { value: '80%', label: 'Stopped impulse buying' },
]

const STEPS = [
  { n: '01', title: 'Tell us who you are', body: 'Five questions about your aesthetic, your body, your life. Two minutes. All Sapphire needs to understand you.' },
  { n: '02', title: 'Upload what you own', body: 'Photograph your wardrobe. Sapphire maps it, finds the gaps, surfaces what you forgot you had.' },
  { n: '03', title: 'Dress with intention', body: 'A curated outfit every morning -- tuned to the weather, the occasion, and the version of you showing up today.' },
]

const REVIEWS = [
  { name: 'Layla K.', city: 'Cairo', vibe: 'Modern Modest', text: 'I wear abaya daily and finally found an AI that does not pretend that means I have no style. Sapphire gets me.', avatar: 'L' },
  { name: 'Zoe M.', city: 'Dubai', vibe: 'Editorial Chic', text: 'Uploaded my whole wardrobe and it styled me better than any personal shopper I have worked with.', avatar: 'Z' },
  { name: 'Sara A.', city: 'Riyadh', vibe: 'Quiet Luxury', text: 'The fit awareness is real. First app that understands that size 8 looks completely different on every body.', avatar: 'S' },
]

function MashrabiyaPattern({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M100 0 L200 100 L100 200 L0 100 Z" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5"/>
      <path d="M100 18 L182 100 L100 182 L18 100 Z" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.35"/>
      <path d="M100 38 L162 100 L100 162 L38 100 Z" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.22"/>
      <path d="M52 52 L148 52 L148 148 L52 148 Z" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.18"/>
      <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.25"/>
      <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.12"/>
    </svg>
  )
}

export default function Home() {
  const [quizStep, setQuizStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [quizDone, setQuizDone] = useState(false)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  function handleQuizAnswer(opt: string) {
    const next = [...answers, opt]
    if (quizStep < QUIZ_STEPS.length - 1) {
      setAnswers(next)
      setQuizStep(q => q + 1)
    } else {
      setAnswers(next)
      setQuizDone(true)
    }
  }

  return (
    <div style={{ background: '#F9F6F2', color: '#0D0D0D' }} className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 overflow-hidden">
        <video src={VIDEO_URL} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.17 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #F9F6F2 38%, rgba(249,246,242,0.72) 68%, rgba(249,246,242,0.1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(249,246,242,0.92) 42%, transparent 100%)' }} />
        <MashrabiyaPattern className="absolute top-0 right-0 w-72 h-72 lg:w-[28rem] lg:h-[28rem]" style={{ color: '#245BFF', opacity: 0.09 }} />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.62rem] font-semibold tracking-[0.18em] uppercase" style={{ borderColor: 'rgba(36,91,255,0.22)', background: 'rgba(36,91,255,0.05)', color: '#245BFF' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#245BFF' }} />
          Beta &mdash; 2,400 women already inside
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: '#BBA98A' }}>Sapphire by IVEE</p>
          <h1 className="display-serif font-black leading-[0.88] mb-8" style={{ fontSize: 'clamp(3.4rem,9.5vw,7.8rem)', color: '#0D0D0D' }}>
            The first digital home<br />
            <span style={{ background: 'linear-gradient(125deg, #245BFF 0%, #7B9FFF 48%, #F4C6D7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              built for Arab women.
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-8 max-w-xl mb-10 font-light" style={{ color: '#6B6B6B' }}>
            An AI stylist that sees who you are -- your body, your culture, your wardrobe -- not a recommendation engine built for someone else.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#245BFF,#1a47db)', boxShadow: '0 8px 32px rgba(36,91,255,0.28)' }}>
              Start your style journey
            </a>
            <a href="#quiz" className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium" style={{ borderColor: 'rgba(36,91,255,0.22)', color: '#245BFF', background: 'rgba(36,91,255,0.04)' }}>
              Take the quiz
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 right-12 hidden lg:flex flex-col items-center gap-2" style={{ color: '#C8C0B8' }}>
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, #C8C0B8)' }} />
          <span className="text-[0.6rem] tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid rgba(36,91,255,0.08)', borderBottom: '1px solid rgba(36,91,255,0.08)', background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 grid sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div key={s.label} className="py-10 sm:py-0 sm:px-14 first:pl-0 last:pr-0 flex flex-col" style={i < 2 ? { borderRight: '1px solid rgba(36,91,255,0.07)' } : {}}>
              <div className="text-5xl sm:text-6xl font-black tracking-tight mb-2" style={{ background: 'linear-gradient(135deg,#245BFF,#7B9FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
              <div className="text-sm font-light" style={{ color: '#8A8A8A' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND FILM */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: '#BBA98A' }}>The vision</p>
            <h2 className="display-serif font-black leading-[0.95]" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#0D0D0D' }}>
              Style built around<br />
              <span style={{ background: 'linear-gradient(125deg,#245BFF,#F4C6D7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>your identity.</span>
            </h2>
          </div>
          <a href="/signup" className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-medium" style={{ color: '#245BFF' }}>Get started</a>
        </div>
        <div className="relative rounded-[2rem] overflow-hidden aspect-video" style={{ background: '#E8D8B5', boxShadow: '0 40px 100px rgba(36,91,255,0.1)' }}>
          <video src={VIDEO_URL} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <MashrabiyaPattern className="absolute bottom-0 right-0 w-48 h-48" style={{ color: '#F9F6F2', opacity: 0.28 }} />
          <div className="absolute inset-0 rounded-[2rem]" style={{ boxShadow: 'inset 0 0 0 1px rgba(249,246,242,0.12)' }} />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm" style={{ background: 'rgba(249,246,242,0.92)', border: '1px solid rgba(36,91,255,0.1)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#245BFF' }} />
            <span className="text-[0.65rem] font-semibold tracking-wide" style={{ color: '#245BFF' }}>Sapphire</span>
          </div>
        </div>
      </section>

      {/* IDENTITY QUIZ */}
      <section id="quiz" className="py-28" style={{ background: '#0D0D0D' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: '#BBA98A' }}>Identity quiz</p>
              <h2 className="display-serif font-black leading-[0.95] mb-5" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#F9F6F2' }}>
                Tell us who<br />
                <span style={{ background: 'linear-gradient(125deg,#7B9FFF,#F4C6D7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>you really are.</span>
              </h2>
              <p className="text-sm leading-8 max-w-md font-light" style={{ color: '#8A8A8A' }}>
                Your style is yours. Sapphire learns your aesthetic, your culture, your body -- and builds around you.
              </p>
            </div>
            <div className="rounded-[1.75rem] p-8 sm:p-10 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <MashrabiyaPattern className="absolute -top-8 -right-8 w-48 h-48" style={{ color: '#245BFF', opacity: 0.12 }} />
              {quizDone ? (
                <div className="relative text-center py-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg,#245BFF,#7B9FFF)' }}>
                    <span className="text-white text-2xl">+</span>
                  </div>
                  <h3 className="display-serif font-black text-2xl mb-3" style={{ color: '#F9F6F2' }}>Your profile is ready.</h3>
                  <p className="text-sm mb-6 font-light" style={{ color: '#8A8A8A' }}>Sign up and Sapphire will build your full style identity in minutes.</p>
                  <a href="/signup" className="inline-flex rounded-full px-7 py-3 text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#245BFF,#1a47db)' }}>See my style profile</a>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex gap-1.5 mb-8">
                    {QUIZ_STEPS.map((_, i) => (
                      <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-500" style={{ background: i <= quizStep ? '#245BFF' : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.28)' }}>Question {quizStep + 1} of {QUIZ_STEPS.length}</p>
                  <h3 className="text-xl font-semibold mb-7" style={{ color: '#F9F6F2' }}>{QUIZ_STEPS[quizStep].q}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {QUIZ_STEPS[quizStep].opts.map(opt => (
                      <button key={opt} onClick={() => handleQuizAnswer(opt)} className="rounded-xl py-3.5 px-4 text-sm font-medium text-left transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.72)' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI STYLIST */}
      <section className="py-28" style={{ background: '#F9F6F2' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-20">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: '#BBA98A' }}>AI Stylist</p>
            <h2 className="display-serif font-black leading-[0.95] mx-auto max-w-2xl" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#0D0D0D' }}>
              Three steps to your
              <span style={{ background: 'linear-gradient(125deg,#245BFF 0%,#F4C6D7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> signature look.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.n} className="rounded-[1.75rem] p-10 relative overflow-hidden" style={{ background: i === 1 ? 'linear-gradient(135deg,#245BFF,#1a47db)' : '#FFFFFF', boxShadow: i === 1 ? '0 20px 60px rgba(36,91,255,0.22)' : '0 4px 24px rgba(0,0,0,0.04)', border: i !== 1 ? '1px solid rgba(36,91,255,0.07)' : 'none' }}>
                {i === 1 && <MashrabiyaPattern className="absolute top-0 right-0 w-36 h-36" style={{ color: '#F9F6F2', opacity: 0.16 }} />}
                <div className="text-[0.6rem] font-black uppercase tracking-[0.22em] mb-8" style={{ color: i === 1 ? 'rgba(249,246,242,0.32)' : 'rgba(36,91,255,0.25)' }}>{s.n}</div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: i === 1 ? '#F9F6F2' : '#0D0D0D' }}>{s.title}</h3>
                <p className="text-sm leading-[1.9] font-light" style={{ color: i === 1 ? 'rgba(249,246,242,0.58)' : '#8A8A8A' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-28" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: '#BBA98A' }}>What women say</p>
          <h2 className="display-serif font-black leading-[0.95] mb-16" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#0D0D0D' }}>
            Honest words.<br />
            <span style={{ background: 'linear-gradient(125deg,#245BFF,#F4C6D7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Real closets.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map(r => (
              <div key={r.name} className="rounded-[1.75rem] p-8" style={{ background: '#F9F6F2', border: '1px solid rgba(36,91,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#245BFF,#7B9FFF)' }}>{r.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#0D0D0D' }}>{r.name}</div>
                    <div className="text-xs" style={{ color: '#C8C0B8' }}>{r.city}</div>
                  </div>
                  <span className="ml-auto text-[0.62rem] font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(36,91,255,0.07)', color: '#245BFF', border: '1px solid rgba(36,91,255,0.12)' }}>{r.vibe}</span>
                </div>
                <p className="text-sm leading-[1.9] font-light" style={{ color: '#5A5A5A' }}>&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 text-[0.6rem] tracking-widest" style={{ color: '#E8D8B5' }}>* * * * *</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WARDROBE UPLOAD */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="rounded-[2rem] overflow-hidden relative" style={{ background: 'linear-gradient(135deg,#0A0A1A 0%,#0D0D22 100%)' }}>
          <MashrabiyaPattern className="absolute top-0 right-0 w-80 h-80" style={{ color: '#245BFF', opacity: 0.14 }} />
          <MashrabiyaPattern className="absolute bottom-0 left-0 w-60 h-60" style={{ color: '#F4C6D7', opacity: 0.09 }} />
          <div className="relative p-10 sm:p-16 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: '#BBA98A' }}>Upload feature</p>
              <h2 className="display-serif font-black leading-[0.95] mb-5" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', color: '#F9F6F2' }}>
                Your wardrobe,<br />finally understood.
              </h2>
              <p className="leading-[1.85] mb-8 text-sm font-light" style={{ color: 'rgba(249,246,242,0.48)' }}>
                Photograph what you own. Sapphire catalogs it, finds what is missing, and builds complete outfits around what is already yours.
              </p>
              <a href="/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#245BFF,#1a47db)', boxShadow: '0 8px 32px rgba(36,91,255,0.3)' }}>Upload your first item</a>
            </div>
            <div className="rounded-[1.5rem] p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="rounded-[1.1rem] p-10 text-center" style={{ border: '1.5px dashed rgba(244,198,215,0.22)', background: 'rgba(244,198,215,0.03)' }}>
                <div className="mb-4 w-8 h-8 mx-auto rounded-full" style={{ background: 'rgba(244,198,215,0.15)' }} />
                <div className="text-sm font-medium mb-1" style={{ color: 'rgba(249,246,242,0.62)' }}>Drop a photo here</div>
                <div className="text-xs mb-5" style={{ color: 'rgba(249,246,242,0.25)' }}>JPG, PNG or HEIC</div>
                <button className="rounded-full px-5 py-2 text-xs font-medium" style={{ background: 'rgba(244,198,215,0.07)', border: '1px solid rgba(244,198,215,0.18)', color: '#F4C6D7' }}>Browse files</button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['Dress', 'Abaya', 'Jacket'].map(label => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="h-8 rounded-md mb-2" style={{ background: 'rgba(244,198,215,0.1)' }} />
                    <div className="text-[0.6rem] font-medium" style={{ color: 'rgba(249,246,242,0.28)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-36 text-center px-6" style={{ borderTop: '1px solid rgba(36,91,255,0.07)', background: '#F9F6F2' }}>
        <div className="relative w-24 h-24 mx-auto mb-10">
          <MashrabiyaPattern className="w-full h-full" style={{ color: '#245BFF', opacity: 0.18 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full" style={{ background: 'linear-gradient(135deg,#245BFF,#F4C6D7)' }} />
          </div>
        </div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] mb-6" style={{ color: '#BBA98A' }}>Join the movement</p>
        <h2 className="display-serif font-black leading-[0.9] mb-8" style={{ fontSize: 'clamp(2.8rem,8vw,6.5rem)', color: '#0D0D0D' }}>
          Your style era<br />
          <span style={{ background: 'linear-gradient(125deg,#245BFF 0%,#7B9FFF 40%,#F4C6D7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>starts now.</span>
        </h2>
        <p className="mb-10 text-sm max-w-sm mx-auto leading-[1.85] font-light" style={{ color: '#8A8A8A' }}>No algorithm selling you things. No generic advice. Just your style, finally figured out.</p>
        {joined ? (
          <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium" style={{ background: 'rgba(46,139,87,0.08)', border: '1px solid rgba(46,139,87,0.2)', color: '#2E8B57' }}>
            You are in. We will be in touch.
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (email) setJoined(true) }} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 rounded-full px-5 py-3 text-sm focus:outline-none" style={{ border: '1px solid rgba(36,91,255,0.18)', background: '#FFFFFF', color: '#0D0D0D' }} />
            <button type="submit" className="rounded-full px-6 py-3 text-sm font-bold text-white whitespace-nowrap" style={{ background: 'linear-gradient(135deg,#245BFF,#1a47db)', boxShadow: '0 8px 24px rgba(36,91,255,0.22)' }}>Get early access</button>
          </form>
        )}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-[0.6rem] font-medium uppercase tracking-[0.18em]" style={{ color: '#C8C0B8' }}>
          <span>Free forever</span>
          <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#E8D8B5' }} />
          <span>No card required</span>
          <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#E8D8B5' }} />
          <span>Your data stays yours</span>
          <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#E8D8B5' }} />
          <span>Built for Arab women</span>
        </div>
      </section>

    </div>
  )
}
