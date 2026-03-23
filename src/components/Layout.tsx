import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, User } from 'lucide-react'
import { useStore, type TabId } from '../store/useStore'
import { motion } from 'framer-motion'

const tabs: { id: TabId; path: string; label: string; icon: typeof Home }[] = [
  { id: 'home', path: '/', label: 'Главная', icon: Home },
  { id: 'shop', path: '/shop', label: 'Магазин', icon: ShoppingBag },
  { id: 'profile', path: '/profile', label: 'Профиль', icon: User },
]

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setActiveTab } = useStore()

  const handleTabClick = (tab: TabId, path: string) => {
    setActiveTab(tab)
    navigate(path)
  }

  return (
    <div className="flex flex-col h-full min-h-screen min-h-[100dvh] bg-white">
      <main
        className="flex-1 overflow-auto"
        style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
      >
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 bg-white/95 supports-[backdrop-filter]:bg-white/85 backdrop-blur-md border-t border-slate-200/80 shadow-soft z-50"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map(({ id, path, label, icon: Icon }) => {
            const isActive = location.pathname === path || (path === '/' && location.pathname === '/')
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabClick(id, path)}
                className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 min-w-0"
              >
                {isActive ? (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                ) : null}
                <Icon
                  size={24}
                  className={isActive ? 'text-blue-600' : 'text-slate-400'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs font-medium ${isActive ? 'text-slate-800' : 'text-slate-500'}`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
