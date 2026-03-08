import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { Profile } from './pages/Profile'
import { Coach } from './pages/Coach'
import { Designer } from './pages/Designer'
import { Slovoed } from './pages/Slovoed'
import { QuizList } from './pages/QuizList'
import { QuizEditor } from './pages/QuizEditor'
import { QuizPlay } from './pages/QuizPlay'
import { useStore } from './store/useStore'
import { initTelegramWebApp, getTelegramUser } from './telegram'
import { ensureSupabaseSession, updateProfileInSupabase } from './lib/supabaseAuth'

function App() {
  const setUser = useStore((s) => s.setUser)
  const setProfileFromDb = useStore((s) => s.setProfileFromDb)
  const [dbProfileLoaded, setDbProfileLoaded] = useState(false)

  useEffect(() => {
    initTelegramWebApp()
    const user = getTelegramUser()
    if (user) {
      setUser(user.name, user.avatar)
    }
  }, [setUser])

  // Supabase: сессия и загрузка профиля из БД
  useEffect(() => {
    let cancelled = false
    ensureSupabaseSession().then((profile) => {
      if (cancelled || !profile) return
      setProfileFromDb({
        balance: profile.balance,
        user_name: profile.user_name,
        avatar_url: profile.avatar_url,
        subscription_status: profile.subscription_status,
        generations: profile.generations,
        earned: profile.earned,
        slovoed_free_used_today: profile.slovoed_free_used_today,
        slovoed_last_date: profile.slovoed_last_date,
      })
      setDbProfileLoaded(true)
    })
    return () => { cancelled = true }
  }, [setProfileFromDb])

  // Синхронизация профиля в Supabase при изменении (только после первой загрузки из БД)
  const balance = useStore((s) => s.balance)
  const userName = useStore((s) => s.userName)
  const userAvatar = useStore((s) => s.userAvatar)
  const subscriptionStatus = useStore((s) => s.subscriptionStatus)
  const generations = useStore((s) => s.generations)
  const earned = useStore((s) => s.earned)
  const slovoedFreeUsedToday = useStore((s) => s.slovoedFreeUsedToday)
  const slovoedLastDate = useStore((s) => s.slovoedLastDate)

  useEffect(() => {
    if (!dbProfileLoaded) return
    updateProfileInSupabase({
      balance,
      user_name: userName,
      avatar_url: userAvatar ?? null,
      subscription_status: subscriptionStatus,
      generations,
      earned,
      slovoed_free_used_today: slovoedFreeUsedToday,
      slovoed_last_date: slovoedLastDate || null,
    })
  }, [dbProfileLoaded, balance, userName, userAvatar, subscriptionStatus, generations, earned, slovoedFreeUsedToday, slovoedLastDate])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/coach" element={<Coach />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/slovoed" element={<Slovoed />} />
        <Route path="/quiz" element={<QuizList />} />
        <Route path="/quiz/:id" element={<QuizEditor />} />
        <Route path="/q/:id" element={<QuizPlay />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
