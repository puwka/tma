import { useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  HelpCircle,
  Target,
  UserPlus,
  CheckSquare,
  Save,
  Smartphone,
  ImagePlus,
  Plus,
  Trash2,
  Copy,
  LayoutGrid,
  ArrowUpToLine,
  Minus,
  Info,
} from 'lucide-react'
import { useQuizStore } from '../store/useQuizStore'
import { getQuizShareUrl } from './QuizList'
import { Toast } from '../components/Toast'

const TABS = [
  { id: 'start', label: 'Старт', short: 'Старт', icon: FileText, desc: 'Обложка и приветствие' },
  { id: 'questions', label: 'Вопросы', short: 'Вопросы', icon: HelpCircle, desc: 'Вопросы и варианты' },
  { id: 'results', label: 'Результаты', short: 'Итоги', icon: Target, desc: 'Показ результата по ответам' },
  { id: 'contacts', label: 'Контакты', short: 'Контакты', icon: UserPlus, desc: 'Сбор заявок' },
  { id: 'thanks', label: 'Финал', short: 'Финал', icon: CheckSquare, desc: 'Экран «Спасибо»' },
] as const

type TabId = (typeof TABS)[number]['id']

function SectionCard({
  title,
  hint,
  children,
  className = '',
}: {
  title: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 text-[15px]">{title}</h3>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

export function QuizEditor() {
  const { id } = useParams<{ id: string }>()
  const quiz = id ? useQuizStore((s) => s.getQuiz(id)) : undefined
  const {
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
    setPublished,
  } = useQuizStore()

  const [tab, setTab] = useState<TabId>('start')
  const [toast, setToast] = useState({ message: '', visible: false })
  const showToast = useCallback((msg: string) => setToast({ message: msg, visible: true }), [])
  const hideToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), [])

  if (!id || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-slate-50">
        <p className="text-slate-600">Квиз не найден</p>
        <Link to="/quiz" className="text-amber-600 font-medium hover:underline">
          Вернуться к списку
        </Link>
      </div>
    )
  }

  const shareUrl = getQuizShareUrl(quiz)
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    showToast('Ссылка скопирована')
  }

  const currentTabInfo = TABS.find((t) => t.id === tab)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80 text-slate-800 pb-32">
      {/* Компактная шапка */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="flex items-center h-14 px-4 gap-3">
          <Link
            to="/quiz"
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft size={22} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-slate-900 truncate">
              {quiz.startPage.title || 'Новый квиз'}
            </h1>
            <p className="text-xs text-slate-500 truncate">
              {currentTabInfo?.desc ?? 'Редактор квиза'}
            </p>
          </div>
          <a
            href={`/q/${quiz.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="Предпросмотр"
          >
            <Smartphone size={20} />
          </a>
          <button
            type="button"
            onClick={() => showToast('Сохранено')}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold shadow-lg shadow-amber-500/25"
          >
            <Save size={18} /> Сохранить
          </button>
        </div>

        {/* Горизонтальные шаги — компактно и понятно */}
        <div className="px-4 pb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              const needsAttention = t.id === 'questions' && quiz.questions.length === 0
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : needsAttention
                        ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200/80'
                        : 'bg-slate-100/80 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.short}</span>
                  {needsAttention && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" title="Добавьте хотя бы один вопрос" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {tab === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SectionCard
                title="Обложка"
                hint="Первое, что увидит участник. Рекомендуем 800×600 px и больше, JPG или PNG."
              >
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] max-h-48 rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/80 cursor-pointer hover:border-amber-300 hover:from-amber-50/50 hover:to-slate-50 transition-colors">
                  <ImagePlus className="text-slate-400 mb-2" size={32} />
                  <span className="text-sm font-medium text-slate-600">Добавить изображение</span>
                  <span className="text-xs text-slate-400 mt-1">до 10 МБ</span>
                  <input type="file" accept="image/jpeg,image/png" className="sr-only" />
                </label>
              </SectionCard>

              <SectionCard
                title="Приветственный текст"
                hint="Заголовок и описание на первом экране. Можно оставить подпись сверху и снизу."
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Текст сверху (по желанию)</label>
                    <input
                      type="text"
                      value={quiz.startPage.textTop}
                      onChange={(e) => updateQuiz(id, { startPage: { ...quiz.startPage, textTop: e.target.value } })}
                      placeholder="Например: Пройдите тест за 2 минуты"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Заголовок квиза</label>
                    <input
                      type="text"
                      value={quiz.startPage.title}
                      onChange={(e) => {
                        const v = e.target.value
                        updateQuiz(id, { title: v || 'Новый квиз', startPage: { ...quiz.startPage, title: v } })
                      }}
                      placeholder="Какой у вас тип личности?"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Описание</label>
                    <input
                      type="text"
                      value={quiz.startPage.description}
                      onChange={(e) => updateQuiz(id, { startPage: { ...quiz.startPage, description: e.target.value } })}
                      placeholder="Кратко опишите, о чём квиз и что узнает участник"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Текст на кнопке старта</label>
                    <input
                      type="text"
                      value={quiz.startPage.buttonText}
                      onChange={(e) => updateQuiz(id, { startPage: { ...quiz.startPage, buttonText: e.target.value } })}
                      placeholder="Начать"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Текст снизу (по желанию)</label>
                    <input
                      type="text"
                      value={quiz.startPage.textBottom}
                      onChange={(e) => updateQuiz(id, { startPage: { ...quiz.startPage, textBottom: e.target.value } })}
                      placeholder="Без регистрации, 5 вопросов"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Оформление первого экрана"
                hint="Расположение блока с картинкой и текстом."
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Макет</p>
                    <div className="flex gap-2">
                      {(['side', 'center'] as const).map((layout) => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => updateQuiz(id, { startPage: { ...quiz.startPage, layout } })}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                            quiz.startPage.layout === layout
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <LayoutGrid size={18} />
                          {layout === 'side' ? 'Сбоку' : 'По центру'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Выравнивание блока</p>
                    <div className="flex gap-2">
                      {(['top', 'center'] as const).map((alignment) => (
                        <button
                          key={alignment}
                          type="button"
                          onClick={() => updateQuiz(id, { startPage: { ...quiz.startPage, alignment } })}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                            quiz.startPage.alignment === alignment
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {alignment === 'top' ? <ArrowUpToLine size={18} /> : <Minus size={18} />}
                          {alignment === 'top' ? 'По верху' : 'По центру'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {tab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {quiz.questions.length === 0 ? (
                <SectionCard
                  title="Вопросы квиза"
                  hint="Добавьте один или несколько вопросов. У каждого — минимум два варианта ответа."
                >
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="text-slate-400" size={32} />
                    </div>
                    <p className="font-medium text-slate-700">Пока нет вопросов</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-[260px] mx-auto">
                      Нажмите кнопку ниже, чтобы добавить первый вопрос. Укажите текст и варианты ответов.
                    </p>
                    <button
                      type="button"
                      onClick={() => addQuestion(id)}
                      className="mt-6 w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-800"
                    >
                      <Plus size={20} /> Добавить первый вопрос
                    </button>
                  </div>
                </SectionCard>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Вопросов: <span className="font-semibold text-slate-800">{quiz.questions.length}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => addQuestion(id)}
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <Plus size={16} /> Ещё вопрос
                    </button>
                  </div>
                  <div className="space-y-4">
                    {quiz.questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                      >
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 text-slate-600 text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-500">Вопрос</span>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(id, q.id)}
                            className="ml-auto p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                            title="Удалить вопрос"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="p-4 space-y-4">
                          <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) => updateQuestion(id, q.id, { questionText: e.target.value })}
                            placeholder="Текст вопроса"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-2">Варианты ответа</p>
                            <div className="space-y-2">
                              {q.options.map((opt) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                                    ○
                                  </span>
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => updateOption(id, q.id, opt.id, { text: e.target.value })}
                                    placeholder="Вариант ответа"
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => deleteOption(id, q.id, opt.id)}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500 disabled:opacity-40"
                                    disabled={q.options.length <= 2}
                                    title="Удалить вариант"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addOption(id, q.id)}
                                className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 py-2"
                              >
                                <Plus size={16} /> Добавить вариант
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {tab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SectionCard
                title="Показывать результаты по ответам"
                hint="Включите, если у вопросов есть баллы и вы хотите показывать разный итог в зависимости от суммы. Иначе после вопросов сразу откроется экран «Спасибо»."
              >
                <Toggle
                  checked={quiz.resultsEnabled}
                  onChange={(v) => updateQuiz(id, { resultsEnabled: v })}
                  label="Результаты по баллам"
                  description={
                    quiz.resultsEnabled
                      ? 'Участник увидит результат в зависимости от набранных очков'
                      : 'После вопросов сразу откроется финальный экран'
                  }
                />
                {quiz.resultsEnabled && (
                  <p className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    Настройка диапазонов баллов и текстов результатов будет в следующем обновлении.
                  </p>
                )}
              </SectionCard>
            </motion.div>
          )}

          {tab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SectionCard
                title="Сбор контактов"
                hint="После прохождения квиза можно попросить участника оставить имя и email — удобно для лид-магнитов и рассылок."
              >
                <Toggle
                  checked={quiz.contactsEnabled}
                  onChange={(v) => updateQuiz(id, { contactsEnabled: v })}
                  label="Запрашивать контакты"
                  description={
                    quiz.contactsEnabled
                      ? 'Участник увидит форму с полями имени и email'
                      : 'Форма контактов не показывается'
                  }
                />
              </SectionCard>
            </motion.div>
          )}

          {tab === 'thanks' && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SectionCard
                title="Финальный экран"
                hint="Что увидит участник после прохождения. Можно добавить картинку, видео и кнопку перехода."
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Изображение (по желанию)</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-colors">
                      <ImagePlus className="text-slate-400 mb-1" size={24} />
                      <span className="text-sm text-slate-500">Добавить фото</span>
                      <span className="text-xs text-slate-400">JPG, PNG до 10 МБ, от 800×600 px</span>
                      <input type="file" accept="image/jpeg,image/png" className="sr-only" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Видео (по желанию)</label>
                    <input
                      type="text"
                      value={quiz.thankYouPage.videoUrl}
                      onChange={(e) =>
                        updateQuiz(id, { thankYouPage: { ...quiz.thankYouPage, videoUrl: e.target.value } })
                      }
                      placeholder="Ссылка на YouTube, Vimeo, VK Видео"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Заголовок</label>
                    <input
                      type="text"
                      value={quiz.thankYouPage.title}
                      onChange={(e) =>
                        updateQuiz(id, { thankYouPage: { ...quiz.thankYouPage, title: e.target.value } })
                      }
                      placeholder="Спасибо!"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Описание</label>
                    <input
                      type="text"
                      value={quiz.thankYouPage.description}
                      onChange={(e) =>
                        updateQuiz(id, { thankYouPage: { ...quiz.thankYouPage, description: e.target.value } })
                      }
                      placeholder="Ваши ответы приняты"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Кнопка (по желанию)</label>
                    <input
                      type="text"
                      value={quiz.thankYouPage.buttonText}
                      onChange={(e) =>
                        updateQuiz(id, { thankYouPage: { ...quiz.thankYouPage, buttonText: e.target.value } })
                      }
                      placeholder="Перейти на сайт"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    />
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Блок публикации — всегда внизу контента */}
        <SectionCard
          title="Поделиться квизом"
          hint="Скопируйте ссылку и отправьте в мессенджер, соцсети или на сайт. Включите публикацию, чтобы квиз был доступен по ссылке."
          className="mt-8"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Ссылка на квиз</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-slate-500 text-sm shrink-0">/q/</span>
                <input
                  type="text"
                  value={quiz.slug}
                  onChange={(e) =>
                    updateQuiz(id, {
                      slug:
                        e.target.value
                          .replace(/[^a-z0-9-]/gi, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, '') || quiz.slug,
                    })
                  }
                  className="flex-1 min-w-0 text-sm font-mono text-slate-800 bg-transparent focus:outline-none focus:ring-0"
                  placeholder="moy-kviz"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                >
                  <Copy size={16} /> Копировать
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="font-medium text-slate-800">Опубликовать</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {quiz.published ? 'Квиз доступен по ссылке' : 'Включите, чтобы ссылка работала'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={quiz.published}
                onClick={() => setPublished(quiz.id, !quiz.published)}
                className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${
                  quiz.published ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    quiz.published ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </SectionCard>
      </main>

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  )
}
