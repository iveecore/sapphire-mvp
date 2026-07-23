import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Sapphire',
  description: 'Start free. Upgrade when you\'re ready. Three plans built around how serious you are about your style.',
}

const tiers = [
  {
    emoji: '🌸',
    name: 'Starter',
    price: 'Free',
    priceNote: 'forever',
    tagline: 'Dip your toes in.',
    cta: 'Start for free',
    ctaHref: '/signup',
    ctaStyle: 'bg-[#1f1f26] text-white hover:bg-[#2d2838]',
    highlight: false,
    features: [
      '10 wardrobe items',
      '3 outfit picks per week',
      'Style quiz & vibe match',
      'Community browse',
      'Basic fit profile',
    ],
  },
  {
    emoji: '💜',
    name: 'Icon',
    price: '$12',
    priceNote: 'per month',
    tagline: 'For the girl who means business.',
    cta: 'Get Icon',
    ctaHref: '/signup?plan=icon',
    ctaStyle: 'bg-[#7a4cf5] text-white hover:bg-[#6b3ee8]',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Unlimited wardrobe items',
      'Daily AI outfit recommendations',
      'Full body fit profile',
      'Photo uploads for items',
      'Style insights & trends',
      'Priority support',
    ],
  },
  {
    emoji: '🔮',
    name: 'Muse',
    price: '$29',
    priceNote: 'per month',
    tagline: 'Your personal stylist, on demand.',
    cta: 'Get Muse',
    ctaHref: '/signup?plan=muse',
    ctaStyle: 'bg-gradient-to-r from-[#7a4cf5] to-[#f472b6] text-white hover:opacity-90',
    highlight: false,
    features: [
      'Everything in Icon',
      'AI stylist chat (unlimited)',
      'Brand partner deals & discounts',
      'Outfit calendar & planning',
      'Early access to new features',
      '1-on-1 style call per month',
    ],
  },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — no contracts, no drama. Cancel any time from your account settings and you\'ll keep access until the end of your billing period.',
  },
  {
    q: 'Is my data private?',
    a: 'Completely. Your style data, wardrobe, and body profile belong to you. We never sell it, never share it. You can export or delete everything at any time.',
  },
  {
    q: 'What\'s the difference between Icon and Muse?',
    a: 'Icon is for everyday styling — unlimited AI outfits, uploads, and insights. Muse goes deeper: you get AI stylist chat, brand deals, a full outfit calendar, and a real 1-on-1 style call every month.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf0ff 0%, #fff0f6 50%, #fff8f0 100%)' }}>

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#7a4cf5]/20 bg-[#7a4cf5]/8 px-4 py-1.5 text-sm font-semibold text-[#7a4cf5] mb-6">
          ✦ Simple, transparent pricing
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-5">
          <span style={{
            background: 'linear-gradient(135deg, #7a4cf5, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Your era.<br />Your style.<br />Your rules.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-[#6d6875] max-w-md mx-auto leading-7">
          Start free. Upgrade when you&apos;re ready. No pressure.
        </p>
      </section>

      {/* Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tier.highlight
                  ? 'border-2 border-[#7a4cf5] shadow-[#7a4cf5]/15'
                  : 'border border-black/5'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-[#7a4cf5] to-[#f472b6] px-4 py-1 text-xs font-bold text-white shadow-md">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="text-4xl mb-4">{tier.emoji}</div>
              <div className="text-xl font-bold text-[#1f1f26] mb-1">{tier.name}</div>
              <p className="text-sm text-[#6d6875] mb-4">{tier.tagline}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[#1f1f26]">{tier.price}</span>
                <span className="text-sm text-[#9e97a8]">{tier.priceNote}</span>
              </div>

              <a
                href={tier.ctaHref}
                className={`block w-full rounded-2xl px-5 py-3 text-center text-sm font-semibold transition-all duration-200 mb-8 ${tier.ctaStyle}`}
              >
                {tier.cta}
              </a>

              <div className="space-y-3">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-3 text-sm text-[#4a4654]">
                    <span className="mt-0.5 text-[#7a4cf5] font-bold flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[#6d6875]">
          {['No credit card required', 'Cancel anytime', 'Your data stays yours', 'Built for women'].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="text-[#7a4cf5]">✦</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 pb-28">
        <h2 className="text-2xl font-bold text-[#1f1f26] text-center mb-10">Got questions?</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
              <div className="text-base font-semibold text-[#1f1f26] mb-2">{faq.q}</div>
              <p className="text-sm text-[#6d6875] leading-6">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#6d6875] mb-4">Still not sure? Start free — no card needed.</p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7a4cf5] to-[#f472b6] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#7a4cf5]/25 hover:shadow-[#7a4cf5]/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Start your style era ✦
          </a>
        </div>
      </section>
    </div>
  )
}
