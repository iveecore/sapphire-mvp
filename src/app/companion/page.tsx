'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, ChevronLeft, Settings, Sparkles, Loader } from 'lucide-react'
import type { StreamEvent } from '@/lib/agent/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Session {
  id: string
  startedAt: string
  messageCount: number
}

export default function CompanionPage() {
  const [dna, setDna] = useState<any>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadDNA = async () => {
      try {
        const res = await fetch('/api/agent/dna')
        if (!res.ok) throw new Error('Failed to load agent DNA')
        const data = await res.json()
        setDna(data)
        setTokenBalance(data.tokenBalance)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent')
      }
    }

    const loadSessions = async () => {
      try {
        const res = await fetch('/api/agent/sessions')
        if (!res.ok) throw new Error('Failed to load sessions')
        const data = await res.json()
        setSessions(data.sessions)

        if (data.sessions.length > 0 && !currentSession) {
          const latestSession = data.sessions[0]
          setCurrentSession(latestSession.id)
          loadMessages(latestSession.id)
        }
      } catch (err) {
        console.error('Failed to load sessions:', err)
      }
    }

    loadDNA()
    loadSessions()
  }, [])

  const loadMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/agent/messages?sessionId=${sessionId}`)
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setMessages(data.messages)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setError('')
    setIsLoading(true)

    const tempMessageId = `temp-${Date.now()}`
    const userMsg: Message = {
      id: tempMessageId,
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])

    const assistantTempId = `temp-assistant-${Date.now()}`
    const assistantMsg: Message = {
      id: assistantTempId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, assistantMsg])

    try {
      let sessionId = currentSession
      if (!sessionId) {
        const newSessionRes = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage })
        })

        if (!newSessionRes.ok) {
          throw new Error('Failed to start session')
        }

        const reader = newSessionRes.body?.getReader()
        if (!reader) throw new Error('No response stream')

        const decoder = new TextDecoder()
        let fullResponse = ''
        let newSessionId = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                try {
                  const event = JSON.parse(data)

                  if (event.token !== undefined) {
                    fullResponse += event.token
                    setMessages(prev => {
                      const updated = [...prev]
                      const lastMsg = updated[updated.length - 1]
                      if (lastMsg && lastMsg.role === 'assistant') {
                        lastMsg.content = fullResponse
                      }
                      return updated
                    })
                  } else if (event.sessionId) {
                    newSessionId = event.sessionId
                    if (event.newBalance !== undefined) {
                      setTokenBalance(event.newBalance)
                    }
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

        if (newSessionId) {
          setCurrentSession(newSessionId)
          const updatedSessions = await fetch('/api/agent/sessions').then(r => r.json())
          setSessions(updatedSessions.sessions)
        }
      } else {
        const res = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, sessionId })
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to send message')
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response stream')

        const decoder = new TextDecoder()
        let fullResponse = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                try {
                  const event = JSON.parse(data)

                  if (event.token !== undefined) {
                    fullResponse += event.token
                    setMessages(prev => {
                      const updated = [...prev]
                      const lastMsg = updated[updated.length - 1]
                      if (lastMsg && lastMsg.role === 'assistant') {
                        lastMsg.content = fullResponse
                      }
                      return updated
                    })
                  } else if (event.newBalance !== undefined) {
                    setTokenBalance(event.newBalance)
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    setMessages([])
    setCurrentSession(null)
  }

  const handleSelectSession = (sessionId: string) => {
    setCurrentSession(sessionId)
    loadMessages(sessionId)
    setShowSidebar(false)
  }

  return (
    <div className="min-h-screen flex bg-[#fdf8ff]">
      <aside className={`fixed left-0 top-0 h-screen w-80 bg-white border-r border-black/5 flex flex-col transition-transform duration-300 z-40 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1f1f26]">Your Sessions</h2>
              <p className="text-xs text-[#6d6875] mt-1">{dna?.agentName || 'Sapphire'}</p>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 hover:bg-black/5 rounded-lg"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                currentSession === session.id
                  ? 'bg-[#7a4cf5]/10 border border-[#7a4cf5] text-[#1f1f26]'
                  : 'hover:bg-black/5 text-[#6d6875]'
              }`}
            >
              <p className="text-sm font-medium truncate">
                {session.messageCount > 0 ? `Chat • ${session.messageCount} messages` : 'New chat'}
              </p>
              <p className="text-xs text-[#6d6875] mt-1">
                {new Date(session.startedAt).toLocaleDateString()}
              </p>
            </button>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-8 text-[#6d6875]">
              <p className="text-sm">No sessions yet. Start chatting!</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-black/5 space-y-2">
          <button
            onClick={handleNewChat}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1f26] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2d2838] transition-all"
          >
            <Sparkles size={16} /> New chat
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-80 flex flex-col h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/5 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 hover:bg-black/5 rounded-lg"
              >
                <ChevronLeft size={18} className="rotate-180" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-[#1f1f26]">{dna?.agentName || 'Sapphire'}</h1>
                <p className="text-xs text-[#6d6875]">{dna?.personaName || 'Your AI Stylist'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-[#7a4cf5]/8 px-3 py-2 rounded-full">
                <Sparkles size={14} className="text-[#7a4cf5]" />
                <span className="text-xs font-semibold text-[#7a4cf5]">{tokenBalance} tokens</span>
              </div>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-black/5 rounded-lg transition-all"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#7a4cf5] to-[#f472b6] opacity-20 flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-[#7a4cf5]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1f1f26]">Hi, I'm {dna?.agentName || 'Sapphire'}!</h2>
                <p className="mt-3 text-base text-[#6d6875] max-w-md">
                  I'm here to help you put together outfits that make you feel amazing. Ask me anything about style, fit, or what to wear.
                </p>
              </div>

              <div className="max-w-2xl w-full space-y-3">
                {[
                  'What should I wear to a coffee date?',
                  'Help me style this blazer',
                  'What colors work best for me?'
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="w-full p-4 rounded-xl border border-black/10 hover:bg-black/5 text-left text-sm text-[#1f1f26] font-medium transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-4 animate-fadeUp ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#7a4cf5] to-[#f472b6]'
                    : 'bg-[#1f1f26]'
                }`}
              >
                {msg.role === 'user' ? 'You' : 'S'}
              </div>

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 sm:px-5 sm:py-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#7a4cf5] to-[#f472b6] text-white'
                    : 'bg-white border border-black/10 text-[#1f1f26]'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1f1f26] flex items-center justify-center">
                <Loader size={16} className="text-white animate-spin" />
              </div>
              <div className="bg-white border border-black/10 rounded-2xl px-5 py-4 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#6d6875] rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-[#6d6875] rounded-full animate-pulse animation-delay-100" />
                  <div className="w-2 h-2 bg-[#6d6875] rounded-full animate-pulse animation-delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {error && (
          <div className="px-4 sm:px-6 py-3 bg-red-50 border-t border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <footer className="border-t border-black/5 bg-white px-4 sm:px-6 py-4 sm:py-5">
          <div className="max-w-2xl mx-auto flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask me anything about style..."
              rows={1}
              className="flex-1 rounded-2xl border border-black/10 px-4 py-3 text-sm bg-white placeholder-[#6d6875] focus:outline-none focus:ring-2 focus:ring-[#7a4cf5] resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#7a4cf5] to-[#f472b6] text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-[#6d6875]">
            <p>Shift+Enter for new line</p>
            <p>{tokenBalance} tokens remaining</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
