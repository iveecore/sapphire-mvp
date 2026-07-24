import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { getServerSession } from '@/lib/auth/session'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const session = getServerSession(cookieStore.get('ivee_session')?.value)
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen bg-[#fdf8ff]">
      <DashboardSidebar />
      <main className="flex-1 ml-[72px] lg:ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
