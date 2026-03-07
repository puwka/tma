import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ArrowLeft,
  LayoutGrid,
  Youtube,
  FileText,
  Lock,
  Mic,
  MicOff,
  ChevronRight,
  ImagePlus,
  Sparkles,
  Check,
  Info,
  Zap,
  MessageSquare,
  Target,
  BookOpen,
  List,
  Plus,
  X,
  Trash2,
} from 'lucide-react'
import { generateImageNanoBananaPro } from '../services/api/kieApi'
import { useStore } from '../store/useStore'
import { useDesignerStore } from '../store/useDesignerStore'
import { DESIGN_STYLES, type DesignStyle } from '../data/designerStyles'

const DESIGN_TOOLS = [
  {
    id: 'carousel',
    title: 'Карусель',
    description: 'Посты и слайды для соцсетей',
    detail: 'Instagram, Telegram, VK — до 10 слайдов в одном посте',
    icon: LayoutGrid,
    available: true,
  },
  {
    id: 'youtube',
    title: 'YouTube',
    description: 'Обложки и превью',
    detail: 'Яркие превью для видео и сторис',
    icon: Youtube,
    available: false,
  },
  {
    id: 'pdf',
    title: 'PDF',
    description: 'Лид-магниты и гайды',
    detail: 'Обложки и иллюстрации для документов',
    icon: FileText,
    available: false,
  },
] as const

const SCENARIOS = [
  { id: 'sales', label: 'Продажи', desc: 'Воронки, офферы, лид-магниты', icon: Target },
  { id: 'content', label: 'Вовлечение', desc: 'Лайфхаки, подборки, инфографика', icon: MessageSquare },
  { id: 'education', label: 'Обучение', desc: 'Объяснения, чек-листы, шаги', icon: BookOpen },
] as const

function StylePreviewCard({
  style,
  selected,
  onSelect,
}: {
  style: DesignStyle
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`shrink-0 w-24 text-left rounded-2xl overflow-hidden border-2 transition-all active:scale-[0.98] shadow-sm ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow'
      }`}
    >
      <div className={`aspect-square relative ${style.previewClass}`}>
        {style.previewInner === 'dots' && (
          <div className="absolute inset-0 flex items-center justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/80" style={{ marginLeft: i % 2 === 0 ? 2 : 0 }} />
            ))}
          </div>
        )}
        {style.previewInner === 'lines' && (
          <div className="absolute inset-0 flex flex-col justify-center gap-1 px-2">
            <div className="h-0.5 w-full bg-black/20 rounded" />
            <div className="h-0.5 w-3/4 bg-black/20 rounded self-center" />
            <div className="h-0.5 w-1/2 bg-black/20 rounded self-center" />
          </div>
        )}
        {style.previewInner === 'circle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300" />
          </div>
        )}
        {style.previewInner === 'grid' && (
          <div className="absolute inset-0 grid grid-cols-3 gap-0.5 p-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white/30 rounded-sm" />
            ))}
          </div>
        )}
        {style.previewInner === 'wave' && (
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/20 rounded-t-full" />
        )}
        {selected && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      <p className="px-2 py-2 text-[11px] font-medium text-slate-700 truncate bg-white/95">{style.name}</p>
    </button>
  )
}

function useVoiceInput(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognition | null>(null)
  const start = useCallback(() => {
    const SR = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'ru-RU'
    rec.continuous = false
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(' ')
      if (text) onResult(text)
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }, [onResult])
  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])
  return { listening, start, stop }
}

export function Designer() {
  const { userAvatar, userName } = useStore()
  const {
    sessions,
    currentSessionId,
    addSession,
    setCurrentSession,
    getSession,
    updateSession,
    deleteSession,
    getCurrentSession,
  } = useDesignerStore()
  const [view, setView] = useState<'list' | 'carousel'>('list')
  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [selectedStyleId, setSelectedStyleId] = useState<string>(DESIGN_STYLES[0].id)
  const [scenario, setScenario] = useState<string>(SCENARIOS[0].id)
  const [ctaType, setCtaType] = useState<'keyword' | 'auto'>('keyword')
  const [keyword, setKeyword] = useState('ХОЧУ')
  const [ctaContent, setCtaContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // При входе в карусель — гарантируем текущую сессию и подгружаем её данные
  useEffect(() => {
    if (view !== 'carousel') return
    const cur = getCurrentSession()
    if (cur) {
      setPrompt(cur.prompt)
      setSelectedStyleId(cur.selectedStyleId)
      setScenario(cur.scenario)
      setCtaType(cur.ctaType)
      setKeyword(cur.keyword)
      setCtaContent(cur.ctaContent)
      setResultUrl(cur.resultUrl)
      setStep(1)
    } else if (sessions.length === 0) {
      addSession()
    } else {
      setCurrentSession(sessions[0].id)
    }
  }, [view, currentSessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Синхронизация формы в текущую сессию (без resultUrl — он ставится после генерации)
  useEffect(() => {
    if (view !== 'carousel' || !currentSessionId) return
    updateSession(currentSessionId, {
      prompt,
      selectedStyleId,
      scenario,
      ctaType,
      keyword,
      ctaContent,
    })
  }, [prompt, selectedStyleId, scenario, ctaType, keyword, ctaContent, view, currentSessionId, updateSession])

  const onVoiceResult = useCallback((text: string) => setPrompt((p) => (p ? `${p} ${text}` : text)), [])
  const { listening, start: startVoice, stop: stopVoice } = useVoiceInput(onVoiceResult)
  const selectedStyle = DESIGN_STYLES.find((s) => s.id === selectedStyleId)

  const handleGenerate = async () => {
    setError(null)
    setGenerating(true)
    const styleHint = selectedStyle?.promptHint ?? ''
    const fullPrompt = [
      prompt,
      `Стиль: ${styleHint}.`,
      `Сценарий: ${SCENARIOS.find((s) => s.id === scenario)?.label ?? scenario}.`,
      ctaType === 'keyword' && keyword ? `Призыв: кодовое слово "${keyword}". ${ctaContent}` : ctaType === 'auto' ? `Призыв: подпишись/сохрани. ${ctaContent}` : '',
    ].filter(Boolean).join(' ')
    try {
      const result = await generateImageNanoBananaPro({
        prompt: fullPrompt.slice(0, 10000),
        aspect_ratio: '4:5',
        resolution: '2K',
        output_format: 'png',
      })
      if (result.state === 'success' && result.imageUrl) {
        setResultUrl(result.imageUrl)
        if (currentSessionId) {
          updateSession(currentSessionId, {
            resultUrl: result.imageUrl,
            title: (prompt || 'Карусель').trim().slice(0, 40) || 'Без названия',
          })
        }
      } else setError(result.failMsg || 'Генерация не удалась')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сети')
    } finally {
      setGenerating(false)
    }
  }

  if (resultUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 bg-white/80 backdrop-blur border-b border-slate-100">
          <button type="button" onClick={() => setResultUrl(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={20} /> Назад
          </button>
          <span className="flex-1 text-center font-semibold text-slate-800">Готово</span>
          <div className="w-14" />
        </header>
        <div className="p-4 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-100">
            <img src={resultUrl} alt="Сгенерировано" className="w-full aspect-[4/5] object-cover" />
          </div>
          <p className="text-center text-xs text-slate-500">Формат 4:5, 2K · Долгое нажатие — сохранить</p>
        </div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 bg-white/80 backdrop-blur border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-slate-800">Студия</span>
          </div>
          <Link
            to="/profile"
            className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm border border-slate-200"
          >
            {userAvatar ? <img src={userAvatar} alt="" className="w-full h-full object-cover" /> : userName.slice(0, 1).toUpperCase()}
          </Link>
        </header>
        <div className="p-5">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="text-emerald-500" size={22} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Визуал с AI</h2>
                <p className="text-sm text-slate-600 mt-0.5">Картинки и карусели по текстовому описанию. Выберите инструмент, опишите идею и стиль — нейросеть создаст изображение за минуты.</p>
              </div>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Инструменты</p>
          <div className="space-y-3">
            {DESIGN_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.id}
                  className={`rounded-2xl p-4 flex items-center gap-4 border transition-all ${
                    tool.available
                      ? 'bg-white border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-emerald-200 active:scale-[0.99]'
                      : 'bg-slate-50/80 border-slate-100 opacity-75'
                  }`}
                  onClick={() => tool.available && setView('carousel')}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Icon className="text-emerald-600" size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{tool.title}</h3>
                    <p className="text-sm text-slate-600">{tool.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{tool.detail}</p>
                  </div>
                  {tool.available ? (
                    <ChevronRight className="text-emerald-500 shrink-0" size={22} />
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-xs font-medium shrink-0">
                      <Lock size={10} /> Скоро
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 text-center mt-6">Модель: Nano Banana Pro · Высокое качество 2K</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 pb-28">
      <header className="sticky top-0 z-10 flex items-center h-14 px-4 bg-white/80 backdrop-blur border-b border-slate-100">
        <button
          type="button"
          onClick={() => (step === 1 ? setView('list') : setStep(1))}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-center items-center gap-2">
          <span className={`text-sm font-semibold ${step === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>1</span>
          <span className="w-8 h-0.5 bg-slate-200 rounded" />
          <span className={`text-sm font-semibold ${step === 2 ? 'text-emerald-500' : 'text-slate-400'}`}>2</span>
        </div>
        <button
          type="button"
          onClick={() => setSessionsOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Сессии"
        >
          <List size={22} />
        </button>
      </header>

      <AnimatePresence>
        {sessionsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-20"
              aria-hidden
              onClick={() => setSessionsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-30 flex flex-col"
          >
            <div className="flex items-center justify-between h-14 px-4 border-b border-slate-100">
              <span className="font-semibold text-slate-800">Сессии</span>
              <button
                type="button"
                onClick={() => setSessionsOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <button
                type="button"
                onClick={() => {
                  addSession()
                  setResultUrl(null)
                  setSessionsOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600"
              >
                <Plus size={18} /> Новая сессия
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
              {sessions.map((s) => {
                const title = (s.title && s.title !== 'Новая сессия' ? s.title : s.prompt?.trim().slice(0, 30) || 'Без названия')
                return (
                  <li key={s.id} className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentSession(s.id)
                        const cur = getSession(s.id)
                        if (cur) {
                          setPrompt(cur.prompt)
                          setSelectedStyleId(cur.selectedStyleId)
                          setScenario(cur.scenario)
                          setCtaType(cur.ctaType)
                          setKeyword(cur.keyword)
                          setCtaContent(cur.ctaContent)
                          setResultUrl(cur.resultUrl)
                          setStep(1)
                        }
                        setSessionsOpen(false)
                      }}
                      className="flex-1 text-left py-3 px-3 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 text-slate-800"
                    >
                      <span className="block truncate text-sm font-medium">{title}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">
                        {s.resultUrl ? 'Есть результат' : 'Черновик'} · {new Date(s.updatedAt).toLocaleDateString('ru')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSession(s.id)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="px-4 py-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex gap-3">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-slate-700">Чем детальнее опишете тему и идею — тем точнее получится результат. Можно голосом.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">О чём карусель?</label>
                <p className="text-xs text-slate-500 mb-2">Тема, ключевые пункты или один слоган</p>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.slice(0, 5000))}
                    placeholder="Например: 5 способов повысить конверсию, 10 ошибок новичков в продажах..."
                    rows={4}
                    className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={listening ? stopVoice : startVoice}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-xl ${listening ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
                    aria-label="Голос"
                  >
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{prompt.length} / 5000 символов</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">Визуальный стиль</p>
                <p className="text-xs text-slate-500 mb-3">Влияет на цвета, типографику и настроение картинки</p>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1">
                  {DESIGN_STYLES.map((s) => (
                    <StylePreviewCard
                      key={s.id}
                      style={s}
                      selected={selectedStyleId === s.id}
                      onSelect={() => setSelectedStyleId(s.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <ImagePlus className="text-slate-400" size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">Своё фото</p>
                    <p className="text-xs text-slate-500">Опционально, в разработке</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white border border-emerald-100 p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Sparkles className="text-emerald-500" size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">Стиль</p>
                    <p className="text-xs text-emerald-600 truncate font-medium">{selectedStyle?.name ?? ''}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">Сценарий использования</p>
                <p className="text-xs text-slate-500 mb-3">Подскажет нейросети, для какой цели контент</p>
                <div className="flex flex-col gap-2">
                  {SCENARIOS.map((s) => {
                    const Icon = s.icon
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setScenario(s.id)}
                        className={`shrink-0 rounded-xl px-4 py-3 text-left flex items-center gap-3 border-2 transition-all ${
                          scenario === s.id ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={scenario === s.id ? 'text-emerald-600' : 'text-slate-400'} size={20} />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{s.label}</p>
                          <p className="text-xs text-slate-500">{s.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                Дальше: призыв к действию <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex gap-3">
                <Target className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-slate-700">Призыв к действию — что человек должен сделать на последнем слайде. Кодовое слово ведёт в лид/продажу, авто-охват — в подписку или сохранение.</p>
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 text-lg">Тип призыва</h2>
                <p className="text-xs text-slate-500 mt-0.5">Выберите один вариант</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setCtaType('keyword')}
                    className={`rounded-2xl p-4 text-left border-2 transition-all shadow-sm ${
                      ctaType === 'keyword' ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-800">Кодовое слово</p>
                    <p className="text-xs text-slate-500 mt-1">Клиент пишет слово в директ → получает оффер</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCtaType('auto')}
                    className={`rounded-2xl p-4 text-left border-2 transition-all shadow-sm ${
                      ctaType === 'auto' ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-800">Авто-охват</p>
                    <p className="text-xs text-slate-500 mt-1">Подпишись или Сохрани пост</p>
                  </button>
                </div>
              </div>

              {ctaType === 'keyword' && (
                <div className="space-y-4 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1">Кодовое слово *</label>
                    <p className="text-xs text-slate-500 mb-2">Одно слово, которое пользователь отправит вам в сообщения</p>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="ХОЧУ"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 font-medium uppercase"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Примеры: СТАРТ, ХОЧУ, VIP, PDF</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1">Что отправите в ответ? *</label>
                    <p className="text-xs text-slate-500 mb-2">Опишите бонус: файл, ссылку, консультацию</p>
                    <textarea
                      value={ctaContent}
                      onChange={(e) => setCtaContent(e.target.value)}
                      placeholder="PDF с 5 шаблонами воронок, чек-лист по запуску..."
                      rows={3}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100 flex items-center gap-2">
                  <Info size={18} /> {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold shadow-md"
              >
                {generating ? 'Генерация...' : 'Сгенерировать карусель'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-2">
                ← Назад к настройкам
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
