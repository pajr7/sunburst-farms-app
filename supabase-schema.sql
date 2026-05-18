-- Run this in your Supabase SQL editor to set up the database

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  address text not null,
  section text not null,
  avatar_initials text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

-- Posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  category text not null check (category in ('produce', 'eggs', 'flowers', 'seeds', 'tools', 'events', 'general')),
  title text not null,
  body text not null,
  image_url text,
  claimed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Likes table
create table public.likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  event_date date not null,
  event_time text not null,
  location text not null,
  created_at timestamptz not null default now()
);

-- RSVPs table
create table public.rsvps (
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- Notifications table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('comment', 'claim', 'event', 'welcome', 'approved', 'denied')),
  message text not null,
  read boolean not null default false,
  related_post_id uuid references public.posts(id) on delete set null,
  related_event_id uuid references public.events(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Row Level Security policies

-- Profiles: anyone can read approved profiles, only own profile can be updated
alter table public.profiles enable row level security;

create policy "Approved profiles are visible to approved users"
  on public.profiles for select
  using (
    status = 'approved'
    or id = auth.uid()
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- Admins can update any profile (for approvals)
create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can see all profiles (including pending)
create policy "Admins can see all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Posts: only approved users can read/create
alter table public.posts enable row level security;

create policy "Approved users can read posts"
  on public.posts for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can create posts"
  on public.posts for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Authors can update own posts"
  on public.posts for update
  using (author_id = auth.uid());

-- Comments: approved users only
alter table public.comments enable row level security;

create policy "Approved users can read comments"
  on public.comments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can create comments"
  on public.comments for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

-- Likes: approved users only
alter table public.likes enable row level security;

create policy "Approved users can read likes"
  on public.likes for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can toggle likes"
  on public.likes for insert
  with check (user_id = auth.uid());

create policy "Users can remove own likes"
  on public.likes for delete
  using (user_id = auth.uid());

-- Events: approved users only
alter table public.events enable row level security;

create policy "Approved users can read events"
  on public.events for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can create events"
  on public.events for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

-- RSVPs
alter table public.rsvps enable row level security;

create policy "Approved users can read rsvps"
  on public.rsvps for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can rsvp"
  on public.rsvps for insert
  with check (user_id = auth.uid());

create policy "Users can remove own rsvp"
  on public.rsvps for delete
  using (user_id = auth.uid());

-- Notifications: users can only see their own
alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

-- Allow service role to insert notifications
create policy "Service can insert notifications"
  on public.notifications for insert
  with check (true);
