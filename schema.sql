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
-- USER PREFERENCES TABLE (Optional)
-- Store user's default preferences for quick access
-- =====================================================
create table if not exists public.user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  
  -- Default preferences
  default_diet_preference text,
  default_cuisine_preferences text[] default '{}',
  default_allergies text,
  
  -- Notification preferences
  email_notifications boolean default true,
  plan_reminders boolean default true,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_preferences enable row level security;

-- Policies for user_preferences table
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- Automatically handle updated_at timestamps
-- =====================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_saved_plans_updated_at
  before update on public.saved_plans
  for each row
  execute function public.handle_updated_at();

create trigger handle_user_preferences_updated_at
  before update on public.user_preferences
  for each row
  execute function public.handle_updated_at();

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

-- =====================================================
-- EXAMPLE JSONB STRUCTURES
-- For reference when inserting/querying data
-- =====================================================

-- user_inputs JSONB structure:
-- {
--   "age": 25,
--   "gender": "male",
--   "height": 175,
--   "weight": 70,
--   "activityLevel": "moderately_active",
--   "dietPreference": "Vegetarian",
--   "customDietPreference": "",
--   "cuisinePreferences": ["Indian", "Italian"],
--   "customCuisine": "",
--   "allergies": "None",
--   "goals": "Build muscle and lose fat"
-- }

-- plan_data JSONB structure:
-- {
--   "fullPlan": "# NUTRITION SUMMARY\n...",
--   "bmi": "22.86",
--   "bmiCategory": "Normal weight"
-- }

-- =====================================================
-- HELPFUL QUERIES
-- =====================================================

-- Get all plans for a user with latest first:
-- SELECT * FROM saved_plans 
-- WHERE user_id = auth.uid() 
-- ORDER BY created_at DESC;

-- Get user's most recent plan:
-- SELECT * FROM saved_plans 
-- WHERE user_id = auth.uid() 
-- ORDER BY created_at DESC 
-- LIMIT 1;

-- Count plans by user:
-- SELECT user_id, COUNT(*) as plan_count 
-- FROM saved_plans 
-- GROUP BY user_id;

-- Search plans by diet preference:
-- SELECT * FROM saved_plans 
-- WHERE user_inputs->>'dietPreference' = 'Vegetarian';

-- Get plans created in last 30 days:
-- SELECT * FROM saved_plans 
-- WHERE created_at >= NOW() - INTERVAL '30 days'
-- ORDER BY created_at DESC;
