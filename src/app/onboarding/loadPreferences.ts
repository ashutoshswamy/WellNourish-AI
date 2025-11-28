import { createClient } from '@/lib/supabase/client';
import type { 
  ActivityLevel, 
  GoalType, 
  DietaryPreference,
  GenderType 
} from '@/types/database.types';

export interface OnboardingPreferences {
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  gender?: GenderType;
  dietary_preferences: string[];
  cuisine_preferences: string[];
  allergies: string[];
  goal?: GoalType;
  activity_level?: string;
  target_weight_kg?: number;
  meals_per_day?: number;
  snacks_per_day?: number;
  workouts_per_week?: number;
  workout_duration_minutes?: number;
  fitness_level?: string;
  cooking_time_preference?: string;
  budget_level?: string;
}

const ONBOARDING_STORAGE_KEY = 'wellnourish_onboarding_data';
const EDIT_MODE_KEY = 'wellnourish_edit_mode';

/**
 * Map activity level from database enum to form value
 */
function mapActivityLevelFromDb(level: ActivityLevel): string {
  const mapping: Record<ActivityLevel, string> = {
    'sedentary': 'sedentary',
    'lightly_active': 'light',
    'moderately_active': 'moderate',
    'very_active': 'active',
    'extremely_active': 'active',
  };
  return mapping[level] || 'sedentary';
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if we're in edit mode (coming from plan page)
 */
export function isEditMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(EDIT_MODE_KEY) === 'true';
}

/**
 * Clear the edit mode flag
 */
export function clearEditMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(EDIT_MODE_KEY);
}

/**
 * Load preferences from localStorage (set by usePlanActions.editPreferences)
 */
export function loadPreferencesFromStorage(): OnboardingPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const storedData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!storedData) return null;

    const parsed = JSON.parse(storedData);
    return {
      age: parsed.age,
      height_cm: parsed.height_cm,
      weight_kg: parsed.weight_kg,
      gender: parsed.gender,
      dietary_preferences: parsed.dietary_preferences || [],
      cuisine_preferences: parsed.cuisine_preferences || [],
      allergies: parsed.allergies || [],
      goal: parsed.goal,
      activity_level: parsed.activity_level,
      target_weight_kg: parsed.target_weight_kg,
      meals_per_day: parsed.meals_per_day,
      snacks_per_day: parsed.snacks_per_day,
      workouts_per_week: parsed.workouts_per_week,
      workout_duration_minutes: parsed.workout_duration_minutes,
      fitness_level: parsed.fitness_level,
      cooking_time_preference: parsed.cooking_time_preference,
      budget_level: parsed.budget_level,
    };
  } catch (error) {
    console.error('Error loading preferences from storage:', error);
    return null;
  }
}

/**
 * Load preferences from Supabase database
 * This fetches the user's profile and preferences from the database
 */
export async function loadPreferencesFromDatabase(): Promise<OnboardingPreferences | null> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not authenticated');
      return null;
    }

    // Fetch profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    // Fetch user preferences
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: preferences, error: preferencesError } = await (supabase as any)
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      console.error('Error fetching preferences:', preferencesError);
    }

    // If neither exists, return null
    if (!profile && !preferences) {
      return null;
    }

    // Build the preferences object
    const loadedPreferences: OnboardingPreferences = {
      dietary_preferences: [],
      cuisine_preferences: [],
      allergies: [],
    };

    // Map profile data
    if (profile) {
      if (profile.date_of_birth) {
        loadedPreferences.age = calculateAge(profile.date_of_birth);
      }
      loadedPreferences.height_cm = profile.height_cm ?? undefined;
      loadedPreferences.weight_kg = profile.weight_kg ?? undefined;
      loadedPreferences.gender = profile.gender ?? undefined;
    }

    // Map preferences data
    if (preferences) {
      loadedPreferences.goal = preferences.goal ?? undefined;
      loadedPreferences.target_weight_kg = preferences.target_weight_kg ?? undefined;
      loadedPreferences.meals_per_day = preferences.meals_per_day ?? undefined;
      loadedPreferences.snacks_per_day = preferences.snacks_per_day ?? undefined;
      loadedPreferences.workouts_per_week = preferences.workouts_per_week ?? undefined;
      loadedPreferences.workout_duration_minutes = preferences.workout_duration_minutes ?? undefined;
      loadedPreferences.fitness_level = preferences.fitness_level ?? undefined;
      loadedPreferences.cooking_time_preference = preferences.cooking_time_preference ?? undefined;
      loadedPreferences.budget_level = preferences.budget_level ?? undefined;
      
      // Map activity level
      if (preferences.activity_level) {
        loadedPreferences.activity_level = mapActivityLevelFromDb(preferences.activity_level);
      }

      // Map dietary preference to array
      if (preferences.dietary_preference && preferences.dietary_preference !== 'none') {
        loadedPreferences.dietary_preferences = [preferences.dietary_preference];
      }

      // Map arrays
      loadedPreferences.allergies = preferences.allergies || [];
      loadedPreferences.cuisine_preferences = preferences.preferred_cuisines || [];
    }

    return loadedPreferences;
  } catch (error) {
    console.error('Error loading preferences from database:', error);
    return null;
  }
}

/**
 * Load preferences with priority:
 * 1. If in edit mode, use localStorage (set by usePlanActions)
 * 2. Otherwise, try to load from Supabase database
 * 3. If nothing found, return null
 */
export async function loadPreferences(): Promise<{
  preferences: OnboardingPreferences | null;
  isEditing: boolean;
}> {
  // Check if we're in edit mode (coming from plan page)
  const editMode = isEditMode();

  if (editMode) {
    // Load from localStorage (set by usePlanActions.editPreferences)
    const storagePreferences = loadPreferencesFromStorage();
    if (storagePreferences) {
      return {
        preferences: storagePreferences,
        isEditing: true,
      };
    }
  }

  // Try to load from database
  const dbPreferences = await loadPreferencesFromDatabase();
  
  return {
    preferences: dbPreferences,
    isEditing: editMode,
  };
}

/**
 * Clear all stored preferences (call after successful submission)
 */
export function clearStoredPreferences(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  clearEditMode();
}
