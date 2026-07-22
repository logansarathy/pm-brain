# PM OS - Database Schema & Supabase Configuration Guide

This document provides a detailed breakdown of all 10 database tables, schemas, relationships, security rules (RLS), and manual setup steps for integrating Supabase into the Product Management Operating System (PM OS).

---

## Architecture Overview

- **Static Content**: Course content (lessons, assignments, frameworks, overview, quizzes) remains stored statically in local files (`src/content/`).
- **Dynamic User State**: User-generated data (user progress, lesson progress, PM lab entries, journal notes, portfolio deliverables, practice answers, knowledge bookmarks, and LinkedIn posts) is stored and synchronized with **Supabase PostgreSQL**.
- **Offline / Local Fallback**: If Supabase environment variables are not provided, the application seamlessly uses `LocalStorageAdapter` for client-side persistence without breaking.

---

## Database Tables Specification

### 1. `profiles`
Stores user profile information associated with Supabase Auth users.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'creator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

---

### 2. `progress`
Tracks student overall course completion, streak counts, XP points, and current active week.

```sql
CREATE TABLE public.progress (
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

CREATE POLICY "Users can manage own progress" ON public.progress
  FOR ALL USING (auth.uid() = user_id);
```

---

### 3. `lesson_progress`
Dedicated table tracking lesson completions with fine-grained status and completion timestamps.

```sql
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress
  FOR ALL USING (auth.uid() = user_id);
```

---

### 4. `journal_entries`
Stores personal reflection and daily journal logs.

```sql
CREATE TABLE public.journal_entries (
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

CREATE POLICY "Users can manage own journal entries" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);
```

---

### 5. `practice_answers`
Stores student answers for product sense, strategy, metrics, and wireframing practice exercises.

```sql
CREATE TABLE public.practice_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_id INT NOT NULL,
  exercise_type TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.practice_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own practice answers" ON public.practice_answers
  FOR ALL USING (auth.uid() = user_id);
```

---

### 6. `pmlab_entries`
Stores PM Lab entries submitted per week (Week 0 through Week 16).

```sql
CREATE TABLE public.pmlab_entries (
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

CREATE POLICY "Users can manage own PM Lab entries" ON public.pmlab_entries
  FOR ALL USING (auth.uid() = user_id);
```

---

### 7. `portfolio_items`
Automatically aggregated portfolio deliverables from completed weeks.

```sql
CREATE TABLE public.portfolio_items (
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

CREATE POLICY "Users can manage own portfolio items" ON public.portfolio_items
  FOR ALL USING (auth.uid() = user_id);
```

---

### 8. `knowledge_notes`
Stores bookmarked lessons, personal notes, frameworks, and second-brain knowledge items.

```sql
CREATE TABLE public.knowledge_notes (
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

CREATE POLICY "Users can manage own knowledge notes" ON public.knowledge_notes
  FOR ALL USING (auth.uid() = user_id);
```

---

### 9. `linkedin_posts`
Tracks weekly LinkedIn post history, published links, drafts, and dates.

```sql
CREATE TABLE public.linkedin_posts (
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

CREATE POLICY "Users can manage own LinkedIn posts" ON public.linkedin_posts
  FOR ALL USING (auth.uid() = user_id);
```

---

### 10. `settings`
Stores user-specific app settings and targets.

```sql
CREATE TABLE public.settings (
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

CREATE POLICY "Users can manage own settings" ON public.settings
  FOR ALL USING (auth.uid() = user_id);
```

---

## Required Environment Variables

Add the following keys to `.env` or system environment settings:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

---

## Manual Setup Steps in Supabase Dashboard

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2. **Execute SQL Schema**: Open the **SQL Editor** in the Supabase Dashboard and execute the SQL script provided in this guide to create all 10 tables and RLS policies.
3. **Configure Auth Providers**:
   - Enable **Email / Password** authentication in *Authentication > Providers*.
   - (Optional) Enable **Google OAuth** provider and supply Client ID & Secret from Google Cloud Console.
4. **Copy API Credentials**: Retrieve your Project URL and Anon Key from *Settings > API*, and set them as environment variables.
