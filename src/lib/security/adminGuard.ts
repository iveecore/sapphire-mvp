import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'

// Only this email can access admin endpoints
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'vee0iveecore@gmail.com'

export function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const session = readSessionCookie(req)
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' })
    return false
  }
  if (session.email !== ADMIN_EMAIL) {
    res.status(403).json({ error: 'Forbidden' })
    return false
  }
  return true
}
