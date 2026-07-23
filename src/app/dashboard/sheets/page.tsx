'use client'
import { useState } from 'react'

type Row = { item: string; category: string; price: string; whereToBuy: string; priority: string }

const DEFAULT_ROWS: Row[] = [
  { item: 'White linen blazer', category: 'Tops', price: '$85', whereToBuy: 'Zara', priority: 'High' },
  { item: 'Wide-leg trousers', category: 'Bottoms', price: '$60', whereToBuy: 'ASOS', priority: 'Medium' },
  { item: 'Leather mules', category: 'Shoes', price: '$120', whereToBuy: 'Mango', priority: 'High' },
  { item: 'Gold chain belt', category: 'Accessories', price: '$35', whereToBuy: 'Depop', priority: 'Low' },
]

const COLS = ['Item', 'Category', 'Price', 'Where to Buy', 'Priority'] as const
const FIELD_MAP: Record<typeof COLS[number], keyof Row> = {
  'Item': 'item', 'Category': 'category', 'Price': 'price', 'Where to Buy': 'whereToBuy', 'Priority': 'priority'
}
const PRIORITY_COLORS: Record<string, string> = {
  'High': 'bg-rose-100 text-rose-700',
  'Medium': 'bg-amber-100 text-amber-700',
  'Low': 'bg-emerald-100 text-emerald-700',
}

export default function SheetsPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)

  const addRow = () => setRows(r => [...r, { item: '', category: '', price: '', whereToBuy: '', priority: 'Medium' }])

  const updateCell = (i: number, field: keyof Row, val: string) => {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row))
  }

  return (
    <div className="blob-bg min-h-screen p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-serif text-4xl font-black text-[#1a1626]">
            Your Sheets <span className="gradient-text">📊</span>
          </h1>
          <p className="text-[#6d6875] mt-1">Track your wishlist, budget & shopping plans.</p>
        </div>
        <button
          onClick={() => console.log('Save:', rows)}
          className="rounded-full bg-[#7a4cf5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3ee8] transition"
        >
          Save ✓
        </button>
      </div>

      {/* Sheet tabs */}
      <div className="flex gap-2 mb-4">
        {['Shopping List', 'Budget Tracker', 'Collab Log'].map((tab, i) => (
          <button key={tab} className={`rounded-t-xl px-4 py-2 text-xs font-semibold border border-b-0 transition ${i === 0 ? 'bg-white text-[#7a4cf5] border-purple-100' : 'bg-[#f5f0ff] text-[#9e97a8] border-transparent hover:text-[#7a4cf5]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="panel rounded-b-2xl rounded-tr-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-[#faf8ff]">
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#9e97a8] w-8">#</th>
              {COLS.map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#9e97a8]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-black/5 hover:bg-purple-50/30 transition">
                <td className="px-3 py-2.5 text-xs text-[#c4bcd0]">{i + 1}</td>
                {COLS.map(col => {
                  const field = FIELD_MAP[col]
                  const val = row[field]
                  return (
                    <td key={col} className="px-2 py-1.5">
                      {field === 'priority' ? (
                        <select
                          value={val}
                          onChange={e => updateCell(i, field, e.target.value)}
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold border-none focus:outline-none cursor-pointer ${PRIORITY_COLORS[val] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {Object.keys(PRIORITY_COLORS).map(p => <option key={p}>{p}</option>)}
                        </select>
                      ) : (
                        <input
                          value={val}
                          onChange={e => updateCell(i, field, e.target.value)}
                          placeholder={col}
                          className="w-full bg-transparent text-[#1a1626] placeholder:text-[#d4cfe0] focus:outline-none focus:bg-purple-50 rounded px-2 py-1 transition text-sm"
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-black/5">
          <button onClick={addRow} className="text-xs text-[#7a4cf5] font-semibold hover:underline">+ Add row</button>
        </div>
      </div>

      <p className="text-xs text-[#c4bcd0] text-center mt-4">
        Full spreadsheet (Univer) with formulas & imports coming soon · Your data stays private
      </p>
    </div>
  )
}
