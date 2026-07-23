import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const session = readSessionCookie(req)
  if (!session) return res.status(200).json({ authenticated: false })
  return res.status(200).json({ authenticated: true, userId: session.userId, email: session.email ?? null })
}

