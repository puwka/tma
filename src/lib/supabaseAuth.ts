/**
 * Инициализация сессии Supabase и синхронизация профиля.
 * Использует анонимный вход (Anonymous Sign-In должен быть включён в Supabase: Auth → Providers → Anonymous).
 */

import { supabase, isSupabaseConfigured } from './supabase'
import { getTelegramUser, getTelegramUserId } from '../telegram'

export interface ProfileRow {
  id: string
  telegram_user_id: string | null
  user_name: string
  avatar_url: string | null
  balance: number
  subscription_status: string
  generations: number
  earned: number
  slovoed_free_used_today: number
  slovoed_last_date: string | null
}

export async function ensureSupabaseSession(): Promise<ProfileRow | null> {
  if (!supabase || !isSupabaseConfigured()) return null

  try {
    const { data: { session } } = await supabase.auth.getSession()
    let userId: string

    if (session?.user) {
      userId = session.user.id
    } else {
      const { data: anonData, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.warn('[Supabase] signInAnonymously failed:', error.message)
        return null
      }
      userId = anonData.user!.id
    }

    const telegramId = getTelegramUserId()
    const telegramUser = getTelegramUser()

    await supabase.from('profiles').upsert(
      {
        id: userId,
        telegram_user_id: telegramId ?? undefined,
        user_name: telegramUser?.name ?? 'Пользователь',
        avatar_url: telegramUser?.avatar ?? undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.warn('[Supabase] fetch profile failed:', error.message)
      return null
    }
    return profile as ProfileRow
  } catch (e) {
    console.warn('[Supabase] ensureSession error:', e)
    return null
  }
}

export async function updateProfileInSupabase(patch: Partial<ProfileRow>): Promise<void> {
  if (!supabase || !isSupabaseConfigured()) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  try {
    await supabase.from('profiles').update({
      ...patch,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
  } catch (e) {
    console.warn('[Supabase] updateProfile error:', e)
  }
}
