import type { Metadata } from 'next'
import './globals.css'
import { Sparkles, UserCircle2, LayoutDashboard, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sapphire - AI Styling for Women',
  description: 'A trusted, personalized fashion companion built around identity, confidence, and fit.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f26] text-white shadow-lg shadow-black/10">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.18em] uppercase text-[#6d6875]">IVEE</div>
                <div className="text-lg font-semibold text-[#1f1f26]">Sapphire</div>
              </div>
            </a>
            <div className="flex items-center gap-2 sm:gap-3 text-sm">
              <a href="/vision" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[#4a4654] hover:bg-black/5">
                <Sparkles size={16} /> Vision
              </a>
              <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[#4a4654] hover:bg-black/5">
                <LayoutDashboard size={16} /> Dashboard
              </a>
              <a href="/profile" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[#4a4654] hover:bg-black/5">
                <UserCircle2 size={16} /> Profile
              </a>
              <a href="/account" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[#4a4654] hover:bg-black/5">
                <ShieldCheck size={16} /> Trust
              </a>
            </div>
          </nav>
        </header>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
