export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-60" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#7a4cf5]/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20 relative">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="max-w-2xl">
              <div className="micro-label fade-up">Identity-first styling</div>
              <h1 className="display-title fade-up-delay-1 mt-4 text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#1f1f26] leading-[0.96]">
                A personal stylist built around
                <span className="block text-[#7a4cf5]">confidence, fit, and trust.</span>
              </h1>
              <p className="fade-up-delay-2 mt-6 max-w-xl text-lg sm:text-xl text-[#6d6875] leading-8">
                Sapphire learns your style, body-fit context, wardrobe, and daily life so every recommendation feels tailored, calm, and genuinely useful.
              </p>
              <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
                <a href="/signup" className="inline-flex items-center justify-center rounded-full bg-[#1f1f26] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2732]">
                  Start private styling
                </a>
                <a href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-[#1f1f26] transition hover:-translate-y-0.5 hover:bg-white">
                  Open dashboard
                </a>
                <a href="/vision" className="inline-flex items-center justify-center rounded-full border border-[#7a4cf5]/20 bg-[#7a4cf5]/8 px-6 py-3 text-sm font-semibold text-[#7a4cf5] transition hover:-translate-y-0.5 hover:bg-[#7a4cf5]/12">
                  Open vision board
                </a>
                <a href="/community" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#7a4cf5] transition hover:bg-[#7a4cf5]/8">
                  Browse community
                </a>
              </div>
              <div className="fade-up-delay-2 mt-10 grid grid-cols-3 gap-3 max-w-xl">
                {[
                  ['1 tap', 'Daily decisions'],
                  ['Fit-aware', 'Body context'],
                  ['Private', 'User controlled']
                ].map(([k, v]) => (
                  <div key={k} className="glass rounded-2xl p-4">
                    <div className="text-lg font-semibold text-[#1f1f26]">{k}</div>
                    <div className="mt-1 text-sm text-[#6d6875]">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass rounded-[2rem] p-4 sm:p-6 lg:p-8">
                <div className="panel rounded-[1.5rem] p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="micro-label">Today&apos;s assist</div>
                      <div className="mt-2 text-2xl font-semibold text-[#1f1f26]">What should I wear?</div>
                    </div>
                    <div className="rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-semibold text-[#0f766e]">
                      Live context
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      ['Weather', 'Warm afternoon'],
                      ['Occasion', 'Office to dinner'],
                      ['Wardrobe', '24 saved items'],
                      ['Confidence', 'Comfort first']
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-black/5 bg-[#fbfaf8] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6875]">{label}</div>
                        <div className="mt-2 text-sm font-medium text-[#1f1f26]">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-[1.4rem] bg-[#1f1f26] p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white/70">Recommended outfit</span>
                      <span className="text-sm font-semibold text-[#f7d7df]">92% confidence match</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-white/10" />
                      <div>
                        <div className="font-semibold">Soft structure set</div>
                        <div className="text-sm text-white/65">Balanced for comfort, movement, and polish</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['fit-aware', 'budget-safe', 'weather-ready', 'saveable'].map((tag) => (
                        <span key={tag} className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/75">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Memory-rich', 'The app remembers what you wear, what you save, and what you reject.'],
            ['Fit-first', 'Body profile, sizing, and confidence signals shape the recommendations.'],
            ['Trust-led', 'Privacy settings, audit history, and permissions stay visible and controlled.']
          ].map(([title, body]) => (
            <div key={title} className="panel rounded-[1.75rem] p-6 transition hover:-translate-y-1">
              <div className="micro-label">{title}</div>
              <p className="mt-3 text-base leading-7 text-[#4a4654]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="micro-label">Built from the boards</div>
              <h2 className="mt-3 text-2xl font-semibold text-[#1f1f26]">The product should feel like the system you shared.</h2>
            </div>
            <a href="/vision" className="rounded-full bg-[#1f1f26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d2838]">
              View full vision
            </a>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {[
              ['/design/home-board.png', 'Product journeys and mobile surface'],
              ['/design/ivoe-architecture-board.png', 'Identity, trust, memory, and decision architecture']
            ].map(([src, caption]) => (
              <div key={caption} className="rounded-[1.6rem] overflow-hidden border border-black/5 bg-[#0f0b18]">
                <img src={src} alt={caption} className="block h-auto w-full object-cover" />
                <div className="bg-white px-4 py-3 text-sm text-[#6d6875]">{caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
