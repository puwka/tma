import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Plus,
  List,
  X,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { chatCompletion, type ChatMessage, COACH_SYSTEM_PROMPT } from '../services/api/neuroApi'
import { useStore } from '../store/useStore'
import {
  useCoachStore,
  type CoachMessage as SessionMessage,
  type CoachSession,
} from '../store/useCoachStore'

const INTRO_AREAS = [
  { emoji: '🔍', title: 'Решения', text: 'Жизненные развилки и сложный выбор' },
  { emoji: '🔄', title: 'Выгорание', text: 'Мотивация, фокус, восстановление' },
  { emoji: '💡', title: 'Отношения', text: 'Конфликты, границы, коммуникация' },
  { emoji: '🎯', title: 'Цели', text: 'Поиск предназначения и приоритетов' },
  { emoji: '⚡', title: 'Ресурсы', text: 'Энергия, время, самореализация' },
]

const HINTS = [
  { emoji: '🔥', text: 'Чувствую выгорание' },
  { emoji: '😟', text: 'Не могу принять решение' },
  { emoji: '💔', text: 'Проблемы в отношениях' },
  { emoji: '🎯', text: 'Хочу найти свою цель' },
  { emoji: '😥', text: 'Тревога и неуверенность' },
]

const METHODOLOGY = [
  'Нейропсихология и когнитивные практики',
  'Системный и процессуальный коучинг',
  'Фокус на ваших ответах, а не советах',
]

function useVoiceInput(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition
    if (!SpeechRecognition) {
      onResult('[Голосовой ввод не поддерживается в этом браузере]')
      return
    }
    const rec = new SpeechRecognition()
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
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }, [onResult])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListening(false)
  }, [])

  return { listening, start, stop }
}

export function Coach() {
  const { userName, userAvatar } = useStore()
  const {
    sessions,
    currentSessionId,
    addSession,
    setCurrentSession,
    getSession,
    appendMessage,
    deleteSession,
  } = useCoachStore()

  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const currentSession = currentSessionId ? getSession(currentSessionId) : undefined
  const messages = currentSession?.messages ?? []

  useEffect(() => {
    if (!currentSessionId && sessions.length === 0) {
      addSession()
    } else if (!currentSessionId && sessions.length > 0) {
      setCurrentSession(sessions[0].id)
    }
  }, [currentSessionId, sessions.length, addSession, setCurrentSession, sessions])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const onVoiceResult = useCallback((text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text))
  }, [])

  const { listening, start: startVoice, stop: stopVoice } = useVoiceInput(onVoiceResult)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return
      if (!currentSessionId) return
      setInput('')
      const userMsg: SessionMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      }
      appendMessage(currentSessionId, userMsg)
      setLoading(true)
      try {
        const history: ChatMessage[] = [
          { role: 'system', content: COACH_SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          { role: 'user', content: trimmed },
        ]
        const result = await chatCompletion(history)
        const assistantMsg: SessionMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: result.content,
          timestamp: Date.now(),
        }
        appendMessage(currentSessionId, assistantMsg)
      } catch (e) {
        const errMsg: SessionMessage = {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: `Ошибка: ${e instanceof Error ? e.message : 'Не удалось получить ответ'}. Проверьте API ключ и сеть.`,
          timestamp: Date.now(),
        }
        appendMessage(currentSessionId, errMsg)
      } finally {
        setLoading(false)
      }
    },
    [loading, currentSessionId, messages, appendMessage]
  )

  const send = () => sendMessage(input)
  const startNewSession = () => {
    stopVoice()
    addSession()
    setSessionsOpen(false)
  }
  const openSession = (s: CoachSession) => {
    setCurrentSession(s.id)
    setSessionsOpen(false)
  }

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteSession(sessionId)
    if (currentSessionId === sessionId && sessions.length > 1) {
      const rest = sessions.filter((s) => s.id !== sessionId)
      setCurrentSession(rest[0]?.id ?? null)
    } else if (currentSessionId === sessionId) {
      setCurrentSession(null)
      addSession()
    }
  }

  const showIntro = messages.length === 0
  const displayName = userName && userName !== 'Пользователь' ? userName.split(' ')[0] : 'друг'

  return (
    <div className="flex flex-col h-full min-h-screen relative">
      {/* Тематический фон */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/80 via-white to-slate-50/50" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Шапка */}
      <header className="shrink-0 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="h-0.5 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400" />
        <div className="flex items-center h-14 px-4 gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 active:opacity-80 transition-colors shrink-0 -ml-0.5 rounded-lg py-1.5 pr-2 -ml-1 hover:bg-slate-100/80"
            aria-label="Назад"
          >
            <ArrowLeft size={22} strokeWidth={2} />
            <span className="text-[15px] font-medium">Назад</span>
          </Link>
          <div className="flex-1 flex flex-col items-center min-w-0">
            <h1 className="text-[18px] font-bold text-slate-900 tracking-tight truncate">
              AI-Coach
            </h1>
            <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
              Персональный коучинг
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-[72px] justify-end">
            <button
              type="button"
              onClick={() => setSessionsOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700 active:scale-95 transition-all"
              aria-label="Сессии"
            >
              <List size={21} strokeWidth={2} />
              {messages.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-teal-500 text-white text-[11px] font-semibold shadow-sm">
                  {messages.length > 99 ? '99+' : messages.length}
                </span>
              )}
            </button>
            <Link
              to="/profile"
              className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm ring-2 ring-white shadow-sm"
              aria-label="Профиль"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                userName.slice(0, 1).toUpperCase()
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Панель сессий */}
      <AnimatePresence>
        {sessionsOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-30 w-[85%] max-w-[320px] bg-white border-r border-slate-200/80 shadow-2xl shadow-slate-200/50"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="font-bold text-slate-800">Сессии</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sessions.length} {sessions.length === 1 ? 'сессия' : sessions.length < 5 ? 'сессии' : 'сессий'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSessionsOpen(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-200/80 hover:text-slate-600 transition-colors"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
              <button
                type="button"
                onClick={startNewSession}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/30 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all"
              >
                <Plus size={20} strokeWidth={2.5} />
                Новая сессия
              </button>
              <div className="mt-5">
                {sessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-8 px-4 text-center">
                    <p className="text-sm text-slate-500">Пока нет сохранённых сессий</p>
                    <p className="text-xs text-slate-400 mt-1">Создайте первую выше</p>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {sessions.map((s) => (
                      <li key={s.id} className="group flex items-stretch gap-2">
                        <button
                          type="button"
                          onClick={() => openSession(s)}
                          className={`flex-1 min-w-0 text-left px-4 py-3.5 rounded-2xl border-2 transition-all ${
                            s.id === currentSessionId
                              ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-sm'
                              : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 text-slate-700'
                          }`}
                        >
                          <span className="font-semibold text-sm truncate block">{s.title}</span>
                          <span className="text-xs text-slate-500 mt-0.5 block">
                            {s.messages.length} сообщ. · {new Date(s.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="flex items-center justify-center w-11 shrink-0 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Удалить сессию"
                        >
                          <Trash2 size={18} strokeWidth={2} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {sessionsOpen && (
        <button
          type="button"
          aria-label="Закрыть"
          className="fixed inset-0 z-[25] bg-black/20"
          onClick={() => setSessionsOpen(false)}
        />
      )}

      {/* Контент */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-5 relative z-10">
        {showIntro ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* Приветственная карточка */}
            <div className="rounded-3xl bg-white/90 backdrop-blur border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-5 py-4 text-white">
                <p className="text-teal-100 text-sm font-medium">Персональный коучинг</p>
                <h2 className="text-xl font-bold mt-0.5">Привет, {displayName}! 👋</h2>
                <p className="text-teal-100/90 text-[14px] leading-relaxed mt-2">
                  Я помогу увидеть то, что пока не замечаешь, и найти свои ответы через вопросы и рефлексию.
                </p>
              </div>
              <div className="p-5">
                <p className="text-slate-700 font-semibold text-sm mb-3">С чем работаем</p>
                <div className="grid gap-2.5">
                  {INTRO_AREAS.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5"
                    >
                      <span className="text-lg leading-none mt-0.5">{item.emoji}</span>
                      <div>
                        <span className="font-medium text-slate-800 text-sm">{item.title}</span>
                        <span className="text-slate-600 text-[13px] block mt-0.5">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Методология</p>
                  <ul className="space-y-1.5">
                    {METHODOLOGY.map((line, i) => (
                      <li key={i} className="flex items-center gap-2 text-[13px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <p className="text-slate-600 font-semibold text-[15px] mb-3">С чего начнём?</p>
              <div className="flex flex-wrap gap-2">
                {HINTS.map((h, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(h.text)}
                    disabled={loading}
                    className="rounded-2xl border-2 border-teal-100 bg-teal-50/80 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-teal-100/80 hover:border-teal-200 active:scale-[0.98] transition-all disabled:opacity-60"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-1.5">{h.emoji}</span>
                    {h.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="space-y-5 pb-2 max-w-2xl mx-auto">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3.5 shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-md'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md shadow-slate-200/50'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100">
                            <Sparkles size={12} className="text-teal-600" />
                          </span>
                          <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">Coach</span>
                        </div>
                      )}
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {messages.length > 0 && (
              <div className="max-w-2xl mx-auto mt-6 pt-4 border-t border-slate-100/80">
                <p className="text-slate-500 text-sm font-medium mb-2">Быстрые темы</p>
                <div className="flex flex-wrap gap-2">
                  {HINTS.slice(0, 4).map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(h.text)}
                      disabled={loading}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:border-teal-100 hover:text-teal-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {h.emoji} {h.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mt-4 max-w-2xl mx-auto"
          >
            <div className="rounded-2xl rounded-bl-md bg-white border border-slate-100 px-4 py-3.5 shadow-sm shadow-slate-200/50 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-slate-500 text-sm font-medium">Думаю...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Поле ввода */}
      <div className="shrink-0 p-4 pt-3 pb-6 bg-white/80 backdrop-blur-xl border-t border-slate-100/80 relative z-10">
        <div className="flex gap-3 items-end max-w-2xl mx-auto">
          <button
            type="button"
            onClick={listening ? stopVoice : startVoice}
            className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all ${
              listening
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-600'
            }`}
            aria-label={listening ? 'Остановить запись' : 'Голосовой ввод'}
          >
            {listening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Напишите сообщение или выберите тему выше"
            rows={1}
            className="flex-1 min-h-[48px] max-h-28 resize-none rounded-2xl border-2 border-slate-200 bg-slate-50/80 px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 focus:bg-white"
            disabled={loading}
          />
          <motion.button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:pointer-events-none hover:shadow-teal-500/30 hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <Send size={22} strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
