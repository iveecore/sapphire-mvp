import type { NextApiRequest, NextApiResponse } from 'next'
import { encodeSessionValue, decodeSessionValue } from './session-crypto.mjs'

const SESSION_COOKIE = 'ivee_session'

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export type AppSession = {
  accessToken: string
  refreshToken?: string
  userId: string
  email?: string
}

export function serializeSession(session: AppSession) {
  return encodeSessionValue(session, requireEnv('SESSION_SECRET'))
}

export function readSessionCookie(req: NextApiRequest): AppSession | null {
  const raw = req.cookies?.[SESSION_COOKIE]
  if (!raw) return null

  return decodeSessionValue(raw, requireEnv('SESSION_SECRET')) as AppSession | null
}

export function setSessionCookie(res: NextApiResponse, session: AppSession) {
  const value = serializeSession(session)
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax${secure}; Max-Age=${60 * 60 * 24 * 7}`
  )
}

export function clearSessionCookie(res: NextApiResponse) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax${secure}; Max-Age=0`)
}
