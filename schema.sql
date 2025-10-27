-- WellNourish AI Database Schema
-- This schema is designed for Supabase (PostgreSQL)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional user info
-- =====================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for profiles table
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- =====================================================
-- SAVED PLANS TABLE
-- Stores generated diet and workout plans for users
-- =====================================================
create table if not exists public.saved_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- User input data (stored as JSONB for flexibility)
  user_inputs jsonb not null,
  
  -- Generated plan data
  plan_data jsonb not null,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index if not exists saved_plans_user_id_idx on public.saved_plans(user_id);
create index if not exists saved_plans_created_at_idx on public.saved_plans(created_at desc);

-- Enable Row Level Security (RLS)
alter table public.saved_plans enable row level security;

-- Policies for saved_plans table
create policy "Users can view own plans"
  on public.saved_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.saved_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.saved_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.saved_plans for delete
  using (auth.uid() = user_id);

-- =====================================================
-- FUNCTION TO HANDLE NEW USER SIGNUP
-- Automatically create profile when user signs up
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();