import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CoachMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface CoachSession {
  id: string
  title: string
  messages: CoachMessage[]
  createdAt: number
}

interface CoachState {
  sessions: CoachSession[]
  currentSessionId: string | null
  addSession: () => string
  setCurrentSession: (id: string | null) => void
  appendMessage: (sessionId: string, message: CoachMessage) => void
  setSessionMessages: (sessionId: string, messages: CoachMessage[]) => void
  getSession: (id: string) => CoachSession | undefined
  getCurrentSession: () => CoachSession | undefined
  deleteSession: (id: string) => void
}

const createEmptySession = (): CoachSession => ({
  id: `s-${Date.now()}`,
  title: 'Новая сессия',
  messages: [],
  createdAt: Date.now(),
})

export const useCoachStore = create<CoachState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      addSession: () => {
        const session = createEmptySession()
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSessionId: session.id,
        }))
        return session.id
      },

      setCurrentSession: (id) => set({ currentSessionId: id }),

      appendMessage: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, message] } : s
          ),
        })),

      setSessionMessages: (sessionId, messages) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === sessionId ? { ...s, messages } : s)),
        })),

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
    { name: 'tma-coach-sessions' }
  )
)
