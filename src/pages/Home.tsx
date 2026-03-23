import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { Zap, Sparkles, ChevronRight, MessageCircle, Palette, Mic, Trophy, ArrowRight } from 'lucide-react'
import { tools } from '../data/tools'
import { useStore } from '../store/useStore'
import { Character } from '../components/Character'

const toolIcons: Record<string, typeof Mic> = {
  slovoed: Mic,
  designer: Palette,
  coach: MessageCircle,
  quizmaster: Trophy,
}

const STEPS = [
  { num: '01', icon: Sparkles, title: 'Выберите', text: 'Свайпните и выберите нужного помощника' },
  { num: '02', icon: MessageCircle, title: 'Опишите', text: 'Отправьте запрос голосом или текстом' },
  { num: '03', icon: Zap, title: 'Получите', text: 'AI обработает запрос и вернёт результат' },
]

function HomeHeader({ balance }: { balance: number }) {
  const { userAvatar, userName } = useStore()

  return (
    <header className="sticky top-0 z-20 bg-white/75 backdrop-blur-xl border-b border-slate-100/80">
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
      <div className="flex items-center justify-between h-14 px-4 gap-4">
        <div className="flex flex-col min-w-0">
          <h1 className="text-slate-900 font-bold text-lg tracking-tight truncate">AI Tools</h1>
          <p className="text-[11px] text-slate-500 -mt-0.5">Твои AI-помощники</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-1.5 hover:bg-amber-100/60 transition-colors"
          >
            <Zap className="text-amber-500" size={16} strokeWidth={2.5} />
            <span className="font-semibold text-slate-800 text-sm tabular-nums">{balance}</span>
          </Link>
          <Link
            to="/profile"
            className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 ring-2 ring-white shadow-sm flex items-center justify-center active:scale-[0.97] transition-transform"
            aria-label="Профиль"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-600 font-semibold text-sm">
                {userName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Home() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [, setDirection] = useState(0)
  const balance = useStore((s) => s.balance)
  const dragOffset = useMotionValue(0)
  const rotate = useTransform(dragOffset, [-120, 120], [-4, 4])

  const handleToolAction = useCallback((toolId: string) => {
    if (toolId === 'slovoed') navigate('/slovoed')
    if (toolId === 'coach') navigate('/coach')
    if (toolId === 'designer') navigate('/designer')
    if (toolId === 'quizmaster') navigate('/quiz')
  }, [navigate])

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(index, tools.length - 1))
    setDirection(next > currentIndex ? 1 : -1)
    setCurrentIndex(next)
  }, [currentIndex])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 50
      if (info.offset.x > threshold) goTo(currentIndex - 1)
      else if (info.offset.x < -threshold) goTo(currentIndex + 1)
    },
    [currentIndex, goTo],
  )

  const currentTool = tools[currentIndex]

  return (
    <div className="min-h-full pb-6 relative">
      {/* Flow-фон с плавающими формами */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-violet-50/40" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        />
        <motion.div
          className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-indigo-200/25 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-violet-200/20 blur-3xl"
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-44 h-44 rounded-full bg-amber-100/25 blur-3xl"
          animate={{ y: [0, 14, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
        <HomeHeader balance={balance} />

        {/* Герой-секция */}
        <motion.div
          className="px-4 pt-5 pb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-slate-800 font-bold text-xl">Помощники</h2>
          <p className="text-slate-500 text-sm mt-0.5">Свайпните, чтобы выбрать AI-агента</p>
        </motion.div>

        {/* Карусель — открытая, без рамки */}
        <section className="relative min-h-[480px] touch-pan-x" aria-label="Карусель помощников">
          <motion.div
            className="relative mx-auto"
            style={{ height: 460, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(e, info) => {
              handleDragEnd(e, info)
              dragOffset.set(0)
            }}
            onDrag={(_, info) => dragOffset.set(info.offset.x)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTool.id}
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="absolute inset-0 flex justify-center"
              >
                <div className="absolute flex flex-col items-center justify-start pt-1 left-1/2 w-[280px]" style={{ marginLeft: -140 }}>
                  {/* Речевое облачко */}
                  <motion.div
                    className="relative mb-3 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 border border-white/80 text-center max-w-[260px]"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.12, duration: 0.25 }}
                  >
                    <p className="text-sm text-slate-700 leading-snug font-medium">{currentTool.description}</p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-r border-b border-white/60 rotate-45 rounded-sm shadow-sm" />
                  </motion.div>

                  {/* Персонаж */}
                  <div className="w-full aspect-[3/4] max-h-[280px]">
                    <Character
                      imageUrl={currentTool.characterImage}
                      accentColor={currentTool.accentColor}
                      name={currentTool.characterName}
                      toolId={currentTool.id}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Кнопка */}
                  <motion.button
                    type="button"
                    onClick={() => handleToolAction(currentTool.id)}
                    className="mt-4 w-full py-3.5 rounded-2xl font-semibold text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${currentTool.accentColor}, ${currentTool.accentColor}dd)`,
                      boxShadow: `0 8px 24px -4px ${currentTool.accentColor}40`,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {currentTool.actionLabel}
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Имя + точки */}
        <motion.div
          className="flex flex-col items-center gap-2.5 -mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTool.characterName}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-base font-bold text-slate-800"
            >
              {currentTool.characterName}
            </motion.p>
          </AnimatePresence>
          <div className="flex justify-center gap-2">
            {tools.map((tool, i) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => goTo(i)}
                className="relative h-2.5 rounded-full transition-all duration-300"
                style={{ width: i === currentIndex ? 28 : 10 }}
                aria-label={`${tool.characterName}`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: i === currentIndex
                      ? `linear-gradient(90deg, ${tool.accentColor}, ${tool.accentColor}cc)`
                      : '#cbd5e1',
                  }}
                  layoutId={i === currentIndex ? 'dot-active' : undefined}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Как пользоваться */}
        <motion.section
          className="mx-4 mt-8 rounded-3xl bg-white/85 backdrop-blur border border-white/80 shadow-lg shadow-slate-200/40 p-5 overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-sm font-bold text-slate-800 mb-4">Как это работает</h3>
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  className="flex items-start gap-3.5"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/80 text-indigo-500">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                    <p className="text-[13px] text-slate-500 mt-0.5">{step.text}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Все инструменты */}
        <motion.section
          className="mx-4 mt-4 mb-2 rounded-3xl bg-white/85 backdrop-blur border border-white/80 shadow-lg shadow-slate-200/40 p-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h3 className="text-sm font-bold text-slate-800 mb-3">Все инструменты</h3>
          <ul className="space-y-2">
            {tools.map((tool, i) => {
              const Icon = toolIcons[tool.id] || Mic
              return (
                <li key={tool.id}>
                  <motion.button
                    type="button"
                    onClick={() => goTo(i)}
                    className="w-full flex items-center gap-3 rounded-2xl py-3 px-3.5 text-left hover:bg-slate-50/80 active:bg-slate-100/80 transition-colors"
                    whileTap={{ scale: 0.99 }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${tool.accentColor}, ${tool.accentColor}cc)`,
                        boxShadow: `0 4px 12px -2px ${tool.accentColor}35`,
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{tool.title}</p>
                      <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                    </div>
                    <ChevronRight className="text-slate-400 shrink-0" size={18} />
                  </motion.button>
                </li>
              )
            })}
          </ul>
        </motion.section>
      </div>
    </div>
  )
}
