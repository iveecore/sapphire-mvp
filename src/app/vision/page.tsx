import Image from 'next/image'
import type { ElementType } from 'react'
import { ArrowRight, Atom, ShieldCheck, Sparkles, Users, Box, Layers3 } from 'lucide-react'

const pillars = [
  ['Identity', 'Every recommendation starts with who the person is and what they permit.'],
  ['Context', 'Weather, occasion, body-fit, budget, and memory change the answer.'],
  ['Trust', 'Privacy, audit logs, and transparency stay visible and controlled.'],
  ['Memory', 'The system learns from wears, saves, likes, and feedback over time.']
]

const metrics = [
  ['Trust Score', '96.7/100'],
  ['Fit Confidence', '92%'],
  ['Profile Completion', '80%'],
  ['Daily Utility', 'High']
]

const coreCards: Array<{ icon: ElementType; label: string }> = [
  { icon: Atom, label: 'Identity' },
  { icon: Users, label: 'Relationships' },
  { icon: Layers3, label: 'Context' },
  { icon: Box, label: 'Objects' }
]

export default function VisionPage() {
  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="glass overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="micro-label">IVEE / Sapphire vision</div>
              <h1 className="display-title mt-4 text-4xl sm:text-6xl font-semibold text-[#1f1f26] leading-[0.95]">
                A human identity OS,
                <span className="block text-[#7a4cf5]">expressed through Sapphire.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-[#6d6875]">
                This page translates the architecture boards into the actual product story: identity, journey, fit, trust, memory, and a consumer app that feels premium and alive.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[#1f1f26] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2838]">
                  Open product <ArrowRight size={16} />
                </a>
                <a href="/" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1f1f26] hover:bg-black/5">
                  Back home
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {pillars.map(([title, body]) => (
                  <div key={title} className="rounded-3xl border border-black/5 bg-[#fcfbfa] p-4">
                    <div className="text-sm font-semibold text-[#1f1f26]">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#6d6875]">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black/5 lg:border-t-0 lg:border-l border-black/5 bg-[linear-gradient(135deg,rgba(122,76,245,0.08),rgba(217,86,114,0.08),rgba(15,118,110,0.05))] p-4 sm:p-6 lg:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {metrics.map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] bg-white/80 p-5 shadow-[0_14px_40px_rgba(23,18,40,0.08)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6875]">{label}</div>
                    <div className="mt-3 text-2xl font-semibold text-[#1f1f26]">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[1.8rem] bg-[#1f1f26] p-4 sm:p-5 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
                  <ShieldCheck size={14} /> Trust layer
                </div>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Every saved item, fit note, and recommendation should be explainable, permissioned, and reversible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="panel rounded-[2rem] p-5 sm:p-6">
            <div className="micro-label">Architecture board</div>
            <h2 className="mt-3 text-2xl font-semibold text-[#1f1f26]">From laws to experiences</h2>
            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#0f0b18] p-3">
              <Image
                src="/design/ivoe-architecture-board.png"
                alt="IVEE architecture board"
                width={1600}
                height={900}
                className="h-auto w-full rounded-[1rem] object-cover"
                priority
              />
            </div>
          </div>

          <div className="panel rounded-[2rem] p-5 sm:p-6">
            <div className="micro-label">Core primitives</div>
            <h2 className="mt-3 text-2xl font-semibold text-[#1f1f26]">Identity is the root.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {coreCards.map(({ icon: Icon, label }) => {
                return (
                  <div key={label} className="rounded-[1.4rem] bg-[#fcfbfa] p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f1f26] text-white">
                      <Icon size={16} />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-[#1f1f26]">{label}</div>
                  </div>
                )
              })}
            </div>
            <p className="mt-5 text-sm leading-7 text-[#6d6875]">
              The app should feel like a living system: profile, permissions, memory, outfit decisions, trust history, and the daily journey all connected.
            </p>
          </div>
        </section>

        <section className="panel rounded-[2rem] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="micro-label">Product journey</div>
              <h2 className="mt-3 text-2xl font-semibold text-[#1f1f26]">Discover to grow</h2>
              <p className="mt-4 text-sm leading-7 text-[#6d6875]">
                This mirrors the journey boards: discover, sign up, onboard, create profile, home, engage, then grow through rewards and memory.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#0f0b18] p-3">
              <Image
                src="/design/journey-board.png"
                alt="User journey map"
                width={1600}
                height={900}
                className="h-auto w-full rounded-[1rem] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="panel rounded-[2rem] p-5 sm:p-6">
            <div className="micro-label">Mobile journey</div>
            <h2 className="mt-3 text-2xl font-semibold text-[#1f1f26]">Make the app feel real</h2>
            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#0f0b18] p-3">
              <Image
                src="/design/home-board.png"
                alt="Home and mobile journey board"
                width={1600}
                height={900}
                className="h-auto w-full rounded-[1rem] object-cover"
              />
            </div>
          </div>

          <div className="panel rounded-[2rem] p-5 sm:p-6">
            <div className="micro-label">Landing system</div>
            <h2 className="mt-3 text-2xl font-semibold text-[#1f1f26]">A more complete first viewport</h2>
            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#0f0b18] p-3">
              <Image
                src="/design/sapphire-landing-board.png"
                alt="Sapphire landing board"
                width={1600}
                height={900}
                className="h-auto w-full rounded-[1rem] object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
