import { useEffect } from 'react'
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

function App() {
  const setUser = useStore((s) => s.setUser)

  useEffect(() => {
    initTelegramWebApp()
    const user = getTelegramUser()
    if (user) {
      setUser(user.name, user.avatar)
    }
  }, [setUser])

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
