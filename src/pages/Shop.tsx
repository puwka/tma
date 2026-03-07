import { useState } from 'react'
import { Zap, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Toast } from '../components/Toast'

const TARIFFS = [
  { id: 'light', name: 'Light', neurons: 30, price: '99 ₽', popular: false },
  { id: 'starter', name: 'Starter', neurons: 100, price: '249 ₽', popular: false },
  { id: 'standard', name: 'Standard', neurons: 300, price: '599 ₽', popular: false },
  { id: 'pro', name: 'PRO', neurons: 500, price: '899 ₽', popular: true },
]

export function Shop() {
  const [toastVisible, setToastVisible] = useState(false)
  const { addBalance } = useStore()

  const handleBuy = (neurons: number) => {
    addBalance(neurons)
    setToastVisible(true)
  }

  return (
    <div className="min-h-full px-4 pt-6 pb-8">
      <h1 className="text-xl font-bold text-slate-800 mb-1">Магазин</h1>
      <p className="text-slate-500 text-sm mb-8">Пакеты нейронов для AI-инструментов</p>

      <div className="space-y-4">
        {TARIFFS.map((tariff) => (
          <div
            key={tariff.id}
            className={`rounded-2xl bg-slate-50 border-2 p-5 shadow-sm transition-shadow ${
              tariff.popular ? 'border-orange-400 bg-orange-50/50' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{tariff.name}</span>
                {tariff.popular && (
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    Популярный
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-amber-600">
                <Zap size={18} />
                <span className="font-bold">{tariff.neurons}</span>
                <span className="text-slate-500 text-sm">нейронов</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-700">{tariff.price}</span>
              <button
                type="button"
                onClick={() => handleBuy(tariff.neurons)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md active:scale-[0.98] transition-transform"
              >
                <Check size={18} />
                Купить
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toast
        message="Оплата в разработке. Баланс пополнен тестово!"
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  )
}
