-- Drop the overly permissive policy
drop policy "Public profiles are viewable by everyone." on profiles;

-- Create a restrictive policy
create policy "Profiles are viewable by owner only." on profiles
  for select using (auth.uid() = id);
