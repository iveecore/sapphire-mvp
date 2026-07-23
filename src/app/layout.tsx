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
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080610]/80 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#c084fc] to-[#f472b6]">
                <Gem size={14} className="text-white" />
              </div>
              <div>
                <div className="text-[0.58rem] font-bold tracking-[0.24em] uppercase text-white/30">IVEE</div>
                <div className="text-[15px] font-bold text-white leading-none">Sapphire</div>
              </div>
            </a>

            <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-white/35">
              <a href="/vision" className="hover:text-white/70 transition">Vision</a>
              <a href="/pricing" className="hover:text-white/70 transition">Pricing</a>
              <a href="/dashboard" className="hover:text-white/70 transition">Dashboard</a>
              <a href="/profile" className="hover:text-white/70 transition">Profile</a>
            </div>

            <a
              href="/signup"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition"
            >
              Get started
            </a>
          </nav>
        </header>
        <div className="h-[57px]" />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
