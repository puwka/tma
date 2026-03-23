import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Download,
  Flame,
  Info,
  Layers,
  List,
  Mic,
  MicOff,
  Palette,
  Plus,
  RefreshCw,
  Sparkles,
  Sun,
  Trash2,
  X,
  WandSparkles,
  Zap,
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

const GEN_MESSAGES = [
  'Создаю композицию...',
  'Подбираю освещение...',
  'Настраиваю детали...',
  'Рендеринг сцены...',
  'Финальные штрихи...',
]

const FEATURES = [
  { icon: Layers, title: '6 жанров', desc: 'Портрет, fashion, предметка и др.', color: 'from-violet-500 to-purple-600' },
  { icon: Palette, title: '10+ стилей', desc: 'Minimal, cinematic, retro, neon...', color: 'from-pink-500 to-rose-600' },
  { icon: Sun, title: 'Свет и mood', desc: 'Студийный, неон, golden hour', color: 'from-amber-500 to-orange-600' },
  { icon: Camera, title: 'Ракурсы', desc: 'Eye-level, low-angle, top-down', color: 'from-cyan-500 to-blue-600' },
]

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_80%,rgba(168,85,247,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white/80 to-slate-50/90" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #6366f1 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute -top-32 right-[-10%] w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)' }}
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[40%] -left-[15%] w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)' }}
        animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[20%] w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }}
        animate={{ y: [0, 20, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating sparkle particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
        />
      ))}
    </div>
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
  const stop = useCallback(() => { recRef.current?.stop(); setListening(false) }, [])
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

function OptionChips({ items, value, onChange }: { items: readonly { id: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-xl px-3.5 py-2 text-sm border-2 transition-all ${
            value === item.id ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function GeneratingOverlay() {
  const [msgIdx, setMsgIdx] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setMsgIdx((i) => (i + 1) % GEN_MESSAGES.length), 2800)
    return () => clearInterval(iv)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-6 p-8">
        <div className="relative w-28 h-28">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
              animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
            />
          ))}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/40 flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="text-white" size={32} />
          </motion.div>
        </div>
        <div className="w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '60%' }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={msgIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-white text-base font-medium">
            {GEN_MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>
        <p className="text-white/50 text-xs">Обычно занимает 15–40 сек</p>
      </motion.div>
    </motion.div>
  )
}

function downloadImage(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.target = '_blank'; a.rel = 'noopener'
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
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

  const freeRemaining = getToolFreeRemaining('designer')
  const toolPrice = getToolPrice('designer')

  useEffect(() => {
    if (view !== 'editor') return
    if (!currentSessionId && sessions.length === 0) { addSession(); return }
    if (!currentSessionId && sessions.length > 0) { setCurrentSession(sessions[0].id); return }
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
      prompt, selectedStyleId, genre, mood, lighting, cameraAngle,
      aspectRatio: aspectRatio as '1:1' | '3:4' | '4:5' | '16:9' | '9:16',
      resolution, outputFormat, negativePrompt,
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
      setError(`Недостаточно нейронов. Бесплатные генерации закончились. Стоимость: ${toolPrice} нейронов.`)
      return
    }
    setGenerating(true)
    setError(null)
    try {
      const result = await generateImageNanoBananaPro({
        prompt: fullPrompt.slice(0, 10000),
        aspect_ratio: aspectRatio, resolution, output_format: outputFormat,
      })
      if (result.state === 'success' && result.imageUrl) {
        setResultUrl(result.imageUrl)
        incrementGenerations(1)
        if (currentSessionId) {
          updateSession(currentSessionId, { resultUrl: result.imageUrl, title: prompt.trim().slice(0, 36) || 'Новая генерация' })
        }
      } else {
        setError(result.failMsg || 'Не удалось завершить генерацию')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сети')
    } finally { setGenerating(false) }
  }

  const handleRegenerate = () => { setResultUrl(null); handleGenerate() }

  /* ── LIST VIEW ── */
  if (view === 'list') {
    const sessionsWithResult = sessions.filter((s) => s.resultUrl)
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />

        <header className="relative z-10 sticky top-0 flex items-center h-14 px-4 bg-white/60 backdrop-blur-2xl border-b border-white/60 shadow-sm shadow-slate-200/30">
          <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></Link>
          <div className="flex-1 text-center">
            <span className="text-sm font-bold text-slate-800 tracking-tight">Flow Studio</span>
          </div>
          <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-cyan-100 to-violet-100 flex items-center justify-center text-slate-600 font-semibold text-xs border border-white shadow-sm">
            {userAvatar ? <img src={userAvatar} alt="" className="w-full h-full object-cover" /> : userName.slice(0, 1).toUpperCase()}
          </Link>
        </header>

        <div className="relative z-10 px-5 pt-6 pb-10 space-y-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[28px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-violet-600" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
            />

            <div className="relative p-6 pb-7">
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/10 border border-white/20"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <WandSparkles size={28} className="text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-white font-extrabold text-[22px] leading-tight tracking-tight">AI Фото-студия</h1>
                  <p className="text-white/70 text-sm mt-1.5 leading-snug">Создавайте профессиональные фото с настройками жанра, стиля, света и ракурса</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                  <Zap size={13} className="text-yellow-300" />
                  <span className="text-white/90 text-xs font-medium">{freeRemaining} бесплатно</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                  <Flame size={13} className="text-orange-300" />
                  <span className="text-white/90 text-xs font-medium">{toolPrice} нейр./запрос</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                  <Sparkles size={13} className="text-cyan-200" />
                  <span className="text-white/90 text-xs font-medium">{planId.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            type="button"
            onClick={() => setView('editor')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full rounded-[22px] bg-white/80 backdrop-blur-xl border border-white shadow-lg shadow-slate-200/50 p-4 text-left transition-all hover:shadow-xl hover:bg-white/90"
          >
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30 transition-transform group-hover:scale-105">
                <Plus size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-base">Создать изображение</p>
                <p className="text-xs text-slate-500 mt-0.5">Опишите идею — AI сгенерирует фото</p>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
            </div>
          </motion.button>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Возможности</p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="rounded-2xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-sm p-3.5"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-md`}>
                      <Icon size={17} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-800 text-[13px] mt-2.5">{f.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-[22px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm p-5"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Как это работает</p>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Опишите, что хотите увидеть на фото' },
                { step: '2', text: 'Настройте жанр, стиль, свет и ракурс' },
                { step: '3', text: 'Нажмите «Сгенерировать» и получите результат' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent sessions */}
          {sessionsWithResult.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Недавние генерации</p>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {sessionsWithResult.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setCurrentSession(s.id); setView('editor') }}
                    className="snap-start shrink-0 w-28 rounded-2xl overflow-hidden bg-white/70 backdrop-blur border border-white/80 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-slate-100">
                      {s.resultUrl && <img src={s.resultUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 px-2 py-2 truncate">{s.title || 'Без названия'}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  /* ── EDITOR VIEW ── */
  return (
    <div className="min-h-screen relative overflow-hidden pb-28">
      <AnimatedBackground />

      <header className="relative z-10 sticky top-0 flex items-center h-14 px-4 bg-white/60 backdrop-blur-2xl border-b border-white/60 shadow-sm shadow-slate-200/30">
        <button type="button" onClick={() => setView('list')} className="text-slate-500 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></button>
        <div className="flex-1 text-center">
          <span className="text-sm font-bold text-slate-800 tracking-tight">Flow Photo</span>
          <p className="text-[11px] text-slate-400 -mt-0.5">AI-генератор</p>
        </div>
        <button type="button" onClick={() => setSessionsOpen(true)} className="p-2 rounded-xl text-slate-500 hover:bg-white/60 transition-colors" aria-label="Сессии">
          <List size={21} />
        </button>
      </header>

      <AnimatePresence>{generating && <GeneratingOverlay />}</AnimatePresence>

      <AnimatePresence>
        {sessionsOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-20" onClick={() => setSessionsOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white/95 backdrop-blur-xl z-30 border-l border-slate-200/50 shadow-2xl"
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
                  onClick={() => { stopVoice(); addSession(); setResultUrl(null); setSessionsOpen(false) }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25"
                >
                  <Plus size={18} /> Новая сессия
                </button>
              </div>
              <ul className="p-4 space-y-2 overflow-y-auto overscroll-y-contain max-h-[calc(100vh-120px)] pr-2">
                {sessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setCurrentSession(s.id); setSessionsOpen(false) }}
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-cyan-100/80 bg-cyan-50/50 backdrop-blur-sm px-4 py-3 text-sm text-cyan-800 flex gap-2.5">
          <Info className="shrink-0 mt-0.5" size={16} />
          Чем конкретнее описание, тем лучше итог. Бесплатно: {freeRemaining} генераций сегодня.
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[22px] bg-white/80 backdrop-blur-xl border border-white/80 p-4 shadow-sm">
          <label className="text-sm font-semibold text-slate-800">Что нужно сгенерировать?</label>
          <div className="relative mt-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 5000))}
              rows={4}
              placeholder="Например: портрет девушки в красном пальто на вечерней улице Токио, cinematic, bokeh..."
              className="w-full rounded-2xl border-2 border-slate-200/80 bg-slate-50/80 px-4 py-3 pr-12 text-[15px] text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition-colors"
            />
            <button type="button" onClick={listening ? stopVoice : startVoice} className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-colors ${listening ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{prompt.length} / 5000</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[22px] bg-white/80 backdrop-blur-xl border border-white/80 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Жанр</p>
          <div className="grid grid-cols-2 gap-2.5">
            {PHOTO_GENRES.map((g) => (
              <button
                key={g.id} type="button" onClick={() => setGenre(g.id)}
                className={`rounded-2xl p-3 border-2 text-left transition-all ${genre === g.id ? 'border-cyan-300 bg-cyan-50/80' : 'border-slate-200/80 bg-white/60 hover:border-slate-300'}`}
              >
                <p className="font-medium text-sm text-slate-800">{g.label}</p>
                <p className="text-[11px] text-slate-500 mt-1">{g.hint.split(',')[0]}</p>
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-[22px] bg-white/80 backdrop-blur-xl border border-white/80 p-4 shadow-sm space-y-4">
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

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-[22px] bg-white/80 backdrop-blur-xl border border-white/80 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Параметры генерации</p>
          <div className="grid grid-cols-1 gap-3">
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} className="h-11 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 text-sm text-slate-700">
              {ASPECTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <div className="flex gap-2">
              {RESOLUTIONS.map((value) => (
                <button key={value} type="button" onClick={() => setResolution(value)} className={`flex-1 h-10 rounded-xl border-2 text-sm transition-all ${resolution === value ? 'border-cyan-300 bg-cyan-50/80 text-cyan-700' : 'border-slate-200/80 text-slate-600'}`}>{value}</button>
              ))}
            </div>
            <div className="flex gap-2">
              {FORMATS.map((value) => (
                <button key={value} type="button" onClick={() => setOutputFormat(value)} className={`flex-1 h-10 rounded-xl border-2 text-sm uppercase transition-all ${outputFormat === value ? 'border-cyan-300 bg-cyan-50/80 text-cyan-700' : 'border-slate-200/80 text-slate-600'}`}>{value}</button>
              ))}
            </div>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value.slice(0, 2000))}
              rows={3}
              placeholder="Negative prompt (опционально): blur, low quality, distorted hands..."
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-700 resize-none"
            />
          </div>
        </motion.section>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600">{error}</motion.p>
        )}

        <motion.button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 disabled:opacity-55 disabled:pointer-events-none transition-shadow hover:shadow-xl"
        >
          Сгенерировать фото
        </motion.button>

        <AnimatePresence>
          {resultUrl && (
            <motion.section
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="rounded-[22px] overflow-hidden border border-white/80 shadow-xl bg-white/90 backdrop-blur-xl"
            >
              <motion.img src={resultUrl} alt="Результат" className="w-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Готово</p>
                    <p className="text-xs text-slate-500 mt-0.5">{aspectRatio} · {resolution} · {outputFormat.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <motion.button type="button" onClick={handleRegenerate} whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw size={18} /> Переделать
                  </motion.button>
                  <motion.button type="button" onClick={() => downloadImage(resultUrl!, `flow-photo-${Date.now()}.${outputFormat}`)} whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md shadow-cyan-500/25"
                  >
                    <Download size={18} /> Скачать
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
