# AI Tools — Telegram Mini App (TMA)

Мини-приложение в стиле платформы с AI-инструментами для Telegram.

## Стек

- React 18 + TypeScript (Vite)
- Tailwind CSS, Framer Motion, React Router DOM, Zustand
- @twa-dev/sdk, Lucide React

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Сборка

```bash
npm run build
```

Артефакт в `dist/`.

## Деплой на Vercel

1. Подключите репозиторий к [Vercel](https://vercel.com) (Import Git Repository).
2. Framework Preset: **Vite** — подставится автоматически.
3. В **Settings → Environment Variables** добавьте переменные (для production и preview при необходимости):

   | Переменная | Описание |
   |------------|----------|
   | `VITE_NEUROAPI_API_KEY` | Ключ Neuro API (AI-Coach, Словоед) |
   | `VITE_KIE_API_KEY` | Ключ Kie.ai (Дизайнер) |
   | `VITE_SUPABASE_URL` | URL проекта Supabase |
   | `VITE_SUPABASE_ANON_KEY` | Anon-ключ Supabase |

4. Деплой: **Deploy**. Все маршруты SPA (/, /coach, /quiz, /q/:slug и т.д.) отдаются через `index.html` (настроено в `vercel.json`).

После деплоя укажите полученный URL в настройках бота Telegram (Web App URL).

## Структура

- `src/pages/` — Home (карусель инструментов), Shop (тарифы), Profile
- `src/components/` — Layout (нижнее меню), Toast
- `src/store/useStore.ts` — Zustand (баланс, пользователь, вкладка)
- `src/services/api/aiServices.ts` — заглушки API (generateText, transcribeAudio, generateImage)
- `src/telegram.ts` — инициализация TWA и данные пользователя
- `src/data/tools.ts` — список инструментов для карусели

Карточки персонажей на главной — заглушки с градиентом и иконкой; замените на свои изображения по необходимости.
