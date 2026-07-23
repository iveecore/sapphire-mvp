'use client'
import { useEffect, useRef } from 'react'

export default function StudioPage() {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.setAttribute('contenteditable', 'true')
    editorRef.current.focus()
  }, [])

  const handleSave = () => {
    const content = editorRef.current?.innerText ?? ''
    console.log('Saving note:', content)
  }

  return (
    <div className="blob-bg min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-serif text-4xl font-black text-[#1a1626]">
            Your Studio <span className="gradient-text">📝</span>
          </h1>
          <p className="text-[#6d6875] mt-1">Think. Plan. Vibe.</p>
        </div>
        <button
          onClick={handleSave}
          className="rounded-full bg-[#7a4cf5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3ee8] transition"
        >
          Save ✓
        </button>
      </div>

      {/* Note cards */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Style Notes', emoji: '✍️', hint: 'What I want to wear this season...' },
          { label: 'Mood Board', emoji: '🎨', hint: 'Vibes, aesthetics, inspo...' },
          { label: 'Wishlist', emoji: '🛍', hint: 'Things I\'m saving up for...' },
        ].map(card => (
          <div key={card.label} className="panel rounded-2xl p-5 card-hover cursor-pointer hover:border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{card.emoji}</span>
              <span className="font-semibold text-[#1a1626] text-sm">{card.label}</span>
            </div>
            <p className="text-xs text-[#9e97a8]">{card.hint}</p>
            <div className="mt-3 text-xs text-[#7a4cf5] font-semibold">+ New note</div>
          </div>
        ))}
      </div>

      {/* Main editor */}
      <div className="panel rounded-2xl overflow-hidden">
        <div className="border-b border-black/5 px-6 py-4 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-300" />
          </div>
          <span className="text-sm text-[#9e97a8] font-medium">Untitled note</span>
        </div>
        <div
          ref={editorRef}
          className="min-h-[400px] p-6 text-[#1a1626] text-sm leading-7 focus:outline-none"
          suppressContentEditableWarning
        >
          <p className="text-[#9e97a8] italic">Start typing your style thoughts here... Press / for commands</p>
        </div>
      </div>

      <p className="text-xs text-[#c4bcd0] text-center mt-4">
        Full block editor (BlockNote) coming in next update · Your notes save to your private vault
      </p>
    </div>
  )
}
