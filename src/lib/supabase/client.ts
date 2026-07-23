import { createClient } from '@supabase/supabase-js'
import type { AppSession } from '@/lib/auth/session'

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function createUserSupabaseClient(session: AppSession) {
  return createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'), {
    global: {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

