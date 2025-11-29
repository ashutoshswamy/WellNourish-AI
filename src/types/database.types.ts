/**
 * Supabase Database TypeScript Types
 * Auto-generated type definitions for database schema
 */

// =====================================================
// ENUMS
// =====================================================

export type ActivityLevel = 
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type DietaryPreference =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'gluten_free'
  | 'dairy_free';

export type GoalType =
  | 'weight_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'athletic_performance'
  | 'general_health';

export type GenderType =
  | 'male'
  | 'female'
  | 'other'
  | 'prefer_not_to_say';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type CookingTimePreference = 'quick' | 'moderate' | 'elaborate';

export type BudgetLevel = 'budget' | 'moderate' | 'premium';

export type PlanType = 'meal' | 'workout' | 'combined';

// =====================================================
// TABLE TYPES
// =====================================================

export interface Profile {
  id: string; // UUID
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null; // Date string (ISO format)
  gender: GenderType | null;
  height_cm: number | null;
  weight_kg: number | null;
  created_at: string; // Timestamp
  updated_at: string; // Timestamp
}

export interface UserPreferences {
  id: string; // UUID
  user_id: string; // UUID
  activity_level: ActivityLevel;
  goal: GoalType;
  target_weight_kg: number | null;
  dietary_preference: DietaryPreference;
  allergies: string[] | null;
  food_dislikes: string[] | null;
  custom_calories_target: number | null;
  custom_protein_g: number | null;
  custom_carbs_g: number | null;
  custom_fats_g: number | null;
  meals_per_day: number;
  snacks_per_day: number;
  workouts_per_week: number;
  workout_duration_minutes: number;
  fitness_level: FitnessLevel | null;
  preferred_cuisines: string[] | null;
  cooking_time_preference: CookingTimePreference | null;
  budget_level: BudgetLevel | null;
  created_at: string; // Timestamp
  updated_at: string; // Timestamp
}

export interface GeneratedPlan {
  id: string; // UUID
  user_id: string; // UUID
  plan_name: string;
  plan_type: PlanType;
  duration_days: number;
  goal: GoalType | null; // The goal this plan was generated for
  meal_plan: MealPlanData | null;
  workout_plan: WorkoutPlanData | null;
  daily_calories: number | null;
  daily_protein_g: number | null;
  daily_carbs_g: number | null;
  daily_fats_g: number | null;
  is_active: boolean;
  is_favorite: boolean;
  completion_percentage: number;
  ai_model_used: string | null;
  generation_prompt: string | null;
  generation_tokens: number | null;
  start_date: string | null; // Date string
  end_date: string | null; // Date string
  created_at: string; // Timestamp
  updated_at: string; // Timestamp
}

// =====================================================
// JSONB STRUCTURE TYPES
// =====================================================

export interface MealPlanData {
  days: DailyMealPlan[];
  meal_prep_instructions?: string[];
}

export interface DailyMealPlan {
  day: number;
  date?: string;
  meals: Meal[];
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fats_g: number;
}

export interface Meal {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  nutrition: NutritionInfo;
  recipe_url?: string;
  image_url?: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
}

export interface WorkoutPlanData {
  weeks: WeeklyWorkoutPlan[];
  notes?: string[];
  progression_strategy?: string;
}

export interface WeeklyWorkoutPlan {
  week: number;
  workouts: Workout[];
}

export interface Workout {
  day: number;
  day_name?: string;
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'rest' | 'mixed';
  focus_area?: string;
  duration_minutes: number;
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  category: string;
  sets?: number;
  reps?: number | string; // Can be "10-12" or number
  duration_seconds?: number;
  rest_seconds?: number;
  intensity?: string;
  instructions?: string[];
  video_url?: string;
  alternative_exercises?: string[];
}

// =====================================================
// INSERT TYPES (for creating new records)
// =====================================================

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type UserPreferencesInsert = Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type GeneratedPlanInsert = Omit<GeneratedPlan, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// =====================================================
// UPDATE TYPES (for updating records)
// =====================================================

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

export type UserPreferencesUpdate = Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at'>>;

export type GeneratedPlanUpdate = Partial<Omit<GeneratedPlan, 'id' | 'user_id' | 'created_at'>>;

// =====================================================
// DATABASE SCHEMA TYPE
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: UserPreferencesInsert;
        Update: UserPreferencesUpdate;
      };
      generated_plans: {
        Row: GeneratedPlan;
        Insert: GeneratedPlanInsert;
        Update: GeneratedPlanUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_bmi: {
        Args: { height_cm: number; weight_kg: number };
        Returns: number;
      };
      calculate_age: {
        Args: { date_of_birth: string };
        Returns: number;
      };
    };
    Enums: {
      activity_level: ActivityLevel;
      dietary_preference: DietaryPreference;
      goal_type: GoalType;
      gender_type: GenderType;
    };
  };
}

// =====================================================
// HELPER TYPES
// =====================================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type Functions<T extends keyof Database['public']['Functions']> =
  Database['public']['Functions'][T];
