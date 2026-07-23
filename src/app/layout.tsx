import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sapphire — AI-Powered Style for Every Woman',
  description: 'Your personal AI stylist. 10k community looks. 100% private. No tracking.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">Sapphire</h1>
            <div className="flex gap-4">
              <a href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</a>
              <a href="/account" className="text-gray-600 hover:text-black">Account</a>
            </div>
          </nav>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
