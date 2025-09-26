# Modules Schema (Supabase)

Run these SQL statements in Supabase SQL editor:

```sql
-- Catalog of modules
create table if not exists public.modules (
  id text primary key,
  title text not null,
  category text not null,
  difficulty int2 not null check (difficulty in (1,2,3)),
  estimated_minutes int not null,
  total_lessons int not null,
  xp_reward int not null,
  description text not null,
  tags text[] not null,
  video_url text not null,
  thumbnail text not null,
  role text not null check (role in ('Data Scientist','Business Analyst')),
  created_at timestamp with time zone default now()
);

-- Per-user progress
create table if not exists public.user_modules (
  user_id uuid not null,
  module_id text not null references public.modules(id) on delete cascade,
  progress int not null default 0 check (progress between 0 and 100),
  last_opened_at timestamp with time zone default now(),
  primary key (user_id, module_id)
);

-- (Optional) RLS policies: enable if you use auth
alter table public.modules enable row level security;
alter table public.user_modules enable row level security;

-- Allow read for all (or tailor to your auth setup)
create policy if not exists modules_read_all on public.modules
  for select using (true);

-- Only allow a user to see/modify their own progress
create policy if not exists user_modules_select_own on public.user_modules
  for select using (auth.uid() = user_id);
create policy if not exists user_modules_upsert_own on public.user_modules
  for insert with check (auth.uid() = user_id);
create policy if not exists user_modules_update_own on public.user_modules
  for update using (auth.uid() = user_id);
```

After tables exist, seed the catalog from your running backend:

```bash
curl -X POST http://localhost:3001/api/admin/seed-modules
```

Your frontend can now fetch role-filtered modules via:
- GET http://localhost:3001/api/modules?role=Data%20Scientist
- GET http://localhost:3001/api/modules?role=Business%20Analyst

Progress endpoint:
- POST http://localhost:3001/api/user-modules/progress { userId, moduleId, progress, lastOpenedAt }
