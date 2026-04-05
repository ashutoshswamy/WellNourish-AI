-- PROFESSIONAL DATABASE SCHEMA FOR WELLNOURISH AI
-- Designed for Supabase with Clerk Authentication

-- 1. Create Custom Types (Enums)
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE activity_level_type AS ENUM ('Sedentary', 'Light', 'Moderate', 'Active', 'Very Active');
CREATE TYPE health_goal_type AS ENUM ('Lose Weight', 'Maintain', 'Gain Muscle');
CREATE TYPE weekly_goal_type AS ENUM ('0.25kg', '0.5kg', '1kg', 'Maintain');
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snacks');
CREATE TYPE plan_status_type AS ENUM ('active', 'archived');

-- 2. Create Profiles Table (Synced from Clerk Or Manual Update)
CREATE TABLE profiles (
    user_id TEXT PRIMARY KEY, -- Clerk User ID
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create User Metrics Table (Onboarding Data)
CREATE TABLE user_metrics (
    user_id TEXT PRIMARY KEY REFERENCES profiles(user_id) ON DELETE CASCADE,
    age INTEGER CHECK (age > 0),
    gender gender_type,
    weight_kg NUMERIC(5,2) CHECK (weight_kg > 0),
    height_cm NUMERIC(5,2) CHECK (height_cm > 0),
    target_weight NUMERIC(5,2) CHECK (target_weight > 0),
    activity_level activity_level_type,
    health_goal health_goal_type,
    weekly_goal weekly_goal_type,
    daily_calorie_target INTEGER,
    cuisine_preferences TEXT,
    diet_preferences TEXT,
    allergies TEXT,
    injuries TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Weight Logs Table
CREATE TABLE weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    weight NUMERIC(5,2) NOT NULL CHECK (weight > 0),
    logged_at DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, logged_at)
);

-- 5. Create Meal Plans Table
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    status plan_status_type DEFAULT 'active' NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create Plan Days Table
CREATE TABLE plan_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
    total_calories INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Create Meals Table
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES plan_days(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    meal_type meal_type_enum NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    calories INTEGER,
    protein TEXT, -- Store as string e.g., "30g" for flexibility with units
    carbs TEXT,
    fat TEXT,
    ingredients TEXT[] DEFAULT '{}'::TEXT[],
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Create Shopping List Table
CREATE TABLE shopping_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies (For Clerk Auth)
-- Profiles: Any authenticated user can create/read their own profile
CREATE POLICY "Users can manage their own profile" ON profiles
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- User Metrics
CREATE POLICY "Users can manage their own metrics" ON user_metrics
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- Weight Logs
CREATE POLICY "Users can manage their own weight logs" ON weight_logs
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- Meal Plans
CREATE POLICY "Users can manage their own meal plans" ON meal_plans
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- Plan Days
CREATE POLICY "Users can manage their own plan days" ON plan_days
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- Meals
CREATE POLICY "Users can manage their own meals" ON meals
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- Shopping List
CREATE POLICY "Users can manage their own shopping list" ON shopping_list
    FOR ALL USING (user_id = (auth.jwt() ->> 'sub'))
    WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- 11. Triggers for updated_at manageability
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER on_user_metrics_updated
    BEFORE UPDATE ON user_metrics
    FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER on_meal_plans_updated
    BEFORE UPDATE ON meal_plans
    FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- 12. Indexes for Performance
CREATE INDEX idx_weight_logs_user_logged ON weight_logs (user_id, logged_at DESC);
CREATE INDEX idx_meal_plans_user_status ON meal_plans (user_id, status);
CREATE INDEX idx_plan_days_plan_id ON plan_days (plan_id);
CREATE INDEX idx_meals_day_id ON meals (day_id);
CREATE INDEX idx_shopping_list_user_plan ON shopping_list (user_id, plan_id);
