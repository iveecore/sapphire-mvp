'use client'
import { useState } from 'react'

const SECTIONS = ['Profile', 'Style', 'Privacy', 'Subscription', 'Companion'] as const
type Section = typeof SECTIONS[number]

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('Profile')
  const [companionName, setCompanionName] = useState('Zara')
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="p-5 sm:p-7 max-w-4xl mx-auto space-y-5">
      <div>
        <div className="micro-label mb-1">Settings</div>
        <h1 className="display-serif text-3xl font-black text-[#1a1626]">Your <span className="gradient-text">preferences.</span></h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              section === s ? 'bg-[#7a4cf5] text-white' : 'bg-white border border-black/10 text-[#6d6875] hover:border-[#7a4cf5]/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="panel rounded-[2rem] p-6 space-y-5">
        {section === 'Profile' && (
          <>
            <h2 className="text-base font-bold text-[#1a1626]">Profile settings</h2>
            {[
              { label: 'Full name', placeholder: 'Your name', type: 'text' },
              { label: 'Email', placeholder: 'you@example.com', type: 'email' },
              { label: 'Username', placeholder: '@yourstyle', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label className="micro-label mb-1.5 block">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} className="w-full rounded-xl border border-black/10 bg-[#faf9ff] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/20" />
              </div>
            ))}
          </>
        )}

        {section === 'Style' && (
          <>
            <h2 className="text-base font-bold text-[#1a1626]">Style preferences</h2>
            <p className="text-sm text-[#9e97a8]">Retake the quiz to update your style profile and get fresh AI recommendations.</p>
            <a href="/quiz" className="inline-flex items-center gap-2 rounded-full bg-[#7a4cf5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3ee8] transition">
              Retake style quiz ✨
            </a>
          </>
        )}

        {section === 'Privacy' && (
          <>
            <h2 className="text-base font-bold text-[#1a1626]">Privacy controls</h2>
            {[
              { label: 'Allow personalization', desc: 'Let AI learn from your activity to improve recommendations' },
              { label: 'Community visibility', desc: 'Show your style profile in the community feed' },
              { label: 'Marketing emails', desc: 'Receive style tips and feature announcements' },
            ].map(p => (
              <div key={p.label} className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[#1a1626]">{p.label}</div>
                  <div className="text-xs text-[#9e97a8] mt-0.5">{p.desc}</div>
                </div>
                <button className="w-11 h-6 rounded-full bg-[#7a4cf5] flex items-center px-1 transition shrink-0">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto shadow" />
                </button>
              </div>
            ))}
          </>
        )}

        {section === 'Subscription' && (
          <>
            <h2 className="text-base font-bold text-[#1a1626]">Your plan</h2>
            <div className="rounded-2xl bg-gradient-to-br from-[#f3edff] to-[#fce4f0] p-5">
              <div className="text-lg font-black text-[#7a4cf5] mb-1">Starter · Free</div>
              <div className="text-sm text-[#6d6875]">100 AI tokens/month · Basic styling · 1 wardrobe</div>
            </div>
            <a href="/pricing" className="inline-flex items-center gap-2 rounded-full bg-[#1a1626] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d2838] transition">
              Upgrade to Icon or Muse ✨
            </a>
          </>
        )}

        {section === 'Companion' && (
          <>
            <h2 className="text-base font-bold text-[#1a1626]">Your AI companion</h2>
            <div>
              <label className="micro-label mb-1.5 block">Companion name</label>
              <input
                value={companionName}
                onChange={e => setCompanionName(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-[#faf9ff] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a4cf5]/20"
              />
              <p className="text-xs text-[#9e97a8] mt-1.5">This is what your AI stylist will be called in chat.</p>
            </div>
            <div>
              <div className="micro-label mb-2">Personality</div>
              {['Warm & encouraging', 'Direct & efficient', 'Playful & Gen Z', 'Professional & polished'].map(p => (
                <label key={p} className="flex items-center gap-3 py-2 cursor-pointer group">
                  <input type="radio" name="personality" className="accent-[#7a4cf5]" defaultChecked={p === 'Warm & encouraging'} />
                  <span className="text-sm text-[#1a1626] group-hover:text-[#7a4cf5] transition">{p}</span>
                </label>
              ))}
            </div>
          </>
        )}

        <button
          onClick={save}
          className="rounded-full bg-[#7a4cf5] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#6b3ee8] transition"
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
