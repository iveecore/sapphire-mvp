import type { Metadata } from 'next'
import './globals.css'
import { LayoutDashboard, UserCircle2, ShieldCheck, Gem, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sapphire — Dress Like You Mean It',
  description: 'Your AI stylist. Personalized outfits, fit-aware recs, and a wardrobe that actually works. Built for women who know what they want.',
  keywords: ['women fashion AI', 'personal stylist app', 'outfit recommendations', 'wardrobe app', 'AI styling', 'outfit planner'],
  metadataBase: new URL('https://sapphire-mvp.vercel.app'),
  alternates: {
    canonical: 'https://sapphire-mvp.vercel.app'
  },
  openGraph: {
    title: 'Sapphire — Dress Like You Mean It',
    description: 'Your AI stylist. Personalized outfits, fit-aware recs, and a wardrobe that actually works. Built for women who know what they want.',
    url: 'https://sapphire-mvp.vercel.app',
    siteName: 'Sapphire by IVEE',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sapphire — Dress Like You Mean It',
    description: 'Your AI stylist. Personalized outfits, fit-aware recs, and a wardrobe that actually works.',
    creator: '@iveecore',
  },
  robots: {
    index: true,
    follow: true,
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sapphire',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  description: 'AI-powered personal stylist app built for women. Personalized outfit recommendations, fit-aware wardrobe curation, and style identity built around you.',
  url: 'https://sapphire-mvp.vercel.app',
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Starter' },
    { '@type': 'Offer', price: '12', priceCurrency: 'USD', name: 'Icon' },
    { '@type': 'Offer', price: '29', priceCurrency: 'USD', name: 'Muse' },
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="public, max-age=3600" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7a4cf5] to-[#f472b6] text-white shadow-lg shadow-[#7a4cf5]/20 transition-all duration-300 group-hover:shadow-[#7a4cf5]/40 group-hover:scale-105">
                <Gem size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#7a4cf5]">IVEE</div>
                <div className="text-[17px] font-bold text-[#1f1f26] leading-none">Sapphire</div>
              </div>
            </a>

            {/* Nav links */}
            <div className="hidden sm:flex items-center gap-1 text-sm">
              <a href="/vision" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[#4a4654] hover:bg-[#7a4cf5]/8 hover:text-[#7a4cf5] transition-all duration-200 font-medium">
                ✦ Vision
              </a>
              <a href="/pricing" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[#4a4654] hover:bg-[#7a4cf5]/8 hover:text-[#7a4cf5] transition-all duration-200 font-medium">
                <Tag size={14} /> Pricing
              </a>
              <a href="/dashboard" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[#4a4654] hover:bg-[#7a4cf5]/8 hover:text-[#7a4cf5] transition-all duration-200 font-medium">
                <LayoutDashboard size={14} /> Dashboard
              </a>
              <a href="/profile" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[#4a4654] hover:bg-[#7a4cf5]/8 hover:text-[#7a4cf5] transition-all duration-200 font-medium">
                <UserCircle2 size={14} /> Profile
              </a>
              <a href="/account" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[#4a4654] hover:bg-[#7a4cf5]/8 hover:text-[#7a4cf5] transition-all duration-200 font-medium">
                <ShieldCheck size={14} /> Trust
              </a>
            </div>

            {/* CTA */}
            <a
              href="/signup"
              className="rounded-full bg-gradient-to-r from-[#7a4cf5] to-[#f472b6] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#7a4cf5]/25 hover:shadow-[#7a4cf5]/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get started ✦
            </a>
          </nav>
        </header>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
