import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Loader2,
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
  { emoji: '🔍', text: 'Жизненные развилки и сложные решения' },
  { emoji: '🔄', text: 'Выгорание, потеря мотивации, рассфокус' },
  { emoji: '💡', text: 'Отношения, конфликты, границы' },
  { emoji: '🎯', text: 'Поиск целей и предназначения' },
  { emoji: '⚡', text: 'Энергия, ресурсы, самореализация' },
]

const HINTS = [
  { emoji: '🔥', text: 'Чувствую выгорание' },
  { emoji: '😟', text: 'Не могу принять решение' },
  { emoji: '💔', text: 'Проблемы в отношениях' },
  { emoji: '🎯', text: 'Хочу найти свою цель' },
  { emoji: '😥', text: 'Тревога и неуверенность' },
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
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-teal-50/30 to-white">
      {/* Шапка */}
      <header className="shrink-0 sticky top-0 z-20 bg-white border-b border-slate-200/80">
        <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-400" />
        <div className="flex items-center h-14 px-4 gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 active:opacity-80 transition-colors shrink-0 -ml-0.5"
            aria-label="Назад"
          >
            <ArrowLeft size={22} strokeWidth={2} />
            <span className="text-[15px] font-medium">Назад</span>
          </Link>
          <h1 className="flex-1 text-center text-[18px] font-bold text-slate-900 tracking-tight truncate">
            AI-Coach
          </h1>
          <div className="flex items-center gap-3 shrink-0 w-[72px] justify-end">
            <button
              type="button"
              onClick={() => setSessionsOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all"
              aria-label="Сессии"
            >
              <List size={21} strokeWidth={2} />
              {messages.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-teal-500 text-white text-[11px] font-semibold">
                  {messages.length > 99 ? '99+' : messages.length}
                </span>
              )}
            </button>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm border-2 border-white shadow-sm"
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-30 w-[85%] max-w-[320px] bg-white border-r border-slate-200 shadow-xl"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Сессии</h2>
              <button
                type="button"
                onClick={() => setSessionsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <button
                type="button"
                onClick={startNewSession}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-md hover:from-teal-600 hover:to-teal-700 active:scale-[0.98]"
              >
                <Plus size={20} />
                Новая сессия
              </button>
              <div className="mt-4">
                {sessions.length === 0 ? (
                  <p className="text-sm text-slate-500">Пока нет сохранённых сессий</p>
                ) : (
                  <ul className="space-y-2">
                    {sessions.map((s) => (
                      <li key={s.id} className="group flex items-stretch gap-1">
                        <button
                          type="button"
                          onClick={() => openSession(s)}
                          className={`flex-1 min-w-0 text-left px-4 py-3 rounded-xl border transition-colors ${
                            s.id === currentSessionId
                              ? 'bg-teal-50 border-teal-200 text-teal-800'
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="font-medium text-sm truncate block">{s.title}</span>
                          <span className="text-xs text-slate-500">{s.messages.length} сообщ.</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="flex items-center justify-center w-10 shrink-0 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
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
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
        {showIntro ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl bg-amber-50/80 border border-amber-100 p-4 shadow-sm">
              <p className="text-slate-800 text-[15px] leading-relaxed">
                Привет, {displayName}! 👋
              </p>
              <p className="mt-2 text-slate-700 text-[15px] leading-relaxed">
                Я — твой персональный коуч. Моя задача — помочь тебе увидеть то, что ты пока не замечаешь, и найти свои ответы.
              </p>
              <p className="mt-3 text-slate-600 text-sm font-medium">Я работаю с:</p>
              <ul className="mt-2 space-y-1.5">
                {INTRO_AREAS.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-slate-500 text-[13px]">
                Методология основана на лучших практиках нейропсихологии и системного коучинга.
              </p>
            </div>
            <p className="text-slate-600 font-medium text-[15px]">С чего начнём?</p>
            <div className="flex flex-wrap gap-2">
              {HINTS.map((h, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(h.text)}
                  disabled={loading}
                  className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-100/80 active:scale-[0.98] transition-all disabled:opacity-60"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-1.5">{h.emoji}</span>
                  {h.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-md'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles size={12} className="text-teal-500" />
                          <span className="text-[10px] font-medium text-teal-600 uppercase tracking-wider">Coach</span>
                        </div>
                      )}
                      <p className="text-[15px] leading-snug whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {messages.length > 0 && (
              <p className="text-slate-500 text-sm mt-4 mb-2">Или выберите тему:</p>
            )}
            {messages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {HINTS.slice(0, 3).map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(h.text)}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                  >
                    {h.emoji} {h.text}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mt-4"
          >
            <div className="rounded-2xl rounded-bl-md bg-white border border-slate-100 px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-teal-500" />
              <span className="text-slate-500 text-sm">Думаю...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Поле ввода */}
      <div className="shrink-0 p-4 pt-2 pb-6 bg-white/90 backdrop-blur-md border-t border-slate-100">
        <div className="flex gap-2 items-end max-w-2xl mx-auto">
          <button
            type="button"
            onClick={listening ? stopVoice : startVoice}
            className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all ${
              listening
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
            placeholder="Напишите сообщение или выберите тему ниже"
            rows={1}
            className="flex-1 min-h-[48px] max-h-28 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
            disabled={loading}
          />
          <motion.button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md disabled:opacity-50 disabled:pointer-events-none hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <Send size={22} strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
