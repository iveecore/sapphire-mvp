import type { TokenBalance } from './types'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

const STARTUP_TOKENS = 150
const MESSAGE_COST_ESTIMATION = 0.25

export async function initializeTokenBalance(userId: string): Promise<TokenBalance> {
  const supabase = createSupabaseServiceClient()

  const existing = await supabase
    .from('user_token_balance')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing.data) {
    return {
      userId: existing.data.user_id,
      balance: existing.data.balance,
      totalPurchased: existing.data.total_purchased,
      totalEarnedFree: existing.data.total_earned_free,
      totalConsumed: existing.data.total_consumed,
      updatedAt: existing.data.updated_at,
      createdAt: existing.data.created_at
    }
  }

  const now = new Date().toISOString()
  const newBalance: TokenBalance = {
    userId,
    balance: STARTUP_TOKENS,
    totalPurchased: 0,
    totalEarnedFree: STARTUP_TOKENS,
    totalConsumed: 0,
    updatedAt: now,
    createdAt: now
  }

  await supabase.from('user_token_balance').insert({
    user_id: userId,
    balance: newBalance.balance,
    total_purchased: newBalance.totalPurchased,
    total_earned_free: newBalance.totalEarnedFree,
    total_consumed: newBalance.totalConsumed,
    updated_at: now,
    created_at: now
  })

  await supabase.from('token_transactions').insert({
    id: crypto.randomUUID(),
    user_id: userId,
    amount: STARTUP_TOKENS,
    reason: 'signup_bonus',
    created_at: now
  })

  return newBalance
}

export async function getUserTokenBalance(userId: string): Promise<number> {
  const supabase = createSupabaseServiceClient()

  const result = await supabase
    .from('user_token_balance')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle()

  if (!result.data) {
    const initialized = await initializeTokenBalance(userId)
    return initialized.balance
  }

  return result.data.balance
}

export async function getFullTokenBalance(userId: string): Promise<TokenBalance> {
  const supabase = createSupabaseServiceClient()

  const result = await supabase
    .from('user_token_balance')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!result.data) {
    return initializeTokenBalance(userId)
  }

  return {
    userId: result.data.user_id,
    balance: result.data.balance,
    totalPurchased: result.data.total_purchased,
    totalEarnedFree: result.data.total_earned_free,
    totalConsumed: result.data.total_consumed,
    updatedAt: result.data.updated_at,
    createdAt: result.data.created_at
  }
}

export async function validateTokenAvailability(userId: string, estimatedCost: number): Promise<boolean> {
  const balance = await getUserTokenBalance(userId)
  return balance >= estimatedCost
}

export async function deductTokens(
  userId: string,
  amount: number,
  reason: 'message_consumption' | 'event_earned' = 'message_consumption',
  referenceId?: string
): Promise<void> {
  const supabase = createSupabaseServiceClient()

  const balance = await getUserTokenBalance(userId)
  if (balance < amount) {
    throw new Error('Insufficient token balance')
  }

  const now = new Date().toISOString()
  const newBalance = balance - amount

  await supabase
    .from('user_token_balance')
    .update({
      balance: newBalance,
      total_consumed: await getTotalConsumed(userId).then(t => t + amount),
      updated_at: now
    })
    .eq('user_id', userId)

  await supabase.from('token_transactions').insert({
    id: crypto.randomUUID(),
    user_id: userId,
    amount: -amount,
    reason,
    reference_id: referenceId,
    created_at: now
  })
}

export async function grantTokens(
  userId: string,
  amount: number,
  reason: 'purchase' | 'signup_bonus' | 'event_earned' = 'event_earned',
  referenceId?: string
): Promise<void> {
  const supabase = createSupabaseServiceClient()

  const balance = await getUserTokenBalance(userId)
  const now = new Date().toISOString()
  const newBalance = balance + amount

  const updates: Record<string, any> = {
    balance: newBalance,
    updated_at: now
  }

  if (reason === 'purchase') {
    const current = await getFullTokenBalance(userId)
    updates.total_purchased = current.totalPurchased + amount
  } else if (reason === 'signup_bonus' || reason === 'event_earned') {
    const current = await getFullTokenBalance(userId)
    updates.total_earned_free = current.totalEarnedFree + amount
  }

  await supabase
    .from('user_token_balance')
    .update(updates)
    .eq('user_id', userId)

  await supabase.from('token_transactions').insert({
    id: crypto.randomUUID(),
    user_id: userId,
    amount,
    reason,
    reference_id: referenceId,
    created_at: now
  })
}

export async function getTotalConsumed(userId: string): Promise<number> {
  const supabase = createSupabaseServiceClient()

  const result = await supabase
    .from('user_token_balance')
    .select('total_consumed')
    .eq('user_id', userId)
    .maybeSingle()

  return result.data?.total_consumed ?? 0
}

export function estimateTokenCost(userMessageLength: number, estimatedResponseLength: number = 200): number {
  return Math.ceil(estimatedResponseLength * MESSAGE_COST_ESTIMATION)
}
