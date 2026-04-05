-- Initial Schema for WellNourish AI
-- Handles user profiles, metrics, meal plans, and weight logs.
-- Uses Clerk Authentication (auth.jwt() ->> 'sub') for user identity.

-- 1. PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER METRICS Table
CREATE TABLE IF NOT EXISTS public.user_metrics (
    user_id TEXT PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    age INTEGER,
    gender TEXT,
    weight_kg NUMERIC,
    height_cm NUMERIC,
    target_weight NUMERIC,
    activity_level TEXT,
    health_goal TEXT,
    weekly_goal TEXT,
    daily_calorie_target INTEGER,
    cuisine_preferences TEXT,
    diet_preferences TEXT,
    allergies TEXT,
    injuries TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEAL PLANS Table
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    start_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PLAN DAYS Table
CREATE TABLE IF NOT EXISTS public.plan_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    total_calories INTEGER,
    UNIQUE(meal_plan_id, day_number)
);

-- 5. MEALS Table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_day_id UUID REFERENCES public.plan_days(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snacks
    name TEXT NOT NULL,
    calories INTEGER,
    protein TEXT,
    carbs TEXT,
    fat TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEIGHT LOGS Table
CREATE TABLE IF NOT EXISTS public.weight_logs (
    user_id TEXT REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    weight NUMERIC NOT NULL,
    logged_at DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (user_id, logged_at)
);

-- ── ROW LEVEL SECURITY (RLS) ──

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- User Metrics Policies
CREATE POLICY "Users can view their own metrics" ON public.user_metrics
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own metrics" ON public.user_metrics
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own metrics" ON public.user_metrics
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Meal Plans Policies
CREATE POLICY "Users can view their own meal plans" ON public.meal_plans
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view days of their plans" ON public.plan_days
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE public.meal_plans.id = public.plan_days.meal_plan_id
            AND public.meal_plans.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can view meals of their plans" ON public.meals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.plan_days
            JOIN public.meal_plans ON public.meal_plans.id = public.plan_days.meal_plan_id
            WHERE public.plan_days.id = public.meals.plan_day_id
            AND public.meal_plans.user_id = (auth.jwt() ->> 'sub')
        )
    );

-- Weight Logs Policies
CREATE POLICY "Users can view their own weight logs" ON public.weight_logs
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own weight logs" ON public.weight_logs
    FOR ALL USING (auth.jwt() ->> 'sub' = user_id);
