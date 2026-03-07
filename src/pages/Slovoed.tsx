import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mic,
  MicOff,
  Zap,
  Gift,
  MoreVertical,
  Upload,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'
import { Character } from '../components/Character'
import { useStore } from '../store/useStore'
import { slovoedProcess } from '../services/api/neuroApi'
import { Toast } from '../components/Toast'
import { tools } from '../data/tools'

const APP_NAME = 'AI Tools'
const tool = tools.find((t) => t.id === 'slovoed')!

function useVoiceInput(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognition | null>(null)

  const start = useCallback(() => {
    const SR =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) {
      onResult('[Голосовой ввод не поддерживается]')
      return
    }
    const rec = new SR()
    rec.lang = 'ru-RU'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(' ')
      if (text) onResult(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }, [onResult])

  const stop = useCallback(() => {
    recRef.current?.stop()
    recRef.current = null
    setListening(false)
  }, [])

  return { listening, start, stop }
}

export function Slovoed() {
  const { balance, userAvatar, userName, useSlovoedCharge, slovoedFreeRemaining } = useStore()
  const freeRemaining = slovoedFreeRemaining()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })
  const showToast = useCallback((message: string) => setToast({ message, visible: true }), [])
  const hideToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), [])

  const onVoiceResult = useCallback((text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text))
  }, [])
  const { listening, start: startVoice, stop: stopVoice } = useVoiceInput(onVoiceResult)

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    if (!useSlovoedCharge()) {
      showToast('Недостаточно нейронов. Пополните баланс или дождитесь завтрашних бесплатных попыток.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const { text, error } = await slovoedProcess(trimmed)
      if (error) {
        showToast(error)
        return
      }
      setResult(text || '— Пустой ответ')
    } finally {
      setLoading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt')) {
      showToast('Поддерживаются только текстовые файлы (.txt). Для аудио используйте запись голоса.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const text = (reader.result as string) || ''
      setInput((prev) => (prev ? `${prev}\n${text}` : text))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const copyResult = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    showToast('Скопировано в буфер')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 pb-28">
      {/* Шапка: назад, название приложения, меню */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="flex items-center h-12 px-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Назад</span>
          </Link>
          <div className="flex-1 flex flex-col items-center justify-center min-w-0">
            <span className="font-bold text-slate-900 text-[15px] truncate">{APP_NAME}</span>
            <span className="text-[11px] text-slate-500">мини-приложение</span>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Ещё"
          >
            <MoreVertical size={20} />
          </button>
        </div>
        {/* Блок инструмента: иконка, название, функционал, балансы */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-50">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
            style={{ background: tool.accentColor }}
          >
            <Mic size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-slate-800 truncate">{tool.characterName}</h1>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Аудио → Текст
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-emerald-600">
              <Gift size={18} />
              <span className="font-semibold text-sm tabular-nums">{freeRemaining}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Zap size={18} />
              <span className="font-semibold text-sm tabular-nums">{balance}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Персонаж */}
        <div className="mx-auto max-w-[220px] aspect-[3/4] rounded-3xl overflow-hidden mb-4">
          <Character
            imageUrl={tool.characterImage}
            accentColor={tool.accentColor}
            name={tool.characterName}
            className="w-full h-full"
          />
        </div>
        <h2 className="text-center font-bold text-slate-800 text-lg mb-1">{tool.characterName}</h2>
        <p className="text-center text-sm text-slate-600 mb-1">
          Вставьте ссылку, прикрепите файл или запишите голос
        </p>
        <p className="text-center text-xs text-slate-500 mb-6">
          3 бесплатные в день, далее 5 нейронов
        </p>

        {/* Поле ввода */}
        <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <label className="flex items-center justify-center w-12 h-12 text-slate-500 hover:bg-slate-50 shrink-0 cursor-pointer">
            <Upload size={22} />
            <input
              type="file"
              accept=".txt,text/*"
              className="sr-only"
              onChange={handleFile}
            />
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ссылка или текст..."
            className="flex-1 min-w-0 py-3 px-1 text-slate-800 placeholder:text-slate-400 focus:outline-none text-[15px]"
          />
          <button
            type="button"
            onClick={listening ? stopVoice : startVoice}
            className={`shrink-0 flex items-center justify-center w-12 h-12 ${
              listening ? 'bg-red-100 text-red-500' : 'text-slate-500 hover:bg-slate-50'
            }`}
            aria-label={listening ? 'Остановить' : 'Голос'}
          >
            {listening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="mt-4 w-full py-3.5 rounded-2xl font-semibold text-white disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          style={{ background: tool.accentColor }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Обработка...
            </>
          ) : (
            'Преобразовать в текст'
          )}
        </button>

        {/* Результат */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Результат</span>
              <button
                type="button"
                onClick={copyResult}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
            <div className="p-4 text-sm text-slate-700 whitespace-pre-wrap max-h-[40vh] overflow-y-auto">
              {result}
            </div>
          </motion.div>
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  )
}
