'use client'
import { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      })
      const payload = await res.json()
      if (res.ok) {
        window.location.href = payload.next ?? '/quiz'
      } else {
        setError(payload.error ?? 'Signup failed. Please try again.')
      }
    } catch {
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1f1f26] mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="11" cy="11" r="3" fill="#7a4cf5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#1f1f26]">Create your account</h1>
          <p className="text-sm text-[#6d6875] mt-1">Your AI stylist awaits</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[1.75rem] shadow-[0_2px_24px_rgba(0,0,0,0.07)] border border-black/5 p-7">

          {/* Google OAuth */}
          <a
            href="/api/auth/google-login"
            className="flex items-center justify-center gap-3 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#1f1f26] hover:bg-[#faf9ff] transition"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/8" />
            <span className="text-xs text-[#9e97a8]">or</span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#6d6875] mb-1.5">Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#faf9ff] text-sm text-[#1f1f26] placeholder:text-[#b5afc0] focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/30 focus:border-[#7a4cf5]/40 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#6d6875] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#faf9ff] text-sm text-[#1f1f26] placeholder:text-[#b5afc0] focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/30 focus:border-[#7a4cf5]/40 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#6d6875] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#faf9ff] text-sm text-[#1f1f26] placeholder:text-[#b5afc0] focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/30 focus:border-[#7a4cf5]/40 transition"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d2838] disabled:opacity-50 transition mt-1"
            >
              {loading ? 'Creating account…' : 'Get started'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6d6875] mt-5">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-[#7a4cf5] hover:underline">Log in</a>
        </p>

        <p className="text-center text-xs text-[#9e97a8] mt-4 leading-5">
          By signing up, you agree that your style data stays private and is never sold.
        </p>
      </div>
    </div>
  )
}
