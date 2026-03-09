import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Zap, Sparkles, ChevronRight, MessageCircle, Palette, Mic, Trophy } from 'lucide-react'
import { tools } from '../data/tools'
import type { ToolItem } from '../data/tools'
import { useStore } from '../store/useStore'
import { Character } from '../components/Character'

const CARD_WIDTH = 280

function ToolSlide({
  tool,
  onAction,
}: {
  tool: ToolItem
  onAction: () => void
}) {
  return (
    <motion.div
      className="absolute flex flex-col items-center justify-start pt-2 left-1/2"
      style={{
        width: CARD_WIDTH,
        marginLeft: -CARD_WIDTH / 2,
      }}
    >
      {/* Облачко */}
      <motion.div
        className="relative mb-2 px-4 py-2.5 rounded-2xl bg-white shadow-soft border border-slate-100 text-center max-w-[260px]"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-sm text-slate-600 leading-snug">{tool.description}</p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45 rounded-sm" />
      </motion.div>

      {/* Персонаж */}
      <div className="w-full aspect-[3/4] max-h-[300px] rounded-3xl overflow-hidden">
        <Character
          imageUrl={tool.characterImage}
          accentColor={tool.accentColor}
          name={tool.characterName}
          className="w-full h-full"
        />
      </div>

      {/* Кнопка действия */}
      <motion.button
        type="button"
        onClick={onAction}
        className="mt-3 w-full py-3.5 rounded-2xl font-semibold text-white shadow-md active:scale-[0.98] transition-transform"
        style={{ background: tool.accentColor }}
        whileTap={{ scale: 0.98 }}
      >
        {tool.actionLabel}
      </motion.button>
    </motion.div>
  )
}

const STEPS = [
  { icon: Sparkles, text: 'Выберите инструмент и нажмите кнопку' },
  { icon: MessageCircle, text: 'Отправьте запрос голосом или текстом' },
  { icon: Zap, text: 'Получите результат и тратьте нейроны по делу' },
]

const toolIcons: Record<string, typeof Mic> = { slovoed: Mic, designer: Palette, coach: MessageCircle, quizmaster: Trophy }

const APP_NAME = 'AI Tools'

function HomeHeader({ balance }: { balance: number }) {
  const { userAvatar, userName } = useStore()

  return (
    <header className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-slate-900 font-bold text-[20px] tracking-tight truncate">
          {APP_NAME}
        </h1>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-1.5"
          >
            <Zap className="text-amber-500" size={18} strokeWidth={2.5} />
            <span className="font-semibold text-slate-800 text-sm tabular-nums">{balance}</span>
          </Link>
          <Link
            to="/profile"
            className="relative flex shrink-0 rounded-full overflow-hidden ring-2 ring-slate-200/80 ring-offset-2 ring-offset-white w-10 h-10 bg-slate-100 active:scale-[0.97] transition-transform"
            aria-label="Профиль"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-slate-600 font-semibold text-base">
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
  const rotate = useTransform(dragOffset, [-120, 120], [-6, 6])

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
    [currentIndex, goTo]
  )

  const currentTool = tools[currentIndex]

  return (
    <div className="min-h-full pb-6 relative">
      {/* Тематический фон приложения: AI, нейросети, инструменты */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-white to-indigo-50/30" />
        {/* Точки-узлы (нейросеть) */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1.5px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Мягкие пятна */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-violet-200/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-amber-100/20 rounded-full blur-2xl" />
        {/* Декоративные иконки по тематике (очень лёгкие) */}
        <div className="absolute top-20 left-[10%] opacity-[0.08]">
          <Sparkles className="text-indigo-500" size={28} strokeWidth={1.5} />
        </div>
        <div className="absolute top-32 right-[15%] opacity-[0.07]">
          <Zap className="text-amber-500" size={24} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-40 left-[20%] opacity-[0.06]">
          <MessageCircle className="text-violet-500" size={22} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-24 right-[12%] opacity-[0.07]">
          <Sparkles className="text-indigo-400" size={20} strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative z-10">
      {/* Шапка: название приложения + аватарка из Telegram */}
      <HomeHeader balance={balance} />

      {/* Заголовок карусели */}
      <div className="px-4 mb-2">
        <h2 className="text-slate-800 font-semibold text-[15px]">Помощники</h2>
        <p className="text-slate-400 text-[13px] mt-0.5">Свайпните влево/вправо по карточке</p>
      </div>

      {/* Зона карусели: отдельный блок с фоном и только горизонтальным свайпом */}
      <section
        className="relative mx-4 rounded-3xl overflow-hidden min-h-[500px] border-2 border-slate-200/80 shadow-xl shadow-slate-200/50 touch-pan-x"
        aria-label="Карусель помощников"
      >
        {/* Фон: градиент + декоративные элементы */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/80" />
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {/* Мягкие круги на фоне */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-indigo-200/30 blur-2xl" />
          <div className="absolute top-1/3 -right-8 w-32 h-32 rounded-full bg-violet-200/25 blur-2xl" />
          <div className="absolute bottom-8 left-1/4 w-24 h-24 rounded-full bg-amber-200/20 blur-xl" />
          {/* Сетка-декор */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Полупрозрачные дуги */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-100/40 to-transparent rounded-b-3xl" />
        </div>

        {/* Карусель */}
        <motion.div
          className="relative mx-auto"
          style={{ height: 480, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            handleDragEnd(e, info)
            dragOffset.set(0)
          }}
          onDrag={(_, info) => dragOffset.set(info.offset.x)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tools[currentIndex].id}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex justify-center"
            >
              <ToolSlide
                tool={tools[currentIndex]}
                onAction={() => handleToolAction(tools[currentIndex].id)}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Точки и название текущего инструмента */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-sm font-semibold text-slate-700">{currentTool.characterName}</p>
        <div className="flex justify-center gap-2">
          {tools.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Инструмент ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Как пользоваться */}
      <motion.section
        className="mx-4 mt-8 rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-sm font-bold text-slate-800 mb-3">Как пользоваться</h3>
        <ul className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600">
                  <Icon size={16} />
                </span>
                <span className="text-sm text-slate-600">{step.text}</span>
              </li>
            )
          })}
        </ul>
      </motion.section>

      {/* Быстрые действия — все инструменты списком */}
      <motion.section
        className="mx-4 mt-4 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-sm font-bold text-slate-800 mb-3">Все инструменты</h3>
        <ul className="space-y-2">
          {tools.map((tool, i) => {
            const Icon = toolIcons[tool.id] || Mic
            return (
              <li key={tool.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="w-full flex items-center gap-3 rounded-xl py-2.5 px-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: tool.accentColor }}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{tool.title}</p>
                    <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                  </div>
                  <ChevronRight className="text-slate-400 shrink-0" size={18} />
                </button>
              </li>
            )
          })}
        </ul>
      </motion.section>
      </div>
    </div>
  )
}
