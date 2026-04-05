-- Migration: Drop foreign key constraints referencing profiles(user_id)
--
-- Clerk manages users externally, so there is no guarantee a profiles row
-- exists before other tables are written to. RLS policies already enforce
-- ownership via auth.jwt() ->> 'sub', so the FK adds no security value.

ALTER TABLE user_metrics DROP CONSTRAINT IF EXISTS user_metrics_user_id_fkey;
ALTER TABLE weight_logs DROP CONSTRAINT IF EXISTS weight_logs_user_id_fkey;
ALTER TABLE meal_plans DROP CONSTRAINT IF EXISTS meal_plans_user_id_fkey;
ALTER TABLE plan_days DROP CONSTRAINT IF EXISTS plan_days_user_id_fkey;
ALTER TABLE meals DROP CONSTRAINT IF EXISTS meals_user_id_fkey;
ALTER TABLE shopping_list DROP CONSTRAINT IF EXISTS shopping_list_user_id_fkey;
