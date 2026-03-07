/**
 * 10 стилей с визуальным превью для Дизайнера.
 * Превью — CSS-композиция (градиенты, формы), передаётся в промпт при генерации.
 */

export interface DesignStyle {
  id: string
  name: string
  promptHint: string
  /** Классы для превью-карточки (фон + декор) */
  previewClass: string
  /** Внутренний контент превью (опционально) */
  previewInner?: 'dots' | 'lines' | 'circle' | 'grid' | 'wave' | 'none'
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: 'minimal',
    name: 'Минимализм',
    promptHint: 'минималистичный дизайн, много воздуха, один акцент, чистые линии',
    previewClass: 'bg-white border-2 border-slate-200',
    previewInner: 'circle',
  },
  {
    id: 'gradient',
    name: 'Градиент',
    promptHint: 'яркие градиенты, плавные переходы цветов, современный flat',
    previewClass: 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-600',
    previewInner: 'none',
  },
  {
    id: 'neon',
    name: 'Неон',
    promptHint: 'неоновые огни, тёмный фон, кислотные акценты, киберпанк',
    previewClass: 'bg-slate-900',
    previewInner: 'dots',
  },
  {
    id: 'vintage',
    name: 'Винтаж',
    promptHint: 'винтажная эстетика, потертости, тёплые оттенки, ретро типографика',
    previewClass: 'bg-amber-100',
    previewInner: 'lines',
  },
  {
    id: 'abstract',
    name: 'Абстракт',
    promptHint: 'абстрактные формы, Кандинский, геометрия, художественная композиция',
    previewClass: 'bg-gradient-to-tr from-rose-300 via-amber-200 to-cyan-300',
    previewInner: 'grid',
  },
  {
    id: 'japanese',
    name: 'Японский',
    promptHint: 'японская эстетика, ваби-саби, иероглифы, приглушённые цвета, природа',
    previewClass: 'bg-stone-200',
    previewInner: 'lines',
  },
  {
    id: 'grunge',
    name: 'Гранж',
    promptHint: 'гранж, текстуры, контраст, рукописные элементы, брутализм',
    previewClass: 'bg-zinc-700',
    previewInner: 'wave',
  },
  {
    id: 'cosmos',
    name: 'Космос',
    promptHint: 'космос, звёзды, туманности, глубокий синий, футуризм',
    previewClass: 'bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900',
    previewInner: 'dots',
  },
  {
    id: 'watercolor',
    name: 'Акварель',
    promptHint: 'акварельная живопись, размытые переходы, мягкие цвета, арт',
    previewClass: 'bg-gradient-to-br from-sky-200 via-pink-100 to-lime-200',
    previewInner: 'wave',
  },
  {
    id: 'mono',
    name: 'Монохром',
    promptHint: 'монохром, чёрно-белый или один цвет, контраст, типографика',
    previewClass: 'bg-slate-800',
    previewInner: 'lines',
  },
]
