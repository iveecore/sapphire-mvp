import { createHmac, timingSafeEqual } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

const SESSION_COOKIE = 'ivee_session'
const VERSION = 'v1'

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function b64urlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function b64urlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function encodeSessionValue(session: AppSession, secret: string) {
  const payload = b64urlEncode(JSON.stringify(session))
  const signature = sign(`${VERSION}.${payload}`, secret)
  return `${VERSION}.${payload}.${signature}`
}

function decodeSessionValue(rawValue: string, secret: string): AppSession | null {
  const parts = String(rawValue ?? '').split('.')
  const version = parts[0], payload = parts[1], signature = parts[2]
  if (version !== VERSION || !payload || !signature) return null

  const expectedSig = sign(`${version}.${payload}`, secret)
  const expectedBuf = Buffer.from(expectedSig, 'base64url')
  const actualBuf = Buffer.from(signature, 'base64url')

  if (expectedBuf.length !== actualBuf.length) return null
  if (!timingSafeEqual(expectedBuf, actualBuf)) return null

  try {
    return JSON.parse(b64urlDecode(payload)) as AppSession
  } catch {
    return null
  }
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
  return decodeSessionValue(raw, requireEnv('SESSION_SECRET'))
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
