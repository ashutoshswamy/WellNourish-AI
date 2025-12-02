-- =====================================================
-- WellNourish AI Database Schema
-- Supabase PostgreSQL Schema
-- Generated based on application code analysis
-- =====================================================

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CUSTOM ENUM TYPES
-- =====================================================

-- Activity Level Enum
CREATE TYPE activity_level AS ENUM (
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active'
);

-- Dietary Preference Enum
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

-- Goal Type Enum
CREATE TYPE goal_type AS ENUM (
  'weight_loss',
  'muscle_gain',
  'maintenance',
  'athletic_performance',
  'general_health'
);

-- Gender Type Enum
CREATE TYPE gender_type AS ENUM (
  'male',
  'female',
  'other',
  'prefer_not_to_say'
);

-- Fitness Level Enum
CREATE TYPE fitness_level AS ENUM (
  'beginner',
  'intermediate',
  'advanced'
);

-- Cooking Time Preference Enum
CREATE TYPE cooking_time_preference AS ENUM (
  'quick',
  'moderate',
  'elaborate'
);

-- Budget Level Enum
CREATE TYPE budget_level AS ENUM (
  'budget',
  'moderate',
  'premium'
);

-- Plan Type Enum
CREATE TYPE plan_type AS ENUM (
  'meal',
  'workout',
  'combined'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles Table
-- Stores basic user profile information
-- Links to Supabase Auth users via id
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender gender_type,
  height_cm NUMERIC(5, 2) CHECK (height_cm >= 50 AND height_cm <= 300),
  weight_kg NUMERIC(5, 2) CHECK (weight_kg >= 20 AND weight_kg <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Preferences Table
-- Stores user's dietary, fitness, and meal planning preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Activity and Goals
  activity_level activity_level NOT NULL DEFAULT 'sedentary',
  goal goal_type NOT NULL DEFAULT 'general_health',
  target_weight_kg NUMERIC(5, 2) CHECK (target_weight_kg >= 20 AND target_weight_kg <= 500),
  
  -- Dietary Preferences
  dietary_preference dietary_preference NOT NULL DEFAULT 'none',
  allergies TEXT[] DEFAULT '{}',
  food_dislikes TEXT[] DEFAULT '{}',
  preferred_cuisines TEXT[] DEFAULT '{}',
  
  -- Custom Nutrition Targets
  custom_calories_target INTEGER CHECK (custom_calories_target >= 500 AND custom_calories_target <= 10000),
  custom_protein_g INTEGER CHECK (custom_protein_g >= 0 AND custom_protein_g <= 500),
  custom_carbs_g INTEGER CHECK (custom_carbs_g >= 0 AND custom_carbs_g <= 1000),
  custom_fats_g INTEGER CHECK (custom_fats_g >= 0 AND custom_fats_g <= 500),
  
  -- Meal Preferences
  meals_per_day INTEGER NOT NULL DEFAULT 3 CHECK (meals_per_day >= 1 AND meals_per_day <= 6),
  snacks_per_day INTEGER NOT NULL DEFAULT 0 CHECK (snacks_per_day >= 0 AND snacks_per_day <= 4),
  cooking_time_preference cooking_time_preference,
  budget_level budget_level,
  
  -- Workout Preferences
  workouts_per_week INTEGER NOT NULL DEFAULT 3 CHECK (workouts_per_week >= 0 AND workouts_per_week <= 7),
  workout_duration_minutes INTEGER NOT NULL DEFAULT 45 CHECK (workout_duration_minutes >= 10 AND workout_duration_minutes <= 180),
  fitness_level fitness_level,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Generated Plans Table
-- Stores AI-generated meal and workout plans
CREATE TABLE generated_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Plan Metadata
  plan_name TEXT NOT NULL,
  plan_type plan_type NOT NULL DEFAULT 'combined',
  duration_days INTEGER NOT NULL DEFAULT 7 CHECK (duration_days >= 1 AND duration_days <= 30),
  goal goal_type,
  
  -- Plan Data (JSONB for flexible nested structures)
  meal_plan JSONB,
  workout_plan JSONB,
  
  -- Nutritional Summary
  daily_calories INTEGER,
  daily_protein_g INTEGER,
  daily_carbs_g INTEGER,
  daily_fats_g INTEGER,
  
  -- Plan Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  completion_percentage INTEGER NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- AI Generation Metadata
  ai_model_used TEXT,
  generation_prompt TEXT,
  generation_tokens INTEGER,
  
  -- Date Range
  start_date DATE,
  end_date DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- User Preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_goal ON user_preferences(goal);
CREATE INDEX idx_user_preferences_activity_level ON user_preferences(activity_level);

-- Generated Plans indexes
CREATE INDEX idx_generated_plans_user_id ON generated_plans(user_id);
CREATE INDEX idx_generated_plans_is_active ON generated_plans(is_active);
CREATE INDEX idx_generated_plans_is_favorite ON generated_plans(is_favorite);
CREATE INDEX idx_generated_plans_plan_type ON generated_plans(plan_type);
CREATE INDEX idx_generated_plans_created_at ON generated_plans(created_at DESC);
CREATE INDEX idx_generated_plans_user_active ON generated_plans(user_id, is_active);
CREATE INDEX idx_generated_plans_user_favorite ON generated_plans(user_id, is_favorite);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION calculate_bmi(height_cm NUMERIC, weight_kg NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  IF height_cm <= 0 OR weight_kg <= 0 THEN
    RETURN NULL;
  END IF;
  -- BMI = weight(kg) / height(m)^2
  RETURN ROUND(weight_kg / ((height_cm / 100) ^ 2), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate age from date of birth
CREATE OR REPLACE FUNCTION calculate_age(date_of_birth DATE)
RETURNS INTEGER AS $$
BEGIN
  IF date_of_birth IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for generated_plans
CREATE TRIGGER update_generated_plans_updated_at
  BEFORE UPDATE ON generated_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- User Preferences Policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Generated Plans Policies
CREATE POLICY "Users can view their own plans"
  ON generated_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans"
  ON generated_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans"
  ON generated_plans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans"
  ON generated_plans FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- HANDLE NEW USER FUNCTION (for Auth trigger)
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- JSONB STRUCTURE DOCUMENTATION
-- =====================================================

/*
meal_plan JSONB Structure:
{
  "days": [
    {
      "day": 1,
      "date": "2024-01-01",
      "meals": [
        {
          "meal_type": "breakfast" | "lunch" | "dinner" | "snack",
          "name": "Meal Name",
          "description": "Description of the meal",
          "ingredients": [
            {
              "name": "Ingredient Name",
              "amount": 100,
              "unit": "g",
              "notes": "optional notes"
            }
          ],
          "instructions": ["Step 1", "Step 2"],
          "prep_time_minutes": 10,
          "cook_time_minutes": 20,
          "servings": 1,
          "nutrition": {
            "calories": 300,
            "protein_g": 20,
            "carbs_g": 30,
            "fats_g": 15,
            "fiber_g": 5,
            "sugar_g": 10,
            "sodium_mg": 500
          },
          "recipe_url": "optional url",
          "image_url": "optional url"
        }
      ],
      "total_calories": 2000,
      "total_protein_g": 100,
      "total_carbs_g": 200,
      "total_fats_g": 80
    }
  ],
  "meal_prep_instructions": ["Prep tip 1", "Prep tip 2"]
}

workout_plan JSONB Structure:
{
  "weeks": [
    {
      "week": 1,
      "workouts": [
        {
          "day": 1,
          "day_name": "Monday",
          "workout_type": "strength" | "cardio" | "flexibility" | "rest" | "mixed",
          "focus_area": "Upper Body",
          "duration_minutes": 45,
          "exercises": [
            {
              "name": "Push-ups",
              "category": "Chest",
              "sets": 3,
              "reps": 12,
              "duration_seconds": null,
              "rest_seconds": 60,
              "intensity": "moderate",
              "instructions": ["Keep back straight", "Full range of motion"],
              "video_url": "optional url",
              "alternative_exercises": ["Bench Press", "Dips"]
            }
          ],
          "notes": "Optional workout notes"
        }
      ]
    }
  ],
  "notes": ["General plan notes"],
  "progression_strategy": "Progressive overload recommendations"
}
*/

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

/*
-- Get user's profile with preferences
SELECT 
  p.*,
  up.*,
  calculate_age(p.date_of_birth) as age,
  calculate_bmi(p.height_cm, p.weight_kg) as bmi
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.user_id
WHERE p.id = 'user-uuid-here';

-- Get user's active plan
SELECT *
FROM generated_plans
WHERE user_id = 'user-uuid-here'
  AND is_active = true
ORDER BY created_at DESC
LIMIT 1;

-- Get user's favorite plans
SELECT *
FROM generated_plans
WHERE user_id = 'user-uuid-here'
  AND is_favorite = true
ORDER BY created_at DESC;

-- Get meal from a plan's meal_plan JSONB
SELECT 
  gp.plan_name,
  meal->>'name' as meal_name,
  meal->>'meal_type' as meal_type,
  (meal->'nutrition'->>'calories')::int as calories
FROM generated_plans gp,
  jsonb_array_elements(gp.meal_plan->'days') as day,
  jsonb_array_elements(day->'meals') as meal
WHERE gp.id = 'plan-uuid-here';
*/
