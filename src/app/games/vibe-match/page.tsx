'use client'
import { useState, useEffect, useCallback } from 'react'

const VIBES = ['🌊 Coastal', '🖤 Dark', '☁️ Soft', '✨ Glam', '🌿 Boho', '💼 Siren']

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

interface Tile {
  id: number
  vibe: string
  matched: boolean
  flipped: boolean
}

function buildTiles(): Tile[] {
  const doubled = [...VIBES, ...VIBES]
  return shuffle(doubled).map((vibe, i) => ({ id: i, vibe, matched: false, flipped: false }))
}

export default function VibeMatchGame() {
  const [tiles, setTiles] = useState<Tile[]>(buildTiles)
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const handleFlip = useCallback((id: number) => {
    if (selected.length === 2) return
    const tile = tiles.find(t => t.id === id)
    if (!tile || tile.matched || tile.flipped) return

    const next = tiles.map(t => t.id === id ? { ...t, flipped: true } : t)
    const newSelected = [...selected, id]
    setTiles(next)
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newSelected.map(sid => next.find(t => t.id === sid)!)
      if (a.vibe === b.vibe) {
        const matched = next.map(t => newSelected.includes(t.id) ? { ...t, matched: true } : t)
        setTiles(matched)
        setSelected([])
        if (matched.every(t => t.matched)) setWon(true)
      } else {
        setTimeout(() => {
          setTiles(prev => prev.map(t => newSelected.includes(t.id) ? { ...t, flipped: false } : t))
          setSelected([])
        }, 900)
      }
    }
  }, [tiles, selected])

  if (won) {
    return (
      <div className="blob-bg min-h-screen flex items-center justify-center px-4">
        <div className="panel rounded-[2rem] p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="display-serif text-4xl font-black text-[#1a1626] mb-2">Vibe matched!</h2>
          <p className="text-[#6d6875] mb-6">Finished in {moves} moves.</p>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 mb-6">
            <div className="text-2xl font-black text-emerald-700">+3 tokens</div>
            <div className="text-sm text-emerald-600">added to your balance</div>
          </div>
          <button
            onClick={() => { setTiles(buildTiles()); setMoves(0); setWon(false); setSelected([]) }}
            className="rounded-full bg-[#7a4cf5] px-6 py-3 text-sm font-bold text-white hover:bg-[#6b3ee8] transition mr-3"
          >
            Play again
          </button>
          <a href="/games" className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-[#1a1626] hover:bg-purple-50 transition inline-flex">
            All games
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="blob-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="micro-label mb-1">Vibe Match</div>
          <div className="text-sm text-[#9e97a8]">{moves} moves</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {tiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleFlip(tile.id)}
              className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all duration-300 font-medium ${
                tile.matched
                  ? 'bg-emerald-100 border-2 border-emerald-300 cursor-default scale-95'
                  : tile.flipped
                  ? 'bg-gradient-to-br from-violet-100 to-rose-100 border-2 border-[#7a4cf5]/30'
                  : 'bg-white border-2 border-black/8 hover:border-[#7a4cf5]/30 hover:-translate-y-0.5'
              } shadow-sm`}
            >
              {(tile.flipped || tile.matched) ? tile.vibe.split(' ')[0] : '?'}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[#9e97a8] mt-6">Find all matching vibe pairs ✨</p>
      </div>
    </div>
  )
}
