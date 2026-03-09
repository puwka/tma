import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sparkles, Mic, MessageCircle, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    icon: Zap,
    title: 'Добро пожаловать в AI Tools',
    text: 'Несколько помощников с нейросетями в одном мини-приложении: голос в текст, картинки, коучинг и квизы.',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
  },
  {
    icon: Sparkles,
    title: 'Нейроны — ваша валюта',
    text: 'Тратьте нейроны на генерации. Часть инструментов даёт бесплатные попытки в день, остальное — по тарифам в магазине.',
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
  },
  {
    icon: Mic,
    title: 'Словоед, Дизайнер, Коуч, Квизы',
    text: 'Свайпайте карусель на главной, выберите инструмент и нажмите кнопку. Можно вводить текст или говорить голосом.',
    color: 'from-indigo-500 to-blue-600',
    bgLight: 'bg-indigo-50',
  },
  {
    icon: MessageCircle,
    title: 'Всё готово',
    text: 'Нажмите «Начать» — попадёте на главный экран с помощниками. Удачи!',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
]

const ONBOARDING_KEY = 'tma-onboarding-done'

export function getOnboardingDone(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDING_KEY) === '1'
}

export function setOnboardingDone(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ONBOARDING_KEY, '1')
}

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const current = SLIDES[step]
  const Icon = current.icon
  const isLast = step === SLIDES.length - 1

  const handleNext = () => {
    if (isLast) {
      setOnboardingDone()
      onComplete()
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleSkip = () => {
    setOnboardingDone()
    onComplete()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex justify-end px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm font-medium text-slate-500 hover:text-slate-700 py-2 px-3 -mr-3"
        >
          Пропустить
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-xl mb-6`}
            >
              <Icon className="text-white" size={44} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{current.title}</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">{current.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <motion.button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          {isLast ? 'Начать' : 'Далее'}
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  )
}
