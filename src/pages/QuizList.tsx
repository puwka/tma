import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MoreVertical,
  Plus,
  LayoutGrid,
  List,
  Search,
  Pencil,
  Users,
  BarChart3,
  MoreHorizontal,
} from 'lucide-react'
import { useQuizStore } from '../store/useQuizStore'
import { useStore } from '../store/useStore'
import { Toast } from '../components/Toast'

const APP_NAME = 'AI Tools'

export function QuizList() {
  const navigate = useNavigate()
  const { quizzes, addQuiz, deleteQuiz } = useQuizStore()
  const { useToolCharge, getToolPrice, getToolFreeRemaining, planId, incrementGenerations } = useStore()
  const [filterAll] = useState(true)
  const [viewGrid, setViewGrid] = useState(true)
  const [search, setSearch] = useState('')
  const [menuQuizId, setMenuQuizId] = useState<string | null>(null)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const filtered = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleNewQuiz = () => {
    if (!useToolCharge('quizmaster')) {
      setToast({
        visible: true,
        message: `Недостаточно нейронов. Бесплатно: ${getToolFreeRemaining('quizmaster')} · далее ${getToolPrice('quizmaster')} ⚡`,
      })
      return
    }
    const id = addQuiz()
    incrementGenerations(1)
    navigate(`/quiz/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 pb-24">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="flex items-center h-12 px-4">
          <Link to="/" className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Назад</span>
          </Link>
          <div className="flex-1 flex flex-col items-center justify-center min-w-0">
            <span className="font-bold text-slate-900 text-[15px]">{APP_NAME}</span>
            <span className="text-[11px] text-slate-500">мини-приложение</span>
          </div>
          <button type="button" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Ещё">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className="px-4 py-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">НЕЙРОКВИЗ</h1>
            <p className="text-sm text-slate-500 mt-0.5">Создавайте квизы и собирайте заявки</p>
            <p className="text-xs text-amber-700 mt-1">
              План {planId.toUpperCase()} · Бесплатно сегодня: {getToolFreeRemaining('quizmaster')} · далее {getToolPrice('quizmaster')} ⚡
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewQuiz}
            className="shrink-0 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-600 active:scale-95"
            aria-label="Новый квиз"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filterAll ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Все ({quizzes.length})
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600"
          >
            + Папка
          </button>
          <div className="flex-1" />
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            <button
              type="button"
              onClick={() => setViewGrid(true)}
              className={`p-2 ${viewGrid ? 'bg-amber-50 text-amber-600' : 'bg-white text-slate-400'}`}
              aria-label="Сетка"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewGrid(false)}
              className={`p-2 ${!viewGrid ? 'bg-amber-50 text-amber-600' : 'bg-white text-slate-400'}`}
              aria-label="Список"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск квизов..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="font-medium">Нет квизов</p>
            <p className="text-sm mt-1">Нажмите + чтобы создать первый квиз</p>
            <button
              type="button"
              onClick={handleNewQuiz}
              className="mt-4 px-6 py-3 rounded-xl bg-amber-500 text-white font-medium"
            >
              Создать квиз
            </button>
          </div>
        ) : (
          <div className={viewGrid ? 'space-y-4' : 'space-y-3'}>
            {filtered.map((quiz) => (
              <motion.div
                key={quiz.id}
                layout
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-800 truncate">{quiz.title}</h2>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">/q/{quiz.slug}</p>
                    </div>
                    {quiz.published && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                        Опубл.
                      </span>
                    )}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuQuizId(menuQuizId === quiz.id ? null : quiz.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {menuQuizId === quiz.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            aria-hidden
                            onClick={() => setMenuQuizId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 py-1 rounded-xl bg-white border border-slate-200 shadow-lg z-20 min-w-[140px]">
                            <button
                              type="button"
                              onClick={() => {
                                deleteQuiz(quiz.id)
                                setMenuQuizId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                              Удалить
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{quiz.statsOpens} откр.</span>
                    <span>{quiz.statsLeads} заявок</span>
                    <span>{quiz.questions.length} вопр.</span>
                    <a
                      href={`/q/${quiz.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-medium"
                    >
                      Открыть
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-600 bg-amber-50 text-sm font-medium"
                    >
                      <Pencil size={14} /> Ред.
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100 text-sm font-medium"
                    >
                      <Users size={14} /> Заявки
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100 text-sm font-medium"
                    >
                      <BarChart3 size={14} /> Аналит.
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  )
}

export function getQuizShareUrl(quiz: { id: string; slug: string }): string {
  if (typeof window === 'undefined') return `/q/${quiz.slug}`
  return `${window.location.origin}/q/${quiz.slug}`
}
