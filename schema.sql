-- Create a table for public profiles linkable to auth.users
create table profiles (
  id uuid references auth.users not null primary key,
  age int,
  gender text,
  height float, -- in cm
  weight float, -- in kg
  activity_level text,
  cuisine_preferences text[],
  dietary_preferences text[],
  medical_conditions text[],
  allergies text[],
  goals text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for storing generated plans
create table generated_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  plan_duration text, -- '7' or '30'
  plan_data jsonb not null, -- Stores the full AI JSON response (nutrition_summary, daily_plan, tips)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for generated_plans
alter table generated_plans enable row level security;

-- Create policies for generated_plans
create policy "Users can view their own plans." on generated_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert their own plans." on generated_plans
  for insert with check (auth.uid() = user_id);

-- Optional: Function to handle new user signup automatically (if needed, though we might handle profile creation manually in onboarding)
-- create function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.profiles (id)
--   values (new.id);
--   return new;
-- end;
-- $$ language plpgsql security definer;
--
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
