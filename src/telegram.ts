/**
 * Инициализация Telegram Web App (TWA) через @twa-dev/sdk.
 * В браузере вне Telegram WebApp может быть недоступен — обрабатываем безопасно.
 */

import WebApp from '@twa-dev/sdk'

export function initTelegramWebApp() {
  if (typeof window === 'undefined') return null
  try {
    WebApp.ready()
    WebApp.expand()
    return WebApp
  } catch {
    return null
  }
}

export function getTelegramUser(): { name: string; avatar?: string } | null {
  try {
    const user = WebApp.initDataUnsafe?.user
    if (!user) return null
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
    return {
      name: name || 'Пользователь',
      avatar: user.photo_url,
    }
  } catch {
    return null
  }
}
