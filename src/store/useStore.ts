import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TabId = 'home' | 'shop' | 'profile'

const SLOVOED_FREE_PER_DAY = 3
const SLOVOED_NEURONS_PRICE = 5

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export interface UserState {
  balance: number
  userName: string
  userAvatar?: string
  subscriptionStatus: string
  generations: number
  earned: number
  activeTab: TabId
  /** Словоед: использовано бесплатных сегодня */
  slovoedFreeUsedToday: number
  slovoedLastDate: string
  setBalance: (balance: number) => void
  addBalance: (amount: number) => void
  setUser: (name: string, avatar?: string) => void
  setSubscriptionStatus: (status: string) => void
  setGenerations: (n: number) => void
  setEarned: (n: number) => void
  setActiveTab: (tab: TabId) => void
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
  /** Списывает один запуск Словоеда (бесплатный или 5 нейронов). Возвращает true если списание прошло. */
  useSlovoedCharge: () => boolean
  /** Сколько бесплатных попыток Словоеда осталось сегодня (0–3). */
  slovoedFreeRemaining: () => number
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      balance: 0,
      userName: 'Пользователь',
      userAvatar: undefined,
      subscriptionStatus: 'Бесплатный',
      generations: 0,
      earned: 0,
      activeTab: 'home',
      slovoedFreeUsedToday: 0,
      slovoedLastDate: '',

      setBalance: (balance) => set({ balance }),
      addBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance + amount) })),
      setUser: (userName, userAvatar) => set({ userName, userAvatar }),
      setSubscriptionStatus: (subscriptionStatus) => set({ subscriptionStatus }),
      setGenerations: (generations) => set({ generations }),
      setEarned: (earned) => set({ earned }),
      setActiveTab: (activeTab) => set({ activeTab }),

      setProfileFromDb: (profile) =>
        set({
          balance: profile.balance,
          userName: profile.user_name || 'Пользователь',
          userAvatar: profile.avatar_url ?? undefined,
          subscriptionStatus: profile.subscription_status ?? 'Бесплатный',
          generations: profile.generations ?? 0,
          earned: profile.earned ?? 0,
          slovoedFreeUsedToday: profile.slovoed_free_used_today ?? 0,
          slovoedLastDate: profile.slovoed_last_date ?? '',
        }),

      useSlovoedCharge: () => {
        const state = get()
        const today = todayKey()
        const used = state.slovoedLastDate === today ? state.slovoedFreeUsedToday : 0
        if (used < SLOVOED_FREE_PER_DAY) {
          set({
            slovoedFreeUsedToday: used + 1,
            slovoedLastDate: today,
          })
          return true
        }
        if (state.balance >= SLOVOED_NEURONS_PRICE) {
          set((s) => ({ balance: s.balance - SLOVOED_NEURONS_PRICE }))
          return true
        }
        return false
      },

      slovoedFreeRemaining: () => {
        const s = get()
        const today = todayKey()
        if (s.slovoedLastDate !== today) return SLOVOED_FREE_PER_DAY
        return Math.max(0, SLOVOED_FREE_PER_DAY - s.slovoedFreeUsedToday)
      },
    }),
    { name: 'tma-store' }
  )
)
