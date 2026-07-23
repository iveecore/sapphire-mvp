'use client'
import { useState } from 'react'

const TABS = ['Clients', 'Collabs', 'Calendar', 'Revenue', 'Analytics'] as const
type Tab = typeof TABS[number]

const MOCK_CLIENTS = [
  { name: 'Amara Johnson', since: 'Jan 2026', sessions: 4, lastFit: '2 days ago', status: 'active' },
  { name: 'Sofia Reyes', since: 'Mar 2026', sessions: 2, lastFit: '1 week ago', status: 'active' },
  { name: 'Chloe Park', since: 'Jun 2026', sessions: 1, lastFit: '3 weeks ago', status: 'new' },
]

const MOCK_COLLABS = [
  { brand: 'Zara Studio', type: 'Affiliate', status: 'Active', earnings: '$240', started: 'Apr 2026' },
  { brand: 'ASOS Select', type: 'Gifting', status: 'Pending', earnings: '–', started: 'Jul 2026' },
  { brand: 'Mango × You', type: 'Campaign', status: 'Completed', earnings: '$850', started: 'Feb 2026' },
]

const MOCK_REVENUE = [
  { month: 'Apr', amount: 380 },
  { month: 'May', amount: 520 },
  { month: 'Jun', amount: 410 },
  { month: 'Jul', amount: 760 },
]

const maxRevenue = Math.max(...MOCK_REVENUE.map(r => r.amount))

export default function BusinessPage() {
  const [tab, setTab] = useState<Tab>('Clients')

  return (
    <div className="p-5 sm:p-7 max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="micro-label mb-1">Business mode</div>
          <h1 className="display-serif text-3xl sm:text-4xl font-black text-[#1a1626]">
            Your style <span className="gradient-text">empire.</span>
          </h1>
          <p className="text-sm text-[#9e97a8] mt-1">Manage clients, collabs, content, and revenue from one place.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d2838] transition">
          + New client
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active clients', value: '3', emoji: '👥' },
          { label: 'Active collabs', value: '2', emoji: '🤝' },
          { label: 'Monthly revenue', value: '$760', emoji: '💰' },
          { label: 'Content pieces', value: '12', emoji: '📸' },
        ].map(s => (
          <div key={s.label} className="panel rounded-[1.75rem] p-4 card-hover text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-2xl font-black gradient-text">{s.value}</div>
            <div className="text-xs text-[#9e97a8] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="panel rounded-[2rem] overflow-hidden">
        <div className="border-b border-black/5 flex overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition ${
                tab === t
                  ? 'border-b-2 border-[#7a4cf5] text-[#1a1626]'
                  : 'text-[#9e97a8] hover:text-[#1a1626]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">

          {/* CLIENTS */}
          {tab === 'Clients' && (
            <div className="space-y-3">
              {MOCK_CLIENTS.map(c => (
                <div key={c.name} className="flex items-center gap-4 rounded-2xl bg-[#f7f4ff] px-4 py-3 hover:bg-purple-50 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-rose-200 flex items-center justify-center text-lg shrink-0">👤</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#1a1626]">{c.name}</div>
                    <div className="text-xs text-[#9e97a8]">Client since {c.since} · {c.sessions} sessions · Last fit {c.lastFit}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.status === 'new' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                  }`}>{c.status}</span>
                </div>
              ))}
              <button className="w-full rounded-2xl border-2 border-dashed border-black/10 py-4 text-sm text-[#9e97a8] hover:border-[#7a4cf5]/30 hover:text-[#7a4cf5] transition">
                + Add a client
              </button>
            </div>
          )}

          {/* COLLABS */}
          {tab === 'Collabs' && (
            <div className="space-y-3">
              {MOCK_COLLABS.map(c => (
                <div key={c.brand} className="flex items-center gap-4 rounded-2xl bg-[#f7f4ff] px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-orange-200 flex items-center justify-center text-lg shrink-0">🤝</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#1a1626]">{c.brand}</div>
                    <div className="text-xs text-[#9e97a8]">{c.type} · Started {c.started}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#1a1626]">{c.earnings}</div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.status === 'Active' ? 'bg-emerald-50 text-emerald-700'
                      : c.status === 'Pending' ? 'bg-amber-50 text-amber-700'
                      : 'bg-[#f3edff] text-[#7a4cf5]'
                    }`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CALENDAR */}
          {tab === 'Calendar' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <div className="text-sm font-semibold text-[#1a1626] mb-1">Content calendar coming soon</div>
              <p className="text-xs text-[#9e97a8]">Plan your outfit posts, brand drops, and client sessions.</p>
            </div>
          )}

          {/* REVENUE */}
          {tab === 'Revenue' && (
            <div>
              <div className="micro-label mb-4">Monthly earnings</div>
              <div className="flex items-end gap-3 h-32">
                {MOCK_REVENUE.map(r => (
                  <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-bold text-[#7a4cf5]">${r.amount}</div>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#7a4cf5] to-[#f43f7e] opacity-80"
                      style={{ height: `${(r.amount / maxRevenue) * 96}px` }}
                    />
                    <div className="text-xs text-[#9e97a8]">{r.month}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-[#f7f4ff] px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[#6d6875]">Total this quarter</span>
                <span className="text-sm font-black gradient-text">$1,670</span>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === 'Analytics' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📈</div>
              <div className="text-sm font-semibold text-[#1a1626] mb-1">Performance analytics</div>
              <p className="text-xs text-[#9e97a8]">See which outfits and content drive the most engagement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
