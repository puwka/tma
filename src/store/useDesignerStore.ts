import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DesignerSession {
  id: string
  title: string
  prompt: string
  selectedStyleId: string
  genre: string
  mood: string
  lighting: string
  cameraAngle: string
  aspectRatio: '1:1' | '3:4' | '4:5' | '16:9' | '9:16'
  resolution: '1K' | '2K' | '4K'
  outputFormat: 'png' | 'jpg'
  negativePrompt: string
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
  genre: 'portrait',
  mood: 'calm',
  lighting: 'soft',
  cameraAngle: 'eye-level',
  aspectRatio: '4:5',
  resolution: '2K',
  outputFormat: 'png',
  negativePrompt: '',
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
          genre: data?.genre ?? base.genre,
          mood: data?.mood ?? base.mood,
          lighting: data?.lighting ?? base.lighting,
          cameraAngle: data?.cameraAngle ?? base.cameraAngle,
          aspectRatio: data?.aspectRatio ?? base.aspectRatio,
          resolution: data?.resolution ?? base.resolution,
          outputFormat: data?.outputFormat ?? base.outputFormat,
          negativePrompt: data?.negativePrompt ?? base.negativePrompt,
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
