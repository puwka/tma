-- ============================================================
-- TMA (Telegram Mini App) — начальная схема для Supabase
-- Запуск: в Supabase Dashboard → SQL Editor вставьте этот файл
-- ============================================================

-- Расширение для генерации UUID (обычно уже включено в Supabase)
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. Профили пользователей (баланс, нейроны, Словоед, данные из Telegram)
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id text unique,
  user_name text not null default 'Пользователь',
  avatar_url text,
  balance int not null default 0 check (balance >= 0),
  subscription_status text not null default 'Бесплатный',
  generations int not null default 0,
  earned int not null default 0,
  slovoed_free_used_today int not null default 0,
  slovoed_last_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_telegram_user_id on public.profiles(telegram_user_id);

-- ------------------------------------------------------------
-- 2. Сессии AI-Coach
-- ------------------------------------------------------------
create table public.coach_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Новая сессия',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_coach_sessions_user_id on public.coach_sessions(user_id);

-- ------------------------------------------------------------
-- 3. Сообщения в сессиях Coach
-- ------------------------------------------------------------
create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.coach_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_coach_messages_session_id on public.coach_messages(session_id);

-- ------------------------------------------------------------
-- 4. Сессии Дизайнера (карусель)
-- ------------------------------------------------------------
create table public.designer_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Новая сессия',
  prompt text not null default '',
  selected_style_id text not null default 'minimal',
  scenario text not null default 'sales',
  cta_type text not null default 'keyword' check (cta_type in ('keyword', 'auto')),
  keyword text not null default 'ХОЧУ',
  cta_content text not null default '',
  result_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_designer_sessions_user_id on public.designer_sessions(user_id);

-- ------------------------------------------------------------
-- 5. Квизы
-- ------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null,
  title text not null default 'Новый квиз',
  published boolean not null default false,
  results_enabled boolean not null default false,
  contacts_enabled boolean not null default false,
  stats_opens int not null default 0,
  stats_leads int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug)
);

create index idx_quizzes_user_id on public.quizzes(user_id);
create unique index idx_quizzes_slug on public.quizzes(slug);

-- ------------------------------------------------------------
-- 6. Стартовая страница квиза (1:1)
-- ------------------------------------------------------------
create table public.quiz_start_pages (
  quiz_id uuid primary key references public.quizzes(id) on delete cascade,
  image_url text,
  text_top text not null default '',
  title text not null default '',
  description text not null default '',
  button_text text not null default 'Начать',
  text_bottom text not null default '',
  layout text not null default 'side' check (layout in ('side', 'center')),
  alignment text not null default 'top' check (alignment in ('top', 'center'))
);

-- ------------------------------------------------------------
-- 7. Вопросы квиза
-- ------------------------------------------------------------
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position int not null default 0,
  question_text text not null default ''
);

create index idx_quiz_questions_quiz_id on public.quiz_questions(quiz_id);

-- ------------------------------------------------------------
-- 8. Варианты ответов вопроса
-- ------------------------------------------------------------
create table public.quiz_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  text text not null default '',
  points int not null default 0
);

create index idx_quiz_question_options_question_id on public.quiz_question_options(question_id);

-- ------------------------------------------------------------
-- 9. Варианты результатов квиза (по баллам)
-- ------------------------------------------------------------
create table public.quiz_result_variants (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  min_score int not null default 0,
  max_score int not null default 100,
  title text not null default '',
  description text not null default ''
);

create index idx_quiz_result_variants_quiz_id on public.quiz_result_variants(quiz_id);

-- ------------------------------------------------------------
-- 10. Страница «Спасибо» квиза (1:1)
-- ------------------------------------------------------------
create table public.quiz_thank_you_pages (
  quiz_id uuid primary key references public.quizzes(id) on delete cascade,
  image_url text,
  video_url text not null default '',
  title text not null default 'Спасибо!',
  description text not null default 'Ваши ответы приняты',
  button_text text not null default '',
  button_url text not null default ''
);

-- ------------------------------------------------------------
-- 11. Заявки по квизам (собранные контакты)
-- ------------------------------------------------------------
create table public.quiz_leads (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create index idx_quiz_leads_quiz_id on public.quiz_leads(quiz_id);

-- ------------------------------------------------------------
-- Триггеры: обновление updated_at
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger coach_sessions_updated_at
  before update on public.coach_sessions
  for each row execute function public.set_updated_at();

create trigger designer_sessions_updated_at
  before update on public.designer_sessions
  for each row execute function public.set_updated_at();

create trigger quizzes_updated_at
  before update on public.quizzes
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS (Row Level Security)
-- Включите Supabase Auth и привяжите user_id к auth.uid()
-- или используйте telegram_user_id и сервисную роль для записи
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.coach_sessions enable row level security;
alter table public.coach_messages enable row level security;
alter table public.designer_sessions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_start_pages enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_question_options enable row level security;
alter table public.quiz_result_variants enable row level security;
alter table public.quiz_thank_you_pages enable row level security;
alter table public.quiz_leads enable row level security;

-- Политики: доступ к своим данным по user_id.
-- Если используете auth.uid() = user_id, создайте таблицу так, чтобы
-- profiles.id совпадал с auth.uid() при регистрации (или храните user_id в app_metadata).
-- Ниже — пример для доступа по user_id из JWT claim или через сервисную роль.

-- Профили: пользователь читает/обновляет только свой профиль
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Сессии коуча
create policy "coach_sessions_all_own" on public.coach_sessions
  for all using (auth.uid() = user_id);

-- Сообщения коуча — через сессию (проверка владельца сессии)
create policy "coach_messages_all_via_session" on public.coach_messages
  for all using (
    exists (
      select 1 from public.coach_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- Сессии дизайнера
create policy "designer_sessions_all_own" on public.designer_sessions
  for all using (auth.uid() = user_id);

-- Квизы
create policy "quizzes_all_own" on public.quizzes
  for all using (auth.uid() = user_id);

-- Страница старта квиза — через владельца квиза
create policy "quiz_start_pages_all_via_quiz" on public.quiz_start_pages
  for all using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );

-- Вопросы квиза
create policy "quiz_questions_all_via_quiz" on public.quiz_questions
  for all using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );

-- Варианты ответов — через вопрос и квиз
create policy "quiz_question_options_all_via_question" on public.quiz_question_options
  for all using (
    exists (
      select 1 from public.quiz_questions qq
      join public.quizzes q on q.id = qq.quiz_id
      where qq.id = question_id and q.user_id = auth.uid()
    )
  );

-- Варианты результатов
create policy "quiz_result_variants_all_via_quiz" on public.quiz_result_variants
  for all using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );

-- Страница «Спасибо»
create policy "quiz_thank_you_pages_all_via_quiz" on public.quiz_thank_you_pages
  for all using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );

-- Заявки: владелец квиза может только читать
create policy "quiz_leads_select_via_quiz" on public.quiz_leads
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );
-- Вставка заявки без привязки к auth (прохождение квиза анонимно)
create policy "quiz_leads_insert_anon" on public.quiz_leads
  for insert with check (true);

-- ------------------------------------------------------------
-- Публичный доступ: чтение опубликованных квизов (для /q/:slug)
-- ------------------------------------------------------------
create policy "quizzes_select_published" on public.quizzes
  for select using (published = true);

create policy "quiz_start_pages_select_published" on public.quiz_start_pages
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.published = true)
  );

create policy "quiz_questions_select_published" on public.quiz_questions
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.published = true)
  );

create policy "quiz_question_options_select_published" on public.quiz_question_options
  for select using (
    exists (
      select 1 from public.quiz_questions qq
      join public.quizzes q on q.id = qq.quiz_id
      where qq.id = question_id and q.published = true
    )
  );

create policy "quiz_result_variants_select_published" on public.quiz_result_variants
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.published = true)
  );

create policy "quiz_thank_you_pages_select_published" on public.quiz_thank_you_pages
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.published = true)
  );
