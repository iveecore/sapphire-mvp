import type { NextApiRequest, NextApiResponse } from 'next'

const SESSION_COOKIE = 'ivee_session'

function encode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function decode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

export type AppSession = {
  accessToken: string
  refreshToken?: string
  userId: string
  email?: string
}

export function serializeSession(session: AppSession) {
  return encode(JSON.stringify(session))
}

export function readSessionCookie(req: NextApiRequest): AppSession | null {
  const raw = req.cookies?.[SESSION_COOKIE]
  if (!raw) return null

  try {
    return JSON.parse(decode(raw)) as AppSession
  } catch {
    return null
  }
}

export function setSessionCookie(res: NextApiResponse, session: AppSession) {
  const value = serializeSession(session)
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  )
}

export function clearSessionCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`)
}

