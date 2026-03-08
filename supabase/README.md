# Supabase для TMA

## Создание таблиц

1. Откройте [Supabase Dashboard](https://app.supabase.com) → ваш проект.
2. Перейдите в **SQL Editor** → **New query**.
3. Скопируйте содержимое `migrations/001_initial_schema.sql` и выполните запрос (Run).

После выполнения будут созданы:

- **profiles** — пользователи (баланс, нейроны, Словоед, данные из Telegram).
- **coach_sessions** + **coach_messages** — сессии и сообщения AI-Coach.
- **designer_sessions** — сессии Дизайнера (карусель).
- **quizzes** + **quiz_start_pages**, **quiz_questions**, **quiz_question_options**, **quiz_result_variants**, **quiz_thank_you_pages** — квизы и их контент.
- **quiz_leads** — заявки (контакты), собранные с квизов.

Включены RLS-политики: доступ к своим данным по `auth.uid()`. Опубликованные квизы доступны на чтение всем (для страницы прохождения `/q/:slug`).

## Анонимный вход (для сохранения данных из TMA)

Приложение использует **Anonymous Sign-In**: при первом заходе создаётся анонимный пользователь и строка в `profiles` с `id = auth.uid()`. Данные профиля (баланс, нейроны, Словоед, имя из Telegram) сохраняются в БД и подтягиваются при следующем заходе (в том же браузере/устройстве).

1. В Supabase Dashboard откройте **Authentication** → **Providers**.
2. Включите **Anonymous Sign-In** (Enable).

После этого при наличии `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` в `.env` данные профиля будут сохраняться в таблицу `profiles`.

## Переменные окружения

В `.env` добавьте (значения в Dashboard → Settings → API):

- `VITE_SUPABASE_URL` — URL проекта.
- `VITE_SUPABASE_ANON_KEY` — anon (public) key.

## Связка с Telegram

Сейчас политики завязаны на `auth.uid()`. Чтобы привязать пользователя к Telegram:

1. **Вариант A:** Использовать Supabase Auth и при регистрации из TMA создавать пользователя (например, по `telegram_user_id` в metadata), затем писать в `profiles` с `id = auth.uid()`.
2. **Вариант B:** Бэкенд (Edge Function или ваш сервер) по Telegram user id создаёт/находит `profiles`, выдаёт JWT с `sub = profiles.id`; клиент ходит в Supabase с этим JWT.

После этого текущие RLS-политики будут корректно ограничивать доступ по пользователю.
