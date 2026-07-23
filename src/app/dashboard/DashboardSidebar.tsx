'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { emoji: '🏠', label: 'Home',     href: '/dashboard' },
  { emoji: '👗', label: 'Closet',   href: '/dashboard/closet' },
  { emoji: '✨', label: 'Fits',     href: '/dashboard/fits' },
  { emoji: '📝', label: 'Studio',   href: '/dashboard/studio' },
  { emoji: '📊', label: 'Sheets',   href: '/dashboard/sheets' },
  { emoji: '🛍', label: 'Market',   href: '/dashboard/market' },
  { emoji: '🎮', label: 'Games',    href: '/dashboard/games' },
  { emoji: '💬', label: 'Chat',     href: '/dashboard/chat' },
  { emoji: '💼', label: 'Business', href: '/dashboard/business' },
  { emoji: '⚙️', label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const path = usePathname() ?? ''
  return (
    <>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[72px] lg:w-[220px] glass border-r border-black/5 z-40 flex flex-col py-5 px-2 lg:px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-1">
          <div className="w-9 h-9 rounded-xl bg-[#1a1626] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="11" cy="11" r="3" fill="#7a4cf5"/>
            </svg>
          </div>
          <span className="hidden lg:block font-bold text-[#1a1626] text-sm">Sapphire</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV.map(item => {
            const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? 'bg-[#7a4cf5] text-white shadow-md shadow-purple-200'
                    : 'text-[#6d6875] hover:bg-purple-50 hover:text-[#7a4cf5]'
                }`}
              >
                <span className="text-xl leading-none flex-shrink-0">{item.emoji}</span>
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Token balance */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-purple-50 to-rose-50 border border-purple-100 p-3 hidden lg:block">
          <div className="micro-label mb-1">Tokens left</div>
          <div className="text-xl font-black gradient-text">100</div>
          <a href="/pricing" className="text-xs text-[#7a4cf5] font-semibold hover:underline">Get more →</a>
        </div>
      </aside>

      {/* Floating AI button */}
      <Link
        href="/dashboard/chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#7a4cf5] shadow-xl shadow-purple-300/50 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        title="Chat with your AI"
      >
        💬
      </Link>
    </>
  )
}
