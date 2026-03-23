import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ImageIcon,
  Info,
  List,
  Mic,
  MicOff,
  Plus,
  Sparkles,
  Trash2,
  X,
  WandSparkles,
} from 'lucide-react'
import { generateImageNanoBananaPro, type AspectRatio, type OutputFormat, type Resolution } from '../services/api/kieApi'
import { useStore } from '../store/useStore'
import { useDesignerStore } from '../store/useDesignerStore'
import { DESIGN_STYLES, type DesignStyle } from '../data/designerStyles'

const PHOTO_GENRES = [
  { id: 'portrait', label: 'Портрет', hint: 'профессиональный портрет, focus on face, realistic skin texture' },
  { id: 'fashion', label: 'Fashion', hint: 'high-fashion editorial, stylized styling, premium look' },
  { id: 'product', label: 'Предметка', hint: 'product photography, clean composition, commercial quality' },
  { id: 'cinematic', label: 'Cinematic', hint: 'cinematic still frame, dramatic storytelling, movie lighting' },
  { id: 'lifestyle', label: 'Lifestyle', hint: 'lifestyle photography, natural moment, candid vibe' },
  { id: 'concept', label: 'Концепт-арт', hint: 'concept art, imaginative scene, strong atmosphere' },
] as const

const MOODS = [
  { id: 'calm', label: 'Спокойно', hint: 'calm mood, soft emotional tone' },
  { id: 'bold', label: 'Смело', hint: 'bold and expressive energy' },
  { id: 'luxury', label: 'Премиум', hint: 'luxury aesthetic, refined details' },
  { id: 'dramatic', label: 'Драматично', hint: 'dramatic emotional contrast' },
] as const

const LIGHTING = [
  { id: 'soft', label: 'Мягкий свет', hint: 'soft diffused light' },
  { id: 'studio', label: 'Студийный', hint: 'clean studio lighting, high detail' },
  { id: 'neon', label: 'Неон', hint: 'neon lighting, glow and contrast' },
  { id: 'golden', label: 'Golden hour', hint: 'golden hour sunlight' },
] as const

const CAMERA_ANGLES = [
  { id: 'eye-level', label: 'На уровне глаз', hint: 'eye-level shot' },
  { id: 'low-angle', label: 'Нижний ракурс', hint: 'low angle shot' },
  { id: 'top-down', label: 'Сверху', hint: 'top-down shot' },
  { id: 'close-up', label: 'Крупный план', hint: 'close-up framing' },
] as const

const ASPECTS: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1 Квадрат' },
  { value: '3:4', label: '3:4 Портрет' },
  { value: '4:5', label: '4:5 Instagram' },
  { value: '16:9', label: '16:9 Обложка' },
  { value: '9:16', label: '9:16 Stories' },
]

const RESOLUTIONS: Resolution[] = ['1K', '2K', '4K']
const FORMATS: OutputFormat[] = ['png', 'jpg']

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

function StylePreviewCard({ style, selected, onSelect }: { style: DesignStyle; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`shrink-0 w-24 text-left rounded-2xl overflow-hidden border-2 transition-all active:scale-[0.98] shadow-sm ${
        selected ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow'
      }`}
    >
      <div className={`aspect-square relative ${style.previewClass}`}>
        {style.previewInner === 'dots' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_6px_6px,rgba(255,255,255,.7)_1.4px,transparent_0)] [background-size:14px_14px]" />}
        {style.previewInner === 'lines' && <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_35%,rgba(0,0,0,.2)_36%,transparent_37%)] [background-size:100%_14px]" />}
        {style.previewInner === 'circle' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-slate-300" /></div>}
        {style.previewInner === 'grid' && <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:14px_14px]" />}
        {style.previewInner === 'wave' && <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/20 rounded-t-full" />}
        {selected && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      <p className="px-2 py-2 text-[11px] font-medium text-slate-700 truncate bg-white/95">{style.name}</p>
    </button>
  )
}

function OptionChips({
  items,
  value,
  onChange,
}: {
  items: readonly { id: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-xl px-3.5 py-2 text-sm border-2 transition-all ${
            value === item.id
              ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function Designer() {
  const { userAvatar, userName, useToolCharge, getToolFreeRemaining, getToolPrice, incrementGenerations, planId } = useStore()
  const { sessions, currentSessionId, addSession, setCurrentSession, getSession, updateSession, deleteSession } = useDesignerStore()
  const [view, setView] = useState<'list' | 'editor'>('list')
  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [selectedStyleId, setSelectedStyleId] = useState(DESIGN_STYLES[0].id)
  const [genre, setGenre] = useState<string>(PHOTO_GENRES[0].id)
  const [mood, setMood] = useState<string>(MOODS[0].id)
  const [lighting, setLighting] = useState<string>(LIGHTING[0].id)
  const [cameraAngle, setCameraAngle] = useState<string>(CAMERA_ANGLES[0].id)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5')
  const [resolution, setResolution] = useState<Resolution>('2K')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onVoiceResult = useCallback((text: string) => setPrompt((prev) => (prev ? `${prev} ${text}` : text)), [])
  const { listening, start: startVoice, stop: stopVoice } = useVoiceInput(onVoiceResult)

  useEffect(() => {
    if (view !== 'editor') return
    if (!currentSessionId && sessions.length === 0) {
      addSession()
      return
    }
    if (!currentSessionId && sessions.length > 0) {
      setCurrentSession(sessions[0].id)
      return
    }
    if (!currentSessionId) return
    const cur = getSession(currentSessionId)
    if (!cur) return
    setPrompt(cur.prompt ?? '')
    setSelectedStyleId(cur.selectedStyleId ?? DESIGN_STYLES[0].id)
    setGenre(cur.genre ?? PHOTO_GENRES[0].id)
    setMood(cur.mood ?? MOODS[0].id)
    setLighting(cur.lighting ?? LIGHTING[0].id)
    setCameraAngle(cur.cameraAngle ?? CAMERA_ANGLES[0].id)
    setAspectRatio((cur.aspectRatio ?? '4:5') as AspectRatio)
    setResolution((cur.resolution ?? '2K') as Resolution)
    setOutputFormat((cur.outputFormat ?? 'png') as OutputFormat)
    setNegativePrompt(cur.negativePrompt ?? '')
    setResultUrl(cur.resultUrl ?? null)
  }, [view, currentSessionId, sessions, addSession, setCurrentSession, getSession])

  useEffect(() => {
    if (view !== 'editor' || !currentSessionId) return
    updateSession(currentSessionId, {
      prompt,
      selectedStyleId,
      genre,
      mood,
      lighting,
      cameraAngle,
      aspectRatio: aspectRatio as '1:1' | '3:4' | '4:5' | '16:9' | '9:16',
      resolution,
      outputFormat,
      negativePrompt,
    })
  }, [view, currentSessionId, prompt, selectedStyleId, genre, mood, lighting, cameraAngle, aspectRatio, resolution, outputFormat, negativePrompt, updateSession])

  const selectedStyle = useMemo(() => DESIGN_STYLES.find((s) => s.id === selectedStyleId), [selectedStyleId])
  const selectedGenre = PHOTO_GENRES.find((g) => g.id === genre)
  const selectedMood = MOODS.find((x) => x.id === mood)
  const selectedLighting = LIGHTING.find((x) => x.id === lighting)
  const selectedCamera = CAMERA_ANGLES.find((x) => x.id === cameraAngle)

  const fullPrompt = useMemo(() => {
    const chunks = [
      prompt.trim(),
      `Genre: ${selectedGenre?.hint ?? ''}.`,
      `Style: ${selectedStyle?.promptHint ?? ''}.`,
      `Mood: ${selectedMood?.hint ?? ''}.`,
      `Lighting: ${selectedLighting?.hint ?? ''}.`,
      `Camera: ${selectedCamera?.hint ?? ''}.`,
      'Photorealistic, high detail, modern composition, clean professional rendering.',
      negativePrompt.trim() ? `Negative prompt: ${negativePrompt.trim()}.` : '',
    ]
    return chunks.filter(Boolean).join(' ')
  }, [prompt, selectedGenre, selectedStyle, selectedMood, selectedLighting, selectedCamera, negativePrompt])

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return
    if (!useToolCharge('designer')) {
      setError(`Недостаточно нейронов. Бесплатные генерации на сегодня закончились. Стоимость: ${getToolPrice('designer')} нейронов.`)
      return
    }
    setGenerating(true)
    setError(null)
    try {
      const result = await generateImageNanoBananaPro({
        prompt: fullPrompt.slice(0, 10000),
        aspect_ratio: aspectRatio,
        resolution,
        output_format: outputFormat,
      })
      if (result.state === 'success' && result.imageUrl) {
        setResultUrl(result.imageUrl)
        incrementGenerations(1)
        if (currentSessionId) {
          updateSession(currentSessionId, {
            resultUrl: result.imageUrl,
            title: prompt.trim().slice(0, 36) || 'Новая генерация',
          })
        }
      } else {
        setError(result.failMsg || 'Не удалось завершить генерацию')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сети')
    } finally {
      setGenerating(false)
    }
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/70 via-white to-indigo-50/50" />
          <motion.div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-cyan-200/25 blur-3xl" animate={{ y: [0, 18, 0], x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 9 }} />
          <motion.div className="absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-indigo-200/20 blur-3xl" animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 10 }} />
        </div>
        <header className="relative z-10 sticky top-0 flex items-center h-14 px-4 bg-white/75 backdrop-blur-xl border-b border-slate-100/80">
          <Link to="/" className="text-slate-600 hover:text-slate-900"><ArrowLeft size={20} /></Link>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-slate-800">Flow Studio</span>
            <p className="text-[11px] text-slate-500 -mt-0.5">Генерация фото через Kie AI</p>
          </div>
          <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm border border-slate-200">
            {userAvatar ? <img src={userAvatar} alt="" className="w-full h-full object-cover" /> : userName.slice(0, 1).toUpperCase()}
          </Link>
        </header>

        <div className="relative z-10 p-5 space-y-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/85 backdrop-blur border border-white shadow-xl shadow-slate-200/60 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <WandSparkles size={23} />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-slate-900 text-xl">Фото-генерации</h1>
                <p className="text-sm text-slate-600 mt-1">Современная генерация кадров в любом жанре с параметрами сцены, света и ракурса.</p>
                <p className="mt-2 text-xs text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5">
                  <Sparkles size={12} /> Модель: Kie AI · nano-banana-pro
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  План: {planId.toUpperCase()} · Бесплатно сегодня: {getToolFreeRemaining('designer')} · Далее {getToolPrice('designer')} нейронов
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setView('editor')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full rounded-3xl bg-white border border-slate-200 p-4 text-left shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <ImageIcon className="text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">Новая генерация</p>
                <p className="text-xs text-slate-500">Жанр, стиль, настроение, свет, ракурс, формат</p>
              </div>
              <ChevronRight className="text-cyan-500" />
            </div>
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-28">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/75 via-white to-indigo-50/50" />
        <motion.div className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-cyan-200/25 blur-3xl" animate={{ y: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 8 }} />
        <motion.div className="absolute top-2/3 -left-20 w-72 h-72 rounded-full bg-blue-200/20 blur-3xl" animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 10 }} />
      </div>

      <header className="relative z-10 sticky top-0 flex items-center h-14 px-4 bg-white/75 backdrop-blur-xl border-b border-slate-100/80">
        <button type="button" onClick={() => setView('list')} className="text-slate-600 hover:text-slate-900"><ArrowLeft size={20} /></button>
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-slate-800">Flow Photo</span>
          <p className="text-[11px] text-slate-500 -mt-0.5">Kie AI · nano-banana-pro</p>
        </div>
        <button type="button" onClick={() => setSessionsOpen(true)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Сессии">
          <List size={21} />
        </button>
      </header>

      <AnimatePresence>
        {sessionsOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/25 z-20" onClick={() => setSessionsOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-30 border-l border-slate-200 shadow-2xl"
            >
              <div className="h-14 border-b border-slate-100 px-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Сессии</p>
                  <p className="text-[11px] text-slate-500">{sessions.length} сохранено</p>
                </div>
                <button type="button" onClick={() => setSessionsOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"><X size={20} /></button>
              </div>
              <div className="p-4 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    stopVoice()
                    addSession()
                    setResultUrl(null)
                    setSessionsOpen(false)
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25"
                >
                  <Plus size={18} /> Новая сессия
                </button>
              </div>
              <ul className="p-4 space-y-2 overflow-y-auto overscroll-y-contain max-h-[calc(100vh-120px)] pr-2">
                {sessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentSession(s.id)
                        setSessionsOpen(false)
                      }}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-left hover:border-cyan-200 hover:bg-cyan-50/50 transition-colors"
                    >
                      <p className="text-sm font-medium text-slate-800 truncate">{s.title || s.prompt.slice(0, 24) || 'Без названия'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.resultUrl ? 'Есть результат' : 'Черновик'} · {new Date(s.updatedAt).toLocaleDateString('ru-RU')}</p>
                    </button>
                    <button type="button" onClick={() => deleteSession(s.id)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={17} /></button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 px-4 py-5 space-y-5 scroll-smooth">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm text-cyan-800 flex gap-2.5">
          <Info className="shrink-0 mt-0.5" size={16} />
          Чем конкретнее описание объекта и контекста, тем лучше итог. Можно дополнительно уточнить негативный промпт. Бесплатно: {getToolFreeRemaining('designer')} генераций сегодня.
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-3xl bg-white/90 border border-slate-200 p-4 shadow-sm">
          <label className="text-sm font-semibold text-slate-800">Что нужно сгенерировать?</label>
          <div className="relative mt-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 5000))}
              rows={4}
              placeholder="Например: портрет девушки в красном пальто на вечерней улице Токио, cinematic, bokeh..."
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-[15px] text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            />
            <button type="button" onClick={listening ? stopVoice : startVoice} className={`absolute right-3 bottom-3 p-2.5 rounded-xl ${listening ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{prompt.length} / 5000</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-white/90 border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Жанр</p>
          <div className="grid grid-cols-2 gap-2.5">
            {PHOTO_GENRES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGenre(g.id)}
                className={`rounded-2xl p-3 border-2 text-left transition-all ${genre === g.id ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <p className="font-medium text-sm text-slate-800">{g.label}</p>
                <p className="text-[11px] text-slate-500 mt-1">{g.hint.split(',')[0]}</p>
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-3xl bg-white/90 border border-slate-200 p-4 shadow-sm space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Стиль</p>
            <div className="flex gap-3 overflow-x-auto pb-2 pr-1 snap-x snap-mandatory">
              {DESIGN_STYLES.map((style) => (
                <div key={style.id} className="snap-start">
                  <StylePreviewCard style={style} selected={selectedStyleId === style.id} onSelect={() => setSelectedStyleId(style.id)} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Настроение</p>
            <OptionChips items={MOODS} value={mood} onChange={setMood} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Освещение</p>
            <OptionChips items={LIGHTING} value={lighting} onChange={setLighting} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Ракурс</p>
            <OptionChips items={CAMERA_ANGLES} value={cameraAngle} onChange={setCameraAngle} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-3xl bg-white/90 border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Параметры генерации</p>
          <div className="grid grid-cols-1 gap-3">
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
              {ASPECTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <div className="flex gap-2">
              {RESOLUTIONS.map((value) => (
                <button key={value} type="button" onClick={() => setResolution(value)} className={`flex-1 h-10 rounded-xl border-2 text-sm ${resolution === value ? 'border-cyan-300 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-600'}`}>{value}</button>
              ))}
            </div>
            <div className="flex gap-2">
              {FORMATS.map((value) => (
                <button key={value} type="button" onClick={() => setOutputFormat(value)} className={`flex-1 h-10 rounded-xl border-2 text-sm uppercase ${outputFormat === value ? 'border-cyan-300 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-600'}`}>{value}</button>
              ))}
            </div>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value.slice(0, 2000))}
              rows={3}
              placeholder="Negative prompt (опционально): blur, low quality, distorted hands..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 resize-none"
            />
          </div>
        </motion.section>

        {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <motion.button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          whileTap={{ scale: 0.98 }}
          className="w-full h-13 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 disabled:opacity-55 disabled:pointer-events-none"
        >
          {generating ? 'Генерация в Flow...' : 'Сгенерировать фото'}
        </motion.button>

        <div className="rounded-2xl bg-white/90 border border-slate-200 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Промпт для Kie AI</p>
          <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-5">{fullPrompt || 'Заполните описание, чтобы увидеть итоговый промпт.'}</p>
        </div>

        <AnimatePresence>
          {resultUrl && (
            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white">
              <img src={resultUrl} alt="Generated" className="w-full object-cover" />
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-800">Готово</p>
                <p className="text-xs text-slate-500 mt-1">{aspectRatio} · {resolution} · {outputFormat.toUpperCase()} · nano-banana-pro</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
