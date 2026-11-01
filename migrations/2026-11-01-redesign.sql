-- Sunburst Farms East: redesign support migration
-- Run in the Supabase SQL editor. Safe to re-run (uses IF NOT EXISTS / drops policies first).
--
-- 1. Irrigation status updates (coordinator-published, resident-readable)
-- 2. Let authors delete their own posts and events, and edit their own events
-- 3. Let authors delete their own replies

-- ---------- 1. Irrigation ----------
create table if not exists public.irrigation_updates (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null check (status in ('awaiting', 'estimated', 'confirmed', 'delayed')),
  window_start date,
  window_end date,
  note text,
  created_at timestamptz not null default now()
);

alter table public.irrigation_updates enable row level security;

drop policy if exists "Approved users can read irrigation" on public.irrigation_updates;
create policy "Approved users can read irrigation"
  on public.irrigation_updates for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'approved')
  );

drop policy if exists "Admins can publish irrigation" on public.irrigation_updates;
create policy "Admins can publish irrigation"
  on public.irrigation_updates for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Allow the 'irrigation' notification type used by the board update form
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('comment', 'claim', 'event', 'welcome', 'approved', 'denied', 'irrigation', 'announcement'));

-- Admins can insert notifications for other residents (fan-out on publish)
drop policy if exists "Admins can notify residents" on public.notifications;
create policy "Admins can notify residents"
  on public.notifications for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- 2. Own content: delete posts, edit/delete events ----------
drop policy if exists "Authors can delete own posts" on public.posts;
create policy "Authors can delete own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

drop policy if exists "Authors can update own events" on public.events;
create policy "Authors can update own events"
  on public.events for update
  using (auth.uid() = author_id);

drop policy if exists "Authors can delete own events" on public.events;
create policy "Authors can delete own events"
  on public.events for delete
  using (auth.uid() = author_id);

-- ---------- 3. Own replies ----------
drop policy if exists "Authors can delete own comments" on public.comments;
create policy "Authors can delete own comments"
  on public.comments for delete
  using (auth.uid() = author_id);
