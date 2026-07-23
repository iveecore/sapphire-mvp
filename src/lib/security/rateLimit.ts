// In-memory rate limiter — resets on server restart (fine for serverless/Vercel edge)
// For production scale: swap store for Redis/Upstash

const store = new Map<string, { count: number; resetAt: number }>()

interface RateLimitOptions {
  windowMs: number  // time window in ms
  max: number       // max requests per window
}

export function rateLimit(key: string, opts: RateLimitOptions): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  entry.count++
  if (entry.count > opts.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  return { allowed: true, retryAfter: 0 }
}

export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}
