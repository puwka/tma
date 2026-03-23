import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Check, CreditCard, Sparkles, Package, Info } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Toast } from '../components/Toast'

const TARIFFS = [
  { id: 'light', name: 'Light', neurons: 30, price: '99 ₽', popular: false },
  { id: 'starter', name: 'Starter', neurons: 100, price: '249 ₽', popular: false },
  { id: 'standard', name: 'Standard', neurons: 300, price: '599 ₽', popular: false },
  { id: 'pro', name: 'PRO', neurons: 500, price: '899 ₽', popular: true },
] as const

const PLAN_PACKS = [
  { id: 'free', title: 'FREE', subtitle: 'Для старта', price: '0 ₽/мес' },
  { id: 'plus', title: 'PLUS', subtitle: 'Больше бесплатных лимитов', price: '790 ₽/мес' },
  { id: 'pro', title: 'PRO', subtitle: 'Максимум лимитов и низкая цена', price: '1590 ₽/мес' },
] as const

function formatNeurons(n: number) {
  return `${n} нейрон${n % 10 === 1 && n % 100 !== 11 ? '' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'а' : 'ов'}`
}

export function Shop() {
  const [toastVisible, setToastVisible] = useState(false)
  const [planToastVisible, setPlanToastVisible] = useState(false)
  const { addBalance, balance, planId, setPlan, getToolPrice, getToolDailyFreeLimit } = useStore()

  const maxNeurons = useMemo(() => Math.max(...TARIFFS.map((t) => t.neurons)), [])
  const balancePct = Math.min(100, (balance / (maxNeurons || 1)) * 100)

  const handleBuy = (neurons: number) => {
    addBalance(neurons)
    setToastVisible(true)
  }

  const handlePlan = (plan: 'free' | 'plus' | 'pro') => {
    setPlan(plan)
    setPlanToastVisible(true)
  }

  return (
    <div className="min-h-full relative overflow-hidden pb-10">
      {/* Flow-фон */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/60 via-white to-indigo-50/30" />
        <motion.div
          className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-orange-200/25 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -left-16 w-72 h-72 rounded-full bg-indigo-200/18 blur-3xl"
          animate={{ y: [0, -16, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 px-4 pt-6">
        <header className="sticky top-0 z-10 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Магазин</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Пакеты нейронов для AI-инструментов</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur border border-slate-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles size={12} /> Баланс: {balance}
            </span>
          </div>
          <div className="h-0.5 mt-3 bg-gradient-to-r from-orange-500 via-amber-400 to-indigo-500 rounded" />
        </header>

        {/* Баланс прогресс */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 rounded-3xl bg-white/80 backdrop-blur border border-slate-100 shadow-lg shadow-slate-200/40 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Готовность к генерациям</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Zap className="text-amber-500" size={26} />
                {Math.round(balancePct)}%
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CreditCard size={16} className="text-slate-400" />
              <span>Пополняйте когда нужно</span>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100 border border-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${balancePct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.section>

        {/* Тарифы */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.35 }}
          className="mt-4 rounded-3xl bg-white/80 backdrop-blur border border-slate-100 shadow-sm p-4"
        >
          <h2 className="text-sm font-semibold text-slate-900 mb-2">Планы</h2>
          <p className="text-xs text-slate-500 mb-3">План влияет на бесплатные лимиты и цену за запрос.</p>
          <div className="space-y-2.5">
            {PLAN_PACKS.map((plan) => {
              const active = planId === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlan(plan.id)}
                  className={`w-full text-left rounded-2xl border-2 px-3.5 py-3 transition-colors ${
                    active ? 'border-indigo-300 bg-indigo-50/70' : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{plan.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700">{plan.price}</p>
                      {active && <p className="text-[11px] text-indigo-600 mt-0.5">Текущий</p>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.35 }}
          className="mt-4 space-y-3"
        >
          {TARIFFS.map((tariff, idx) => {
            const isPopular = tariff.popular
            return (
              <motion.div
                key={tariff.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
                whileHover={{ y: -2 }}
                className={`rounded-3xl border-2 p-4 shadow-sm transition-shadow ${
                  isPopular ? 'border-orange-300 bg-orange-50/50' : 'border-slate-100 bg-white/75'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isPopular ? 'bg-white border-orange-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Package size={20} className={isPopular ? 'text-orange-500' : 'text-slate-500'} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{tariff.name}</p>
                        {isPopular && (
                          <p className="text-[11px] font-semibold text-orange-700 bg-orange-100 border border-orange-200 rounded-full inline-flex px-2 py-0.5 mt-1">
                            Популярный
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Для активных генераций и быстрых запусков.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-slate-500">Нейроны</p>
                    <p className="text-lg font-bold text-slate-900 mt-1 flex items-center justify-end gap-2">
                      <Zap className={isPopular ? 'text-orange-500' : 'text-slate-500'} size={18} />
                      {formatNeurons(tariff.neurons)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] text-slate-500">Стоимость</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{tariff.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBuy(tariff.neurons)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white shadow-md active:scale-[0.98] transition-transform ${
                      isPopular
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                    }`}
                  >
                    <Check size={18} />
                    Купить
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="mt-4 rounded-3xl bg-white/80 backdrop-blur border border-slate-100 shadow-sm p-4 flex items-start gap-3"
        >
          <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 text-sm">Важно</p>
            <p className="text-sm text-slate-600 mt-1">
              Оплата в разработке: при нажатии баланс пополняется тестово (как заглушка).
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Пример экономики ({planId.toUpperCase()}): Словоед {getToolDailyFreeLimit('slovoed')} free / {getToolPrice('slovoed')}⚡, Дизайнер {getToolDailyFreeLimit('designer')} free / {getToolPrice('designer')}⚡.
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          <Toast
            message="Оплата в разработке. Баланс пополнен тестово!"
            visible={toastVisible}
            onClose={() => setToastVisible(false)}
          />
        </AnimatePresence>
        <AnimatePresence>
          <Toast
            message={`План ${planId.toUpperCase()} выбран (тестово).`}
            visible={planToastVisible}
            onClose={() => setPlanToastVisible(false)}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
