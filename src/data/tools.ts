import type { LucideIcon } from 'lucide-react'
import { Mic, Palette, MessageCircle, Trophy } from 'lucide-react'

export interface ToolItem {
  id: string
  title: string
  description: string
  actionLabel: string
  icon: LucideIcon
  /** Цвет акцента персонажа (для заглушки и кнопок) */
  accentColor: string
  /** Имя персонажа-маскота */
  characterName: string
  /** URL картинки персонажа — подставьте свой маскот */
  characterImage?: string | null
}

export const tools: ToolItem[] = [
  {
    id: 'slovoed',
    title: 'Словоед / Транскрибатор',
    description: 'Превращаю голос в текст и обрабатываю любой текст.',
    actionLabel: 'Транскрибировать',
    icon: Mic,
    accentColor: '#3b82f6',
    characterName: 'Словоед',
  },
  {
    id: 'designer',
    title: 'Дизайнер',
    description: 'Создаю картинки и визуал по вашему запросу.',
    actionLabel: 'Открыть студию',
    icon: Palette,
    accentColor: '#8b5cf6',
    characterName: 'Дизайнер',
  },
  {
    id: 'coach',
    title: 'AI-Coach',
    description: 'Помогаю с целями, привычками и мотивацией.',
    actionLabel: 'Начать сессию',
    icon: MessageCircle,
    accentColor: '#14b8a6',
    characterName: 'AI-Coach',
  },
  {
    id: 'quizmaster',
    title: 'Квизмастер',
    description: 'Генерирую квизы и тесты для обучения.',
    actionLabel: 'Создать квиз',
    icon: Trophy,
    accentColor: '#f59e0b',
    characterName: 'Квизмастер',
  },
]
