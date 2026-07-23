'use client'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string; ts: number }

const STARTERS = [
  'What should I wear to a rooftop dinner?',
  'Help me build a capsule wardrobe',
  'I have a job interview tomorrow',
  'What\'s trending for women this season?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Zara, your personal AI stylist ✨ Tell me what you need — an outfit for tonight, help building your wardrobe, or just some style inspo.", ts: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text?: string) => {
    const content = text ?? input.trim()
    if (!content || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content, ts: Date.now() }
    setMessages(m => [...m, userMsg])
    setLoading(true)
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply ?? 'Sorry, I had trouble with that. Try again?', ts: Date.now() }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Please try again ✨', ts: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="shrink-0 px-5 sm:px-7 py-4 border-b border-black/5 bg-white/80 backdrop-blur flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7a4cf5] to-[#f43f7e] flex items-center justify-center text-lg">✨</div>
        <div>
          <div className="text-sm font-bold text-[#1a1626]">Zara · Your AI Stylist</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online · powered by Claude
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7a4cf5] to-[#f43f7e] flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">✨</div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                msg.role === 'user'
                  ? 'bg-[#7a4cf5] text-white rounded-br-sm'
                  : 'bg-white border border-black/5 text-[#1a1626] rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7a4cf5] to-[#f43f7e] flex items-center justify-center text-sm shrink-0 mr-2">✨</div>
            <div className="bg-white border border-black/5 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7a4cf5] opacity-60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starters */}
      {messages.length <= 1 && (
        <div className="px-4 sm:px-7 pb-3 flex flex-wrap gap-2">
          {STARTERS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full bg-[#f3edff] border border-purple-100 px-4 py-2 text-xs font-semibold text-[#7a4cf5] hover:bg-purple-100 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-4 sm:px-7 pb-5 pt-2">
        <form onSubmit={e => { e.preventDefault(); send() }} className="flex items-center gap-3 bg-white border border-black/8 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#7a4cf5]/20">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Zara anything about style..."
            className="flex-1 bg-transparent text-sm text-[#1a1626] placeholder:text-[#c0b8cc] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-[#7a4cf5] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#6b3ee8] transition"
          >
            ↑
          </button>
        </form>
        <p className="text-xs text-center text-[#c0b8cc] mt-2">Zara is your private AI — conversations are not shared.</p>
      </div>
    </div>
  )
}
