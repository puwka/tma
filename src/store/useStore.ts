import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TabId = 'home' | 'shop' | 'profile'
export type EconomyToolId = 'slovoed' | 'designer' | 'coach' | 'quizmaster'
export type PlanId = 'free' | 'plus' | 'pro'

const BASE_TOOL_PRICES: Record<EconomyToolId, number> = {
  slovoed: 5,
  coach: 8,
  designer: 20,
  quizmaster: 12,
}

const PLAN_FREE_LIMITS: Record<PlanId, Record<EconomyToolId, number>> = {
  free: { slovoed: 3, coach: 4, designer: 1, quizmaster: 2 },
  plus: { slovoed: 8, coach: 10, designer: 4, quizmaster: 6 },
  pro: { slovoed: 20, coach: 30, designer: 15, quizmaster: 20 },
}

const PLAN_PRICE_MULTIPLIER: Record<PlanId, number> = {
  free: 1,
  plus: 0.75,
  pro: 0.5,
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function normalizePlanFromStatus(status?: string): PlanId {
  const s = (status || '').toLowerCase()
  if (s.includes('pro')) return 'pro'
  if (s.includes('plus') || s.includes('плюс')) return 'plus'
  return 'free'
}

function statusFromPlan(plan: PlanId): string {
  if (plan === 'pro') return 'PRO'
  if (plan === 'plus') return 'PLUS'
  return 'Бесплатный'
}

export interface UserState {
  balance: number
  userName: string
  userAvatar?: string
  subscriptionStatus: string
  planId: PlanId
  generations: number
  earned: number
  activeTab: TabId
  /** Legacy fields for slovoed only (kept for backward compatibility) */
  slovoedFreeUsedToday: number
  slovoedLastDate: string
  /** New economy usage ledger by day */
  dailyUsageDate: string
  dailyToolUsage: Record<EconomyToolId, number>
  setBalance: (balance: number) => void
  addBalance: (amount: number) => void
  setUser: (name: string, avatar?: string) => void
  setSubscriptionStatus: (status: string) => void
  setPlan: (planId: PlanId) => void
  setGenerations: (n: number) => void
  setEarned: (n: number) => void
  setActiveTab: (tab: TabId) => void
  incrementGenerations: (n?: number) => void
  /** Применить данные профиля из БД (без отправки обратно в Supabase). */
  setProfileFromDb: (profile: {
    balance: number
    user_name: string
    avatar_url?: string | null
    subscription_status?: string
    generations?: number
    earned?: number
    slovoed_free_used_today?: number
    slovoed_last_date?: string | null
  }) => void
  getToolPrice: (toolId: EconomyToolId) => number
  getToolDailyFreeLimit: (toolId: EconomyToolId) => number
  getToolUsedToday: (toolId: EconomyToolId) => number
  getToolFreeRemaining: (toolId: EconomyToolId) => number
  useToolCharge: (toolId: EconomyToolId) => boolean
  /** Legacy wrappers (used by existing UI) */
  useSlovoedCharge: () => boolean
  /** Legacy wrapper */
  slovoedFreeRemaining: () => number
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      balance: 0,
      userName: 'Пользователь',
      userAvatar: undefined,
      subscriptionStatus: 'Бесплатный',
      planId: 'free',
      generations: 0,
      earned: 0,
      activeTab: 'home',
      slovoedFreeUsedToday: 0,
      slovoedLastDate: '',
      dailyUsageDate: '',
      dailyToolUsage: {
        slovoed: 0,
        coach: 0,
        designer: 0,
        quizmaster: 0,
      },

      setBalance: (balance) => set({ balance }),
      addBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance + amount) })),
      setUser: (userName, userAvatar) => set({ userName, userAvatar }),
      setSubscriptionStatus: (subscriptionStatus) =>
        set({
          subscriptionStatus,
          planId: normalizePlanFromStatus(subscriptionStatus),
        }),
      setPlan: (planId) => set({ planId, subscriptionStatus: statusFromPlan(planId) }),
      setGenerations: (generations) => set({ generations }),
      incrementGenerations: (n = 1) => set((s) => ({ generations: Math.max(0, s.generations + n) })),
      setEarned: (earned) => set({ earned }),
      setActiveTab: (activeTab) => set({ activeTab }),

      setProfileFromDb: (profile) =>
        set({
          balance: profile.balance,
          userName: profile.user_name || 'Пользователь',
          userAvatar: profile.avatar_url ?? undefined,
          subscriptionStatus: profile.subscription_status ?? 'Бесплатный',
          planId: normalizePlanFromStatus(profile.subscription_status),
          generations: profile.generations ?? 0,
          earned: profile.earned ?? 0,
          slovoedFreeUsedToday: profile.slovoed_free_used_today ?? 0,
          slovoedLastDate: profile.slovoed_last_date ?? '',
        }),

      getToolPrice: (toolId) => {
        const { planId } = get()
        const base = BASE_TOOL_PRICES[toolId]
        return Math.max(1, Math.round(base * PLAN_PRICE_MULTIPLIER[planId]))
      },

      getToolDailyFreeLimit: (toolId) => {
        const { planId } = get()
        return PLAN_FREE_LIMITS[planId][toolId]
      },

      getToolUsedToday: (toolId) => {
        const s = get()
        const today = todayKey()
        if (s.dailyUsageDate !== today) return 0
        return s.dailyToolUsage[toolId] ?? 0
      },

      getToolFreeRemaining: (toolId) => {
        const s = get()
        const limit = PLAN_FREE_LIMITS[s.planId][toolId]
        const used = s.getToolUsedToday(toolId)
        return Math.max(0, limit - used)
      },

      useToolCharge: (toolId) => {
        const s = get()
        const today = todayKey()
        const sameDay = s.dailyUsageDate === today
        const usage = sameDay
          ? s.dailyToolUsage
          : { slovoed: 0, coach: 0, designer: 0, quizmaster: 0 }
        const used = usage[toolId] ?? 0
        const freeLimit = PLAN_FREE_LIMITS[s.planId][toolId]
        const toolPrice = Math.max(1, Math.round(BASE_TOOL_PRICES[toolId] * PLAN_PRICE_MULTIPLIER[s.planId]))

        if (used < freeLimit) {
          const nextUsage = { ...usage, [toolId]: used + 1 }
          set({
            dailyUsageDate: today,
            dailyToolUsage: nextUsage,
            slovoedFreeUsedToday: nextUsage.slovoed,
            slovoedLastDate: today,
          })
          return true
        }

        if (s.balance >= toolPrice) {
          set((prev) => ({ balance: prev.balance - toolPrice }))
          return true
        }
        return false
      },

      useSlovoedCharge: () => get().useToolCharge('slovoed'),
      slovoedFreeRemaining: () => get().getToolFreeRemaining('slovoed'),
    }),
    { name: 'tma-store' }
  )
)
