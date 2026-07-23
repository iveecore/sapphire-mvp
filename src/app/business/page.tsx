import type { LucideIcon } from 'lucide-react'
import { ArrowRight, BarChart3, Building2, Factory, Network, ShieldCheck, Store, Users } from 'lucide-react'
import { partnerSegments } from '@/lib/platform/catalog'

const flow = [
  ['Consumer', 'Style, wardrobe, fit, feedback'],
  ['Sapphire', 'Personalized demand and trust layer'],
  ['Partner', 'Brand, retailer, creator, factory'],
  ['Outcome', 'Better match, fewer returns, higher loyalty']
]

const partnerSystems: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Store, label: 'Retail partners' },
  { icon: Building2, label: 'Brand portals' },
  { icon: Users, label: 'Creator commerce' },
  { icon: Factory, label: 'Factory signals' }
]

const trustControls: Array<{ icon: LucideIcon; label: string }> = [
  { icon: ShieldCheck, label: 'Permissioned data' },
  { icon: Network, label: 'Aggregated signals' },
  { icon: BarChart3, label: 'Explainable metrics' },
  { icon: Store, label: 'Partner-safe APIs' }
]

export default function BusinessPage() {
  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="glass rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="micro-label">IVEE Business</div>
              <h1 className="display-serif mt-4 text-5xl sm:text-6xl font-black text-[#1a1626]">
                B2B2C fashion intelligence.
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-[#6d6875]">
                IVEE connects women, brands, retailers, creators, and factories through permissioned identity, fit memory, and demand signals.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2838]">
                  View consumer shop <ArrowRight size={16} />
                </a>
                <a href="/vision" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1a1626] hover:bg-black/5">
                  Platform vision
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {partnerSystems.map(({ icon: IconComp, label }) => (
                <div key={label} className="rounded-[1.5rem] border border-black/5 bg-white/75 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1626] text-white">
                    <IconComp size={18} />
                  </div>
                  <div className="mt-4 font-bold text-[#1a1626]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {partnerSegments.map((segment) => (
            <article key={segment.name} className="panel rounded-[2rem] p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(122,76,245,0.14)]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xl font-bold text-[#1a1626]">{segment.name}</div>
                <div className="rounded-full bg-[#f8f2ff] px-3 py-1 text-sm font-bold text-[#7a4cf5]">{segment.metric}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6d6875]">{segment.outcome}</p>
              <div className="mt-5 rounded-[1.4rem] bg-[#fcfbfa] p-4 text-sm leading-6 text-[#4a4654]">{segment.offer}</div>
            </article>
          ))}
        </section>

        <section className="rounded-[2.5rem] bg-[#1a1626] p-6 sm:p-10 text-white">
          <div className="flex flex-col gap-8">
            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">B2B2C loop</div>
              <h2 className="display-serif mt-4 text-4xl sm:text-5xl font-black">Personalization becomes market infrastructure.</h2>
            </div>

            <div className="grid gap-3 lg:grid-cols-4">
              {flow.map(([title, body], index) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f43f7e] text-sm font-bold">{index + 1}</div>
                  <div className="mt-5 text-lg font-bold">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <div className="micro-label">Partner console</div>
            <h2 className="mt-3 text-2xl font-bold text-[#1a1626]">What partners would see</h2>
            <div className="mt-6 space-y-4">
              {[
                ['Fit gap detected', 'High demand for modest office sets in mid sizes'],
                ['Return risk', 'Two products underperforming on waist fit'],
                ['Creator lift', 'Remixed outfits driving 4.2x saves'],
                ['Demand signal', 'Travel capsule searches up 31% this week']
              ].map(([title, body]) => (
                <div key={title} className="rounded-[1.4rem] bg-[#fcfbfa] p-4">
                  <div className="font-semibold text-[#1a1626]">{title}</div>
                  <div className="mt-1 text-sm text-[#6d6875]">{body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <div className="micro-label">Controls</div>
            <h2 className="mt-3 text-2xl font-bold text-[#1a1626]">Why this can be trusted</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {trustControls.map(({ icon: IconComp, label }) => (
                <div key={label} className="rounded-[1.4rem] bg-[#fcfbfa] p-4">
                  <IconComp size={18} className="text-[#7a4cf5]" />
                  <div className="mt-4 text-sm font-bold text-[#1a1626]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
