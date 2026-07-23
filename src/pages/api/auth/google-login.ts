import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return res.status(500).json({ error: 'Server misconfiguration' })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sapphire-mvp.vercel.app'
  const redirectTo = `${appUrl}/api/auth/callback`

  const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`
  return res.redirect(oauthUrl)
}
