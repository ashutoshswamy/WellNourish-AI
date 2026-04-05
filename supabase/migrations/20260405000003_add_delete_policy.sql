-- Migration: Add DELETE Policy for Meal Plans
-- Created: 2026-04-05

-- Allow users to delete their own meal plans
-- Cascading deletes will handle plan_days, meals, and shopping_list items.
CREATE POLICY "Users can delete their own meal plans" ON public.meal_plans
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);
