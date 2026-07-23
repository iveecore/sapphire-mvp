import { createSupabaseServiceClient } from '@/lib/supabase/server'

export interface DashboardWidget {
  id: string
  type: 'outfit-of-day' | 'wardrobe-stats' | 'ai-chat' | 'recent-fits' | 'token-balance' | 'weather-tip' | 'quick-launch' | 'activity-feed'
  title: string
  position: { col: number; row: number; colSpan: number; rowSpan: number }
  visible: boolean
  config?: Record<string, unknown>
}

export interface UserDashboardConfig {
  userId: string
  theme: 'light' | 'dark' | 'auto'
  accentColor: string
  companionName: string
  sidebarCollapsed: boolean
  businessModeEnabled: boolean
  widgets: DashboardWidget[]
  updatedAt: string
}

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'outfit-of-day', type: 'outfit-of-day', title: "Today's Fit", position: { col: 0, row: 0, colSpan: 2, rowSpan: 2 }, visible: true },
  { id: 'wardrobe-stats', type: 'wardrobe-stats', title: 'Your Closet', position: { col: 2, row: 0, colSpan: 1, rowSpan: 1 }, visible: true },
  { id: 'token-balance', type: 'token-balance', title: 'AI Tokens', position: { col: 3, row: 0, colSpan: 1, rowSpan: 1 }, visible: true },
  { id: 'weather-tip', type: 'weather-tip', title: 'Style Tip', position: { col: 2, row: 1, colSpan: 2, rowSpan: 1 }, visible: true },
  { id: 'activity-feed', type: 'activity-feed', title: 'Recent Activity', position: { col: 0, row: 2, colSpan: 2, rowSpan: 1 }, visible: true },
  { id: 'quick-launch', type: 'quick-launch', title: 'Quick Launch', position: { col: 2, row: 2, colSpan: 2, rowSpan: 1 }, visible: true },
]

export const DEFAULT_CONFIG: Omit<UserDashboardConfig, 'userId' | 'updatedAt'> = {
  theme: 'light',
  accentColor: '#7a4cf5',
  companionName: 'Zara',
  sidebarCollapsed: false,
  businessModeEnabled: false,
  widgets: DEFAULT_WIDGETS,
}

export async function loadDashboardConfig(userId: string): Promise<UserDashboardConfig> {
  const service = createSupabaseServiceClient()
  const { data } = await service
    .from('dashboard_configs')
    .select('config')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data?.config) {
    return { userId, ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() }
  }

  return { userId, ...DEFAULT_CONFIG, ...(data.config as Partial<UserDashboardConfig>), updatedAt: new Date().toISOString() }
}

export async function saveDashboardConfig(userId: string, config: Partial<UserDashboardConfig>): Promise<void> {
  const service = createSupabaseServiceClient()
  await service.from('dashboard_configs').upsert({
    user_id: userId,
    config,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
}
