'use client'

import { useEffect, useState } from 'react'
import { Ruler, MoveVertical, Footprints, Save } from 'lucide-react'

type BodyProfileForm = {
  body_type: string
  height_cm: string
  bust_cm: string
  waist_cm: string
  hips_cm: string
  size_top: string
  size_bottom: string
  size_shoes: string
}

export default function ProfilePage() {
  const [form, setForm] = useState<BodyProfileForm>({
    body_type: '',
    height_cm: '',
    bust_cm: '',
    waist_cm: '',
    hips_cm: '',
    size_top: '',
    size_bottom: '',
    size_shoes: ''
  })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/profile/body')
      const payload = await res.json()
      if (res.ok && payload.bodyProfile) {
        setForm({
          body_type: payload.bodyProfile.body_type ?? '',
          height_cm: payload.bodyProfile.height_cm?.toString() ?? '',
          bust_cm: payload.bodyProfile.bust_cm?.toString() ?? '',
          waist_cm: payload.bodyProfile.waist_cm?.toString() ?? '',
          hips_cm: payload.bodyProfile.hips_cm?.toString() ?? '',
          size_top: payload.bodyProfile.size_top ?? '',
          size_bottom: payload.bodyProfile.size_bottom ?? '',
          size_shoes: payload.bodyProfile.size_shoes ?? ''
        })
      }
    }

    load()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      const res = await fetch('/api/profile/body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body_type: form.body_type || null,
          height_cm: form.height_cm ? Number(form.height_cm) : null,
          bust_cm: form.bust_cm ? Number(form.bust_cm) : null,
          waist_cm: form.waist_cm ? Number(form.waist_cm) : null,
          hips_cm: form.hips_cm ? Number(form.hips_cm) : null,
          size_top: form.size_top || null,
          size_bottom: form.size_bottom || null,
          size_shoes: form.size_shoes || null
        })
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error ?? 'Could not save profile.')
      setStatus('Fit profile saved.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save profile.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    ['body_type', 'Body type', Ruler],
    ['height_cm', 'Height (cm)', MoveVertical],
    ['bust_cm', 'Bust (cm)', MoveVertical],
    ['waist_cm', 'Waist (cm)', MoveVertical],
    ['hips_cm', 'Hips (cm)', MoveVertical],
    ['size_top', 'Top size', Save],
    ['size_bottom', 'Bottom size', Save],
    ['size_shoes', 'Shoe size', Footprints]
  ] as const

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="glass rounded-[2rem] p-6 sm:p-8">
          <div className="micro-label">Fit profile</div>
          <h1 className="display-title mt-4 text-4xl font-semibold text-[#1f1f26]">Teach Sapphire how clothes should feel on you.</h1>
          <p className="mt-4 text-base leading-8 text-[#6d6875]">
            This is where the app gets sharper than a generic stylist: body-fit, sizing, and comfort data become part of the recommendation loop.
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-[#1f1f26] p-5 text-white">
            <div className="text-sm font-semibold">Why this matters</div>
            <p className="mt-2 text-sm leading-7 text-white/72">
              Better fit data means fewer misses, better confidence, and recommendations that respect real bodies and real wardrobes.
            </p>
          </div>
        </aside>

        <section className="panel rounded-[2rem] p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label, Icon]) => (
              <label key={key} className="grid gap-2 rounded-[1.4rem] bg-[#fcfbfa] p-4 text-sm font-medium text-[#1f1f26]">
                <span className="flex items-center gap-2">
                  <Icon size={16} className="text-[#7a4cf5]" /> {label}
                </span>
                <input
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-[#7a4cf5]"
                />
              </label>
            ))}

            <div className="sm:col-span-2 flex items-center gap-4 pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-[#1f1f26] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2d2838] disabled:opacity-60">
                <Save size={16} /> {loading ? 'Saving...' : 'Save fit profile'}
              </button>
              {status && <span className="text-sm text-[#6d6875]">{status}</span>}
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
