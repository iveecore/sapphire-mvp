import { ArrowRight, BadgeCheck, Filter, Heart, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { shopCollections } from '@/lib/platform/catalog'

export default function ShopPage() {
  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="glass overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="micro-label">Sapphire Shop</div>
              <h1 className="display-serif mt-4 text-5xl sm:text-6xl font-black text-[#1a1626]">
                Shop what fits your life.
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-[#6d6875]">
                Not a fast-fashion feed. Sapphire ranks products by fit confidence, wardrobe gaps, budget, occasion, and user-controlled style memory.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/profile" className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2838]">
                  Improve fit score <ArrowRight size={16} />
                </a>
                <a href="/business" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1a1626] hover:bg-black/5">
                  Partner with IVEE
                </a>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_50%_10%,rgba(244,63,126,0.28),transparent_34%),linear-gradient(135deg,#1a1626,#2b1744_55%,#0d0b18)] p-6 sm:p-8">
              <div className="absolute inset-0 hero-grid opacity-20" />
              <div className="relative ml-auto max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">AI recommended</div>
                    <div className="mt-2 text-2xl font-bold">Power Gym Look</div>
                  </div>
                  <div className="rounded-full bg-[#f43f7e] px-3 py-1 text-sm font-bold">98%</div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {['Bra', 'Leggings', 'Hoodie', 'Shoes'].map((piece) => (
                    <div key={piece} className="aspect-square rounded-[1.4rem] bg-white/12 p-4">
                      <div className="h-full rounded-[1rem] bg-white/16" />
                      <div className="mt-2 text-xs text-white/70">{piece}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[1.4rem] bg-black/20 p-4">
                  <div className="text-sm font-semibold">Why this works</div>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Supportive fit, movement-safe coverage, and pieces that match your active wardrobe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-[#6d6875]">
              <Search size={16} />
              <span>Search outfits, brands, sizes, occasions...</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Work', 'Active', 'Modest', 'Travel'].map((item) => (
                <button key={item} className="rounded-full bg-[#f7f1ff] px-4 py-2 text-sm font-semibold text-[#7a4cf5] hover:bg-[#eadcff]">
                  {item}
                </button>
              ))}
              <button className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-4 py-2 text-sm font-semibold text-white">
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {shopCollections.map((item) => (
            <article key={item.name} className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_14px_50px_rgba(23,18,40,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(122,76,245,0.18)]">
              <div className={`relative aspect-[4/5] bg-gradient-to-br ${item.palette}`}>
                <div className="absolute inset-0 hero-grid opacity-25" />
                <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#f43f7e]">
                  <Heart size={16} />
                </button>
                <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-[#1a1626]">{item.match}% match</div>
                <div className="absolute bottom-4 left-4 right-4 rounded-[1.4rem] bg-white/88 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7a4cf5]">
                    <BadgeCheck size={14} /> Fit verified
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4a4654]">{item.fit}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#1a1626]">{item.name}</h2>
                    <p className="mt-1 text-sm text-[#6d6875]">{item.category}</p>
                  </div>
                  <div className="font-bold text-[#1a1626]">{item.price}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.pieces.slice(0, 3).map((piece) => (
                    <span key={piece} className="rounded-full bg-[#f8f2ff] px-3 py-1 text-xs font-semibold text-[#7a4cf5]">{piece}</span>
                  ))}
                </div>
                <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1626] px-4 py-3 text-sm font-bold text-white hover:bg-[#2d2838]">
                  <ShoppingBag size={16} /> Add look
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,#1a1626,#37205a_55%,#1a1626)] p-6 sm:p-10 text-white">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Commerce moat</div>
              <h2 className="display-serif mt-4 text-4xl sm:text-5xl font-black">Beat fast fashion by knowing the person better.</h2>
              <p className="mt-4 max-w-xl text-sm sm:text-base leading-8 text-white/68">
                Shein competes on price and speed. Sapphire competes on fit memory, wardrobe gaps, confidence feedback, trust, and better matching.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Fit memory', 'Return prevention', 'Wardrobe gaps', 'Creator drops'].map((label) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                  <Sparkles size={18} className="text-[#f472b6]" />
                  <div className="mt-4 font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

