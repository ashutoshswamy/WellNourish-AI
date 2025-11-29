-- =====================================================
-- WELLNOURISH AI - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Run this entire file in your Supabase SQL Editor
-- to set up all tables, types, functions, and policies
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CUSTOM TYPES (ENUMS)
-- =====================================================

CREATE TYPE activity_level AS ENUM (
    'sedentary', 
    'lightly_active', 
    'moderately_active', 
    'very_active', 
    'extremely_active'
);

CREATE TYPE dietary_preference AS ENUM (
    'none', 
    'vegetarian', 
    'vegan', 
    'pescatarian', 
    'keto', 
    'paleo', 
    'mediterranean', 
    'gluten_free', 
    'dairy_free'
);

CREATE TYPE goal_type AS ENUM (
    'weight_loss', 
    'muscle_gain', 
    'maintenance', 
    'athletic_performance', 
    'general_health'
);

CREATE TYPE gender_type AS ENUM (
    'male', 
    'female', 
    'other', 
    'prefer_not_to_say'
);

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    
    -- Personal Information
    date_of_birth DATE,
    gender gender_type,
    height_cm NUMERIC(5, 2) CHECK (height_cm > 0 AND height_cm < 300),
    weight_kg NUMERIC(5, 2) CHECK (weight_kg > 0 AND weight_kg < 500),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_date_of_birth CHECK (date_of_birth <= CURRENT_DATE)
);

-- Add indexes for profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Activity & Goals
    activity_level activity_level NOT NULL DEFAULT 'moderately_active',
    goal goal_type NOT NULL DEFAULT 'maintenance',
    target_weight_kg NUMERIC(5, 2) CHECK (target_weight_kg > 0 AND target_weight_kg < 500),
    
    -- Dietary Preferences
    dietary_preference dietary_preference NOT NULL DEFAULT 'none',
    allergies TEXT[], -- Array of allergy strings
    food_dislikes TEXT[], -- Array of disliked foods
    
    -- Macronutrient Preferences (optional custom targets)
    custom_calories_target INTEGER CHECK (custom_calories_target > 0 AND custom_calories_target < 10000),
    custom_protein_g INTEGER CHECK (custom_protein_g >= 0 AND custom_protein_g < 1000),
    custom_carbs_g INTEGER CHECK (custom_carbs_g >= 0 AND custom_carbs_g < 2000),
    custom_fats_g INTEGER CHECK (custom_fats_g >= 0 AND custom_fats_g < 500),
    
    -- Meal Planning Preferences
    meals_per_day INTEGER DEFAULT 3 CHECK (meals_per_day >= 1 AND meals_per_day <= 8),
    snacks_per_day INTEGER DEFAULT 2 CHECK (snacks_per_day >= 0 AND snacks_per_day <= 5),
    
    -- Workout Preferences
    workouts_per_week INTEGER DEFAULT 3 CHECK (workouts_per_week >= 0 AND workouts_per_week <= 14),
    workout_duration_minutes INTEGER DEFAULT 45 CHECK (workout_duration_minutes >= 0 AND workout_duration_minutes <= 300),
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Additional Preferences
    preferred_cuisines TEXT[], -- Array of cuisine preferences
    cooking_time_preference TEXT CHECK (cooking_time_preference IN ('quick', 'moderate', 'elaborate')),
    budget_level TEXT CHECK (budget_level IN ('budget', 'moderate', 'premium')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure one preference record per user
    CONSTRAINT unique_user_preferences UNIQUE(user_id)
);

-- Add indexes for user_preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_activity_level ON user_preferences(activity_level);
CREATE INDEX idx_user_preferences_goal ON user_preferences(goal);

-- =====================================================
-- GENERATED PLANS TABLE
-- =====================================================
CREATE TABLE generated_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Plan Metadata
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('meal', 'workout', 'combined')),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0 AND duration_days <= 365),
    
    -- Goal for the plan
    goal goal_type,
    
    -- Plan Content (stored as JSONB for flexibility)
    meal_plan JSONB, -- Structured meal plan data
    workout_plan JSONB, -- Structured workout plan data
    
    -- Nutritional Summary
    daily_calories INTEGER CHECK (daily_calories > 0),
    daily_protein_g INTEGER CHECK (daily_protein_g >= 0),
    daily_carbs_g INTEGER CHECK (daily_carbs_g >= 0),
    daily_fats_g INTEGER CHECK (daily_fats_g >= 0),
    
    -- Plan Status
    is_active BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    completion_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- AI Generation Metadata
    ai_model_used TEXT,
    generation_prompt TEXT,
    generation_tokens INTEGER,
    
    -- Timestamps
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Add indexes for generated_plans
CREATE INDEX idx_generated_plans_user_id ON generated_plans(user_id);
CREATE INDEX idx_generated_plans_plan_type ON generated_plans(plan_type);
CREATE INDEX idx_generated_plans_is_active ON generated_plans(is_active);
CREATE INDEX idx_generated_plans_created_at ON generated_plans(created_at DESC);
CREATE INDEX idx_generated_plans_is_favorite ON generated_plans(is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_generated_plans_goal ON generated_plans(goal);

-- Add GIN indexes for JSONB columns for better query performance
CREATE INDEX idx_generated_plans_meal_plan ON generated_plans USING GIN (meal_plan);
CREATE INDEX idx_generated_plans_workout_plan ON generated_plans USING GIN (workout_plan);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for generated_plans
CREATE TRIGGER update_generated_plans_updated_at
    BEFORE UPDATE ON generated_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = id);

-- =====================================================
-- USER PREFERENCES POLICIES
-- =====================================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
    ON user_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- GENERATED PLANS POLICIES
-- =====================================================

-- Users can view their own plans
CREATE POLICY "Users can view own plans"
    ON generated_plans FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own plans
CREATE POLICY "Users can insert own plans"
    ON generated_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own plans
CREATE POLICY "Users can update own plans"
    ON generated_plans FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own plans
CREATE POLICY "Users can delete own plans"
    ON generated_plans FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to automatically create a profile on user signup (robust version)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
BEGIN
    -- Get email from multiple possible sources
    user_email := COALESCE(
        NEW.email,
        NEW.raw_user_meta_data->>'email',
        NEW.raw_app_meta_data->>'email'
    );
    
    -- Get full name from metadata (OAuth providers like Google put it here)
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'user_name',
        NULL
    );
    
    -- Only insert if we have an email
    IF user_email IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (NEW.id, user_email, user_full_name)
        ON CONFLICT (id) DO UPDATE SET
            email = COALESCE(EXCLUDED.email, profiles.email),
            full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle case where email already exists (user might be linking accounts)
        -- Update the existing profile instead
        UPDATE public.profiles
        SET 
            full_name = COALESCE(user_full_name, full_name),
            updated_at = NOW()
        WHERE email = user_email OR id = NEW.id;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION calculate_bmi(height_cm NUMERIC, weight_kg NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    IF height_cm IS NULL OR weight_kg IS NULL OR height_cm <= 0 THEN
        RETURN NULL;
    END IF;
    RETURN ROUND((weight_kg / POWER(height_cm / 100, 2))::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get user's age
CREATE OR REPLACE FUNCTION calculate_age(date_of_birth DATE)
RETURNS INTEGER AS $$
BEGIN
    IF date_of_birth IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN DATE_PART('year', AGE(date_of_birth));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- SCHEMA SETUP COMPLETE!
-- =====================================================
-- Tables created:
--   - profiles
--   - user_preferences  
--   - generated_plans
--
-- Features:
--   - Row Level Security enabled
--   - Auto profile creation on signup
--   - Updated_at timestamps auto-update
--   - BMI and age calculation functions
-- =====================================================
