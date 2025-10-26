/**
 * Database Schema Types for WellNourish AI
 * This file defines TypeScript types that match the Supabase database schema
 */

// =====================================================
// DATABASE ENUMS
// =====================================================

export type Gender = "male" | "female" | "other";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

export type BMICategory =
  | "Underweight"
  | "Normal weight"
  | "Overweight"
  | "Obese";

// =====================================================
// USER INPUT STRUCTURE
// Matches the JSONB stored in saved_plans.user_inputs
// =====================================================

export interface UserInputData {
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  dietPreference: string;
  customDietPreference?: string;
  cuisinePreferences: string[];
  customCuisine?: string;
  allergies: string;
  goals: string;
}

// =====================================================
// PLAN DATA STRUCTURE
// Matches the JSONB stored in saved_plans.plan_data
// =====================================================

export interface PlanData {
  fullPlan: string;
  bmi: string;
  bmiCategory: BMICategory;
}

// =====================================================
// DATABASE TABLES
// =====================================================

/**
 * Profiles Table
 * Extends Supabase auth.users with additional user information
 */
export interface Profile {
  id: string; // UUID, references auth.users
  full_name: string | null;
  email: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Saved Plans Table
 * Stores generated diet and workout plans for users
 */
export interface SavedPlan {
  id: string; // UUID
  user_id: string; // UUID, references profiles.id
  user_inputs: UserInputData; // JSONB
  plan_data: PlanData; // JSONB
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * User Preferences Table
 * Stores user's default preferences
 */
export interface UserPreferences {
  id: string; // UUID
  user_id: string; // UUID, references profiles.id
  default_diet_preference: string | null;
  default_cuisine_preferences: string[];
  default_allergies: string | null;
  email_notifications: boolean;
  plan_reminders: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// =====================================================
// DATABASE OPERATIONS TYPES
// =====================================================

/**
 * Insert types (without auto-generated fields)
 */
export interface InsertProfile {
  id: string;
  full_name?: string | null;
  email: string;
}

export interface InsertSavedPlan {
  user_id: string;
  user_inputs: UserInputData;
  plan_data: PlanData;
}

export interface InsertUserPreferences {
  user_id: string;
  default_diet_preference?: string | null;
  default_cuisine_preferences?: string[];
  default_allergies?: string | null;
  email_notifications?: boolean;
  plan_reminders?: boolean;
}

/**
 * Update types (all fields optional)
 */
export type UpdateProfile = Partial<
  Omit<Profile, "id" | "created_at" | "updated_at">
>;
export type UpdateSavedPlan = Partial<
  Omit<SavedPlan, "id" | "user_id" | "created_at" | "updated_at">
>;
export type UpdateUserPreferences = Partial<
  Omit<UserPreferences, "id" | "user_id" | "created_at" | "updated_at">
>;

// =====================================================
// QUERY RESULT TYPES
// =====================================================

/**
 * Extended SavedPlan with Profile information
 */
export interface SavedPlanWithProfile extends SavedPlan {
  profile: Profile;
}

/**
 * Plan summary for list views
 */
export interface PlanSummary {
  id: string;
  created_at: string;
  bmi: string;
  bmiCategory: BMICategory;
  dietPreference: string;
  goals: string;
}

// =====================================================
// SUPABASE CLIENT TYPES
// Type-safe database schema for Supabase client
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: InsertProfile;
        Update: UpdateProfile;
      };
      saved_plans: {
        Row: SavedPlan;
        Insert: InsertSavedPlan;
        Update: UpdateSavedPlan;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: InsertUserPreferences;
        Update: UpdateUserPreferences;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      gender: Gender;
      activity_level: ActivityLevel;
    };
  };
}

// =====================================================
// HELPER TYPES
// =====================================================

/**
 * Type for Supabase client with typed database
 */
export type TypedSupabaseClient = any; // Replace with: SupabaseClient<Database>

/**
 * Extract table names
 */
export type Tables = keyof Database["public"]["Tables"];

/**
 * Extract row type from table
 */
export type TableRow<T extends Tables> = Database["public"]["Tables"][T]["Row"];

/**
 * Extract insert type from table
 */
export type TableInsert<T extends Tables> =
  Database["public"]["Tables"][T]["Insert"];

/**
 * Extract update type from table
 */
export type TableUpdate<T extends Tables> =
  Database["public"]["Tables"][T]["Update"];

// =====================================================
// VALIDATION CONSTANTS
// Match these with your database constraints
// =====================================================

export const VALIDATION_RULES = {
  age: {
    min: 10,
    max: 120,
  },
  height: {
    min: 50, // cm
    max: 300, // cm
  },
  weight: {
    min: 20, // kg
    max: 500, // kg
  },
  goals: {
    minLength: 5,
  },
} as const;

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "extremely_active",
];

export const GENDERS: Gender[] = ["male", "female", "other"];
