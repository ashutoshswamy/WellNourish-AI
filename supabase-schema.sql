-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  age integer not null,
  gender text not null check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm integer not null,
  height_ft integer,
  height_inches integer,
  weight_kg numeric(5,2) not null,
  weight_lbs numeric(5,2),
  activity_level text not null check (activity_level in ('sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive')),
  dietary_preferences text[], -- array of dietary preferences like 'vegetarian', 'vegan', 'keto', etc.
  preferred_cuisine text[], -- array of preferred cuisines like 'italian', 'indian', 'mediterranean', etc.
  allergies text[], -- array of allergies/intolerances
  goal text not null, -- user's custom fitness/wellness goal
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create plans table
create table public.plans (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  diet_plan text not null,
  workout_regimen text not null,
  title text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- Users can only see and manipulate their own data

-- Profiles RLS
create policy "Users can view own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = user_id);
create policy "Users can delete own profile" on profiles for delete using (auth.uid() = user_id);

-- Plans RLS
create policy "Users can view own plans" on plans for select using (auth.uid() = user_id);
create policy "Users can insert own plans" on plans for insert with check (auth.uid() = user_id);
create policy "Users can update own plans" on plans for update using (auth.uid() = user_id);
create policy "Users can delete own plans" on plans for delete using (auth.uid() = user_id);

-- Enable RLS on tables
alter table public.profiles enable row level security;
alter table public.plans enable row level security;

-- Function to handle updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger plans_updated_at
  before update on public.plans
  for each row execute procedure public.handle_updated_at();

-- Optional: Create indexes for better performance
create index profiles_user_id_idx on public.profiles (user_id);
create index plans_user_id_idx on public.plans (user_id);
create index plans_profile_id_idx on public.plans (profile_id);
create index plans_created_at_idx on public.plans (created_at desc);
