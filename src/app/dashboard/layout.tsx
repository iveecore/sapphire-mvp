import type { ReactNode } from 'react'
import DashboardSidebar from './DashboardSidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fdf8ff]">
      <DashboardSidebar />
      <main className="flex-1 ml-[72px] lg:ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
