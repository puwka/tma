import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DesignerSession {
  id: string
  title: string
  prompt: string
  selectedStyleId: string
  scenario: string
  ctaType: 'keyword' | 'auto'
  keyword: string
  ctaContent: string
  resultUrl: string | null
  createdAt: number
  updatedAt: number
}

interface DesignerState {
  sessions: DesignerSession[]
  currentSessionId: string | null
  addSession: (data?: Partial<DesignerSession>) => string
  setCurrentSession: (id: string | null) => void
  updateSession: (id: string, data: Partial<DesignerSession>) => void
  getSession: (id: string) => DesignerSession | undefined
  getCurrentSession: () => DesignerSession | undefined
  deleteSession: (id: string) => void
}

const defaultSession = (): Omit<DesignerSession, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: 'Новая сессия',
  prompt: '',
  selectedStyleId: 'minimal',
  scenario: 'sales',
  ctaType: 'keyword',
  keyword: 'ХОЧУ',
  ctaContent: '',
  resultUrl: null,
})

export const useDesignerStore = create<DesignerState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      addSession: (data) => {
        const now = Date.now()
        const base = defaultSession()
        const session: DesignerSession = {
          ...base,
          ...data,
          id: `d-${now}`,
          title: data?.title ?? base.title,
          prompt: data?.prompt ?? base.prompt,
          selectedStyleId: data?.selectedStyleId ?? base.selectedStyleId,
          scenario: data?.scenario ?? base.scenario,
          ctaType: data?.ctaType ?? base.ctaType,
          keyword: data?.keyword ?? base.keyword,
          ctaContent: data?.ctaContent ?? base.ctaContent,
          resultUrl: data?.resultUrl ?? base.resultUrl,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSessionId: session.id,
        }))
        return session.id
      },

      setCurrentSession: (id) => set({ currentSessionId: id }),

      updateSession: (id, data) => {
        const now = Date.now()
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...data, updatedAt: now, title: data.title ?? s.title } : s
          ),
        }))
      },

      getSession: (id) => get().sessions.find((s) => s.id === id),
      getCurrentSession: () => {
        const { currentSessionId, sessions } = get()
        return currentSessionId ? sessions.find((s) => s.id === currentSessionId) : undefined
      },

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
        })),
    }),
    { name: 'tma-designer-sessions' }
  )
)
