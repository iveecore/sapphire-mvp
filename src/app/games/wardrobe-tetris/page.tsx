'use client'
import { useState } from 'react'

const SLOTS = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Bags', 'Accessories', 'Keep']
const ITEMS = [
  { id: 1, emoji: '👗', name: 'Slip dress', category: 'Dresses' },
  { id: 2, emoji: '👕', name: 'White tee', category: 'Tops' },
  { id: 3, emoji: '🧥', name: 'Blazer', category: 'Outerwear' },
  { id: 4, emoji: '👖', name: 'Wide-leg jeans', category: 'Bottoms' },
  { id: 5, emoji: '👠', name: 'Heels', category: 'Shoes' },
  { id: 6, emoji: '👜', name: 'Mini bag', category: 'Bags' },
  { id: 7, emoji: '🧣', name: 'Silk scarf', category: 'Accessories' },
  { id: 8, emoji: '👟', name: 'Sneakers', category: 'Shoes' },
  { id: 9, emoji: '🩱', name: 'Bodysuit', category: 'Tops' },
  { id: 10, emoji: '🩳', name: 'Mini skirt', category: 'Bottoms' },
]

interface Item { id: number; emoji: string; name: string; category: string }
interface PlacedItem extends Item { slot: string; correct: boolean }

export default function WardrobeTetris() {
  const [remaining, setRemaining] = useState<Item[]>(ITEMS)
  const [placed, setPlaced] = useState<PlacedItem[]>([])
  const [dragging, setDragging] = useState<Item | null>(null)
  const [done, setDone] = useState(false)

  const onDrop = (slot: string) => {
    if (!dragging) return
    const correct = dragging.category === slot || slot === 'Keep'
    const placedItem: PlacedItem = { ...dragging, slot, correct }
    setPlaced(p => [...p, placedItem])
    setRemaining(r => r.filter(i => i.id !== dragging.id))
    setDragging(null)
    if (remaining.length === 1) setDone(true)
  }

  const correctCount = placed.filter(p => p.correct).length

  if (done) {
    return (
      <div className="blob-bg min-h-screen flex items-center justify-center px-4">
        <div className="panel rounded-[2rem] p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🧥</div>
          <h2 className="display-serif text-4xl font-black text-[#1a1626] mb-2">Closet sorted!</h2>
          <p className="text-[#6d6875] mb-2">{correctCount} of {ITEMS.length} items placed correctly.</p>
          <p className="text-sm text-[#9e97a8] mb-6">Your AI capsule wardrobe report is now unlocked.</p>
          <div className="rounded-2xl bg-violet-50 border border-violet-200 p-4 mb-6">
            <div className="text-sm font-bold text-[#7a4cf5]">✨ AI Capsule Report Unlocked</div>
            <div className="text-xs text-[#9e97a8] mt-1">Based on your organisation choices</div>
          </div>
          <a href="/companion" className="inline-flex rounded-full bg-[#7a4cf5] px-6 py-3 text-sm font-bold text-white hover:bg-[#6b3ee8] transition">
            Get my capsule report →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="blob-bg min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="micro-label mb-1">Wardrobe Tetris</div>
          <h1 className="display-serif text-4xl font-black text-[#1a1626] mb-2">Sort your closet</h1>
          <p className="text-sm text-[#9e97a8]">Drag each piece into the right category</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Items to sort */}
          <div className="panel rounded-[2rem] p-5">
            <div className="micro-label mb-4">Items to sort ({remaining.length} left)</div>
            <div className="space-y-2">
              {remaining.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDragging(item)}
                  onDragEnd={() => setDragging(null)}
                  className={`flex items-center gap-3 rounded-xl border border-black/8 bg-white p-3 cursor-grab active:cursor-grabbing transition hover:-translate-y-0.5 hover:shadow-md ${
                    dragging?.id === item.id ? 'opacity-50' : ''
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-[#1a1626]">{item.name}</span>
                  <span className="ml-auto text-xs text-[#9e97a8]">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drop slots */}
          <div className="space-y-2">
            {SLOTS.map(slot => (
              <div
                key={slot}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(slot)}
                className={`rounded-2xl border-2 border-dashed p-3 min-h-[52px] transition ${
                  dragging ? 'border-[#7a4cf5]/50 bg-purple-50/50' : 'border-black/10 bg-white/50'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#9e97a8] uppercase tracking-wider">{slot}</span>
                  {placed.filter(p => p.slot === slot).map(p => (
                    <span
                      key={p.id}
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.emoji} {p.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
