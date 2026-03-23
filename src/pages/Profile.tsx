import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Users, History, ChevronRight, Sparkles, Mic, Palette, MessageCircle, Trophy } from 'lucide-react'
import { useStore } from '../store/useStore'

export function Profile() {
  const {
    userName,
    userAvatar,
    subscriptionStatus,
    planId,
    balance,
    generations,
    earned,
    getToolFreeRemaining,
    getToolDailyFreeLimit,
    getToolPrice,
  } = useStore()

  const economyRows = [
    { id: 'slovoed', title: 'Словоед', icon: Mic },
    { id: 'designer', title: 'Дизайнер', icon: Palette },
    { id: 'coach', title: 'AI-Coach', icon: MessageCircle },
    { id: 'quizmaster', title: 'Квизмастер', icon: Trophy },
  ] as const

  const initialLetter = userName?.slice(0, 1).toUpperCase() || 'П'

  return (
    <div className="min-h-full relative overflow-hidden pb-10">
      {/* Flow-фон */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/70 via-white to-emerald-50/30" />
        <motion.div
          className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-indigo-200/25 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -left-16 w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl"
          animate={{ y: [0, -16, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="relative z-10 px-4 pt-6">
        <header className="sticky top-0 z-10 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Профиль</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Твои нейроны и активность</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur border border-slate-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles size={12} /> {subscriptionStatus}
              </span>
            </div>
          </div>
          <div className="h-0.5 mt-3 bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400/80 rounded" />
        </header>

        {/* Аватар и имя */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 flex items-center gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/70 backdrop-blur border border-slate-100 shadow-soft flex items-center justify-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 20% 15%, ${balance > 0 ? '#6366f1' : '#14b8a6'}33, transparent 55%)` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {userAvatar ? (
              <img src={userAvatar} alt="" className="w-full h-full object-cover relative z-10" />
            ) : (
              <span className="text-2xl font-bold text-slate-600 relative z-10">{initialLetter}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-sm text-slate-500 mt-0.5">Тариф: {planId.toUpperCase()}</p>
          </div>
        </motion.div>

        {/* Баланс + прогресс */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mt-4 rounded-3xl bg-white/80 backdrop-blur border border-slate-100 shadow-lg shadow-slate-200/40 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Твой баланс</p>
              <p className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                <Zap className="text-amber-500" size={26} />
                {balance}
                <span className="text-base font-semibold text-slate-600">нейронов</span>
              </p>
            </div>
            <span className="rounded-2xl bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {balance >= 500 ? 'Высокий запас' : balance >= 150 ? 'Нормально' : 'Можно пополнить'}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>0</span>
              <span>1000</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{ width: `${Math.min(100, (balance / 1000) * 100)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (balance / 1000) * 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.section>

        {/* Экономика по инструментам */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07, duration: 0.35 }}
          className="mt-4 rounded-3xl bg-white/85 backdrop-blur border border-slate-100 shadow-sm p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Лимиты и стоимость</h3>
          <div className="space-y-2.5">
            {economyRows.map((row) => {
              const Icon = row.icon
              const freeLeft = getToolFreeRemaining(row.id)
              const freeTotal = getToolDailyFreeLimit(row.id)
              const price = getToolPrice(row.id)
              return (
                <div key={row.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 px-3.5 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-slate-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{row.title}</p>
                      <p className="text-xs text-slate-500">
                        Бесплатно: {freeLeft}/{freeTotal}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                    далее {price} ⚡
                  </p>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Статистика */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl bg-white/75 backdrop-blur border border-slate-100 shadow-sm p-4"
          >
            <p className="text-xs text-slate-500">Генераций</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{generations}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="rounded-3xl bg-white/75 backdrop-blur border border-slate-100 shadow-sm p-4"
          >
            <p className="text-xs text-slate-500">Заработано</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{earned}</p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.35 }}
          className="mt-4"
        >
          <Link
            to="/shop"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-transform"
          >
            <Zap size={20} />
            Пополнить нейроны
          </Link>
        </motion.div>

        {/* Меню */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="mt-4 rounded-3xl bg-white/80 backdrop-blur border border-slate-100 shadow-sm overflow-hidden"
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="text-slate-500" size={22} />
              <span className="font-medium text-slate-800">Партнёры</span>
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <History className="text-slate-500" size={22} />
              <span className="font-medium text-slate-800">История транзакций</span>
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </button>
        </motion.section>

        <AnimatePresence>
          {balance === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-3xl border border-amber-200/70 bg-amber-50/60 p-4"
            >
              <p className="text-sm font-semibold text-amber-800">Пока у вас нет нейронов</p>
              <p className="text-xs text-amber-800/80 mt-1">
                Зайдите в магазин и пополните баланс — генерации начнут работать сразу.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
