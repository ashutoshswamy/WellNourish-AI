-- Add delete policy for generated_plans
create policy "Users can delete their own plans." on generated_plans
  for delete using (auth.uid() = user_id);
