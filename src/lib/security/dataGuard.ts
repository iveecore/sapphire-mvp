/**
 * DataGuard — security layer above Supabase
 *
 * Every read/write of user data passes through here.
 * Enforces: ownership, field stripping, audit logging, anomaly detection.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

// Tables that belong to a user — every query MUST include user_id filter
const USER_OWNED_TABLES = new Set([
  'users', 'identities', 'profiles', 'body_profiles',
  'privacy_settings', 'permissions', 'audit_events', 'memory_events',
  'contexts', 'objects', 'style_profiles', 'style_answers',
  'wardrobe_items', 'outfits', 'outfit_items', 'recommendations',
  'recommendation_runs', 'recommendation_items', 'feedback_events',
  'achievements', 'community_posts',
])

// Fields that must NEVER be returned to the client
const STRIPPED_FIELDS = new Set([
  'password', 'hashed_password', 'refresh_token', 'access_token',
  'service_key', 'secret', 'raw_app_meta_data', 'raw_user_meta_data',
])

// Strip sensitive fields from any object deeply
export function sanitizeOutput<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }
  for (const key of Object.keys(result)) {
    if (STRIPPED_FIELDS.has(key.toLowerCase())) {
      delete result[key]
    } else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = sanitizeOutput(result[key] as Record<string, unknown>)
    }
  }
  return result
}

export function sanitizeRows<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map(sanitizeOutput)
}

// Verified ownership read — throws if userId mismatch detected
export async function secureRead<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  table: string,
  userId: string,
  columns = '*'
): Promise<T[]> {
  if (!USER_OWNED_TABLES.has(table)) {
    throw new Error(`secureRead: table "${table}" is not in the allowed user-owned table list`)
  }
  if (!userId || userId.length < 10) {
    throw new Error('secureRead: invalid userId')
  }

  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('user_id', userId)

  if (error) throw new Error(`secureRead error on ${table}: ${error.message}`)

  // Verify every row belongs to this user — double-check beyond RLS
  const rows = (data ?? []) as T[]
  for (const row of rows) {
    if ('user_id' in row && row.user_id !== userId) {
      // Log the anomaly and block
      await logSecurityEvent(supabase, userId, 'ownership_violation', {
        table,
        expected_user: userId,
        found_user: row.user_id,
      })
      throw new Error('DataGuard: ownership violation detected — access blocked')
    }
  }

  return sanitizeRows(rows)
}

// Verified ownership write — injects userId, never trusts client-supplied user_id
export async function secureInsert<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  table: string,
  userId: string,
  payload: Omit<T, 'user_id' | 'id' | 'created_at' | 'updated_at'>
): Promise<T> {
  if (!USER_OWNED_TABLES.has(table)) {
    throw new Error(`secureInsert: table "${table}" is not allowed`)
  }

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from(table)
    .insert({ ...payload, user_id: userId, updated_at: now })
    .select('*')
    .single()

  if (error) throw new Error(`secureInsert error on ${table}: ${error.message}`)
  return sanitizeOutput(data as T)
}

// Log security events to audit_events table
export async function logSecurityEvent(
  supabase: SupabaseClient,
  userId: string,
  eventType: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await supabase.from('audit_events').insert({
    user_id: userId,
    event_type: `security.${eventType}`,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })
}

// Anomaly detection — flag suspicious read patterns
const readCounts = new Map<string, { count: number; window: number }>()
const READ_LIMIT_PER_MINUTE = 300

export function detectReadAnomaly(userId: string): boolean {
  const now = Date.now()
  const entry = readCounts.get(userId)

  if (!entry || now > entry.window) {
    readCounts.set(userId, { count: 1, window: now + 60_000 })
    return false
  }

  entry.count++
  return entry.count > READ_LIMIT_PER_MINUTE
}
