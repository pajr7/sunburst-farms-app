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

-- Profiles: users can see their own profile or any approved profile
alter table public.profiles enable row level security;

create policy "Users can see own and approved profiles"
  on public.profiles for select
  using (
    id = auth.uid()
    or status = 'approved'
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- Admins can update any profile (for approvals). Uses a subquery on profiles
-- which is safe because the SELECT policy above doesn't self-reference.
create policy "Admins can update any profile"
  on public.profiles for update
  using (
    id = auth.uid()
    or (
      select role from public.profiles where id = auth.uid()
    ) = 'admin'
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

-- Listings table (marketplace)
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null default '',
  price decimal(10,2),
  is_free boolean not null default false,
  condition text not null default 'good' check (condition in ('new', 'like_new', 'good', 'fair')),
  category text not null check (category in ('home_garden', 'furniture', 'tools', 'equestrian', 'electronics', 'vehicles', 'other')),
  image_url text,
  status text not null default 'available' check (status in ('available', 'sold', 'pending')),
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "Approved users can read listings"
  on public.listings for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can create listings"
  on public.listings for insert
  with check (
    seller_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Sellers can update own listings"
  on public.listings for update
  using (seller_id = auth.uid());

create policy "Sellers can delete own listings"
  on public.listings for delete
  using (seller_id = auth.uid());

-- Listing images table (multiple photos per listing)
create table public.listing_images (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  image_url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.listing_images enable row level security;

create policy "Approved users can read listing images"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Approved users can insert listing images"
  on public.listing_images for insert
  with check (
    exists (
      select 1 from public.listings
      where id = listing_id and seller_id = auth.uid()
    )
  );

create policy "Sellers can delete own listing images"
  on public.listing_images for delete
  using (
    exists (
      select 1 from public.listings
      where id = listing_id and seller_id = auth.uid()
    )
  );

-- Messages table (direct messaging)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Users can read own messages"
  on public.messages for select
  using (sender_id = auth.uid() or recipient_id = auth.uid());

create policy "Approved users can send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and status = 'approved'
    )
  );

create policy "Recipients can update messages"
  on public.messages for update
  using (recipient_id = auth.uid());
