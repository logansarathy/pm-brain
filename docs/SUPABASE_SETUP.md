# Supabase Integration & Setup Guide

This guide details how to set up, configure, and connect your Supabase database and authentication service for PM OS (Product Management Operating System).

---

## 1. Quick Start Prerequisites

To run PM OS with full Supabase cloud database synchronization, you will need:
- A free account on [Supabase](https://supabase.com).
- A Supabase Project created in the region nearest to your users.

---

## 2. Environment Variables Configuration

Declare your Supabase API credentials in `.env` (or `.env.local` for local development):

```env
VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="<your-anon-key>"
```

Ensure both variables are also reflected in `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 3. Database Schema Provisioning

Open the **SQL Editor** in your Supabase Dashboard and run the complete SQL DDL script below to instantiate all 10 tables, constraints, foreign keys, and Row Level Security (RLS) policies.

```sql
-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'creator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. PROGRESS
CREATE TABLE IF NOT EXISTS public.progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_week INT DEFAULT 0 NOT NULL,
  completed_lessons JSONB DEFAULT '[]'::jsonb NOT NULL,
  week_progress JSONB DEFAULT '{}'::jsonb NOT NULL,
  xp INT DEFAULT 0 NOT NULL,
  streak_current INT DEFAULT 0 NOT NULL,
  streak_longest INT DEFAULT 0 NOT NULL,
  last_active_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- 3. LESSON_PROGRESS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- 4. JOURNAL_ENTRIES
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

-- 5. PRACTICE_ANSWERS
CREATE TABLE IF NOT EXISTS public.practice_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  exercise_type TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.practice_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own practice answers" ON public.practice_answers FOR ALL USING (auth.uid() = user_id);

-- 6. PMLAB_ENTRIES
CREATE TABLE IF NOT EXISTS public.pmlab_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  goal TEXT,
  problem_statement TEXT,
  hypothesis TEXT,
  experiment TEXT,
  evidence TEXT,
  observations TEXT,
  insights TEXT,
  outcome TEXT,
  next_action TEXT,
  reflection TEXT,
  completed BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, week_id)
);

ALTER TABLE public.pmlab_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own PM Lab entries" ON public.pmlab_entries FOR ALL USING (auth.uid() = user_id);

-- 7. PORTFOLIO_ITEMS
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Research', 'Personas', 'Journey Maps', 'PRDs', 'Wireframes', 'Roadmaps', 'Case Studies', 'Presentations', 'LinkedIn Posts', 'Resume')),
  title TEXT NOT NULL,
  description TEXT,
  download_link TEXT,
  file_url TEXT,
  linkedin_draft TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own portfolio items" ON public.portfolio_items FOR ALL USING (auth.uid() = user_id);

-- 8. KNOWLEDGE_NOTES
CREATE TABLE IF NOT EXISTS public.knowledge_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT,
  week_id INT,
  type TEXT NOT NULL CHECK (type IN ('bookmark', 'framework', 'glossary', 'note')),
  title TEXT NOT NULL,
  category TEXT,
  content TEXT,
  link TEXT,
  favorite BOOLEAN DEFAULT false NOT NULL,
  pinned BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.knowledge_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own knowledge notes" ON public.knowledge_notes FOR ALL USING (auth.uid() = user_id);

-- 9. LINKEDIN_POSTS
CREATE TABLE IF NOT EXISTS public.linkedin_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  post_title TEXT NOT NULL,
  draft TEXT,
  url TEXT,
  published_date DATE,
  published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.linkedin_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own LinkedIn posts" ON public.linkedin_posts FOR ALL USING (auth.uid() = user_id);

-- 10. SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  hours_logged_total NUMERIC DEFAULT 0,
  weekly_goal_days INT DEFAULT 5,
  monthly_goal_days INT DEFAULT 20,
  sidebar_collapsed BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'light',
  timezone TEXT DEFAULT 'UTC' NOT NULL,
  notifications_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON public.settings FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Automatic User Provisioning Trigger (Optional)

You can optionally create a database trigger in Supabase to automatically initialize default `profiles`, `progress`, and `settings` records directly in Postgres upon new user registration:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'student');

  INSERT INTO public.progress (user_id, current_week, xp, streak_current, streak_longest)
  VALUES (new.id, 0, 0, 0, 0);

  INSERT INTO public.settings (user_id, hours_logged_total, weekly_goal_days, monthly_goal_days, theme)
  VALUES (new.id, 0, 5, 20, 'light');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

*Note: PM OS client application also automatically verifies and creates these default records seamlessly in TypeScript via `authService.ensureDefaultUserRecords`.*

---

## 5. Offline Fallback Behavior

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are omitted, PM OS automatically selects `LocalStorageAdapter`. All learning progress, PM labs, journals, and portfolio items will save directly to the browser's local storage so offline functionality is preserved.
