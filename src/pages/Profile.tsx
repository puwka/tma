import { Link } from 'react-router-dom'
import { Zap, Users, History, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'

export function Profile() {
  const { userName, userAvatar, subscriptionStatus, balance, generations, earned } = useStore()

  return (
    <div className="min-h-full px-4 pt-6 pb-8">
      <h1 className="text-xl font-bold text-slate-800 mb-8">Профиль</h1>

      {/* Аватар и имя */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-soft flex items-center justify-center">
          {userAvatar ? (
            <img src={userAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-slate-500">
              {userName.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <h2 className="mt-3 font-semibold text-slate-800">{userName}</h2>
        <p className="text-sm text-slate-500">{subscriptionStatus}</p>
      </div>

      {/* Баланс */}
      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 shadow-sm mb-4">
        <p className="text-sm text-slate-500 mb-1">Ваш баланс</p>
        <p className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="text-amber-500" size={28} />
          {balance} нейронов
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-0.5">Генераций</p>
          <p className="text-lg font-bold text-slate-800">{generations}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-0.5">Заработано</p>
          <p className="text-lg font-bold text-slate-800">{earned}</p>
        </div>
      </div>

      {/* Кнопка купить нейроны */}
      <Link
        to="/shop"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-transform mb-8"
      >
        <Zap size={20} />
        Купить нейроны
      </Link>

      {/* Меню */}
      <div className="rounded-2xl bg-slate-50 border border-slate-100 shadow-sm overflow-hidden">
        <a
          href="#"
          className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 active:bg-slate-100/80"
        >
          <div className="flex items-center gap-3">
            <Users className="text-slate-500" size={22} />
            <span className="font-medium text-slate-800">Партнёры</span>
          </div>
          <ChevronRight className="text-slate-400" size={20} />
        </a>
        <a
          href="#"
          className="flex items-center justify-between px-4 py-3.5 active:bg-slate-100/80"
        >
          <div className="flex items-center gap-3">
            <History className="text-slate-500" size={22} />
            <span className="font-medium text-slate-800">История транзакций</span>
          </div>
          <ChevronRight className="text-slate-400" size={20} />
        </a>
      </div>
    </div>
  )
}
