import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuizStartPage {
  imageUrl: string | null
  textTop: string
  title: string
  description: string
  buttonText: string
  textBottom: string
  layout: 'side' | 'center'
  alignment: 'top' | 'center'
}

export interface QuizQuestionOption {
  id: string
  text: string
  points?: number
}

export interface QuizQuestion {
  id: string
  questionText: string
  options: QuizQuestionOption[]
}

export interface QuizResultVariant {
  id: string
  minScore: number
  maxScore: number
  title: string
  description: string
}

export interface QuizThankYouPage {
  imageUrl: string | null
  videoUrl: string
  title: string
  description: string
  buttonText: string
  buttonUrl: string
}

export interface Quiz {
  id: string
  slug: string
  title: string
  startPage: QuizStartPage
  questions: QuizQuestion[]
  resultsEnabled: boolean
  resultVariants: QuizResultVariant[]
  contactsEnabled: boolean
  thankYouPage: QuizThankYouPage
  published: boolean
  createdAt: number
  updatedAt: number
  /** Для отображения в списке (без бэкенда — заглушки) */
  statsOpens: number
  statsLeads: number
}

const defaultStartPage = (): QuizStartPage => ({
  imageUrl: null,
  textTop: '',
  title: '',
  description: '',
  buttonText: 'Начать',
  textBottom: '',
  layout: 'side',
  alignment: 'top',
})

const defaultThankYouPage = (): QuizThankYouPage => ({
  imageUrl: null,
  videoUrl: '',
  title: 'Спасибо!',
  description: 'Ваши ответы приняты',
  buttonText: '',
  buttonUrl: '',
})

function generateId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function generateSlug() {
  return `quiz-${Date.now().toString(36).slice(-6)}`
}

interface QuizState {
  quizzes: Quiz[]
  addQuiz: () => string
  updateQuiz: (id: string, data: Partial<Quiz>) => void
  getQuiz: (id: string) => Quiz | undefined
  getQuizBySlug: (slug: string) => Quiz | undefined
  deleteQuiz: (id: string) => void
  setPublished: (id: string, published: boolean) => void
  addQuestion: (quizId: string) => string
  updateQuestion: (quizId: string, questionId: string, data: Partial<QuizQuestion>) => void
  deleteQuestion: (quizId: string, questionId: string) => void
  addOption: (quizId: string, questionId: string) => string
  updateOption: (quizId: string, questionId: string, optionId: string, data: Partial<QuizQuestionOption>) => void
  deleteOption: (quizId: string, questionId: string, optionId: string) => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizzes: [],

      addQuiz: () => {
        const id = generateId()
        const slug = generateSlug()
        const now = Date.now()
        const quiz: Quiz = {
          id,
          slug,
          title: 'Новый квиз',
          startPage: defaultStartPage(),
          questions: [],
          resultsEnabled: false,
          resultVariants: [],
          contactsEnabled: false,
          thankYouPage: defaultThankYouPage(),
          published: false,
          createdAt: now,
          updatedAt: now,
          statsOpens: 0,
          statsLeads: 0,
        }
        set((state) => ({ quizzes: [quiz, ...state.quizzes] }))
        return id
      },

      updateQuiz: (id, data) => {
        const now = Date.now()
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === id ? { ...q, ...data, updatedAt: now } : q
          ),
        }))
      },

      getQuiz: (id) => get().quizzes.find((q) => q.id === id),
      getQuizBySlug: (slug) => get().quizzes.find((q) => q.slug === slug),
      deleteQuiz: (id) =>
        set((state) => ({ quizzes: state.quizzes.filter((q) => q.id !== id) })),

      setPublished: (id, published) => {
        get().updateQuiz(id, { published })
      },

      addQuestion: (quizId) => {
        const questionId = generateId()
        const newQ: QuizQuestion = {
          id: questionId,
          questionText: '',
          options: [
            { id: generateId(), text: '' },
            { id: generateId(), text: '' },
          ],
        }
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? { ...q, questions: [...q.questions, newQ], updatedAt: Date.now() }
              : q
          ),
        }))
        return questionId
      },

      updateQuestion: (quizId, questionId, data) => {
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                  ...q,
                  questions: q.questions.map((qu) =>
                    qu.id === questionId ? { ...qu, ...data } : qu
                  ),
                  updatedAt: Date.now(),
                }
              : q
          ),
        }))
      },

      deleteQuestion: (quizId, questionId) => {
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                  ...q,
                  questions: q.questions.filter((qu) => qu.id !== questionId),
                  updatedAt: Date.now(),
                }
              : q
          ),
        }))
      },

      addOption: (quizId, questionId) => {
        const optionId = generateId()
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                  ...q,
                  questions: q.questions.map((qu) =>
                    qu.id === questionId
                      ? { ...qu, options: [...qu.options, { id: optionId, text: '' }] }
                      : qu
                  ),
                  updatedAt: Date.now(),
                }
              : q
          ),
        }))
        return optionId
      },

      updateOption: (quizId, questionId, optionId, data) => {
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                  ...q,
                  questions: q.questions.map((qu) =>
                    qu.id === questionId
                      ? {
                          ...qu,
                          options: qu.options.map((opt) =>
                            opt.id === optionId ? { ...opt, ...data } : opt
                          ),
                        }
                      : qu
                  ),
                  updatedAt: Date.now(),
                }
              : q
          ),
        }))
      },

      deleteOption: (quizId, questionId, optionId) => {
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                  ...q,
                  questions: q.questions.map((qu) =>
                    qu.id === questionId
                      ? { ...qu, options: qu.options.filter((o) => o.id !== optionId) }
                      : qu
                  ),
                  updatedAt: Date.now(),
                }
              : q
          ),
        }))
      },
    }),
    { name: 'tma-quizzes' }
  )
)
