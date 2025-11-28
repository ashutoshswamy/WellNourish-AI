'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { MealPlanData, WorkoutPlanData, ShoppingListItem } from '@/types/database.types';

export interface PlanData {
  success: boolean;
  plan_id?: string;
  summary: string;
  daily_calories: number;
  meal_plan: MealPlanData;
  workout_plan: WorkoutPlanData;
  shopping_list: ShoppingListItem[];
  warnings: string[];
  confidence_score: number;
  metadata?: {
    created_at: string;
    plan_type: string;
    duration_days: number;
    tokens_used: number | null;
  };
}

export interface UsePlanActionsOptions {
  onPlanUpdate?: (plan: PlanData) => void;
  onError?: (error: string) => void;
  onSaveSuccess?: () => void;
}

export interface UsePlanActionsReturn {
  isRegenerating: boolean;
  isSaving: boolean;
  isEditingPreferences: boolean;
  error: string | null;
  saveSuccess: boolean;
  regeneratePlan: () => Promise<PlanData | null>;
  savePlan: (planData: PlanData) => Promise<boolean>;
  editPreferences: () => void;
  clearError: () => void;
  clearSaveSuccess: () => void;
}

const ONBOARDING_STORAGE_KEY = 'wellnourish_onboarding_data';
const ONBOARDING_STEP_KEY = 'wellnourish_onboarding_step';
const EDIT_MODE_KEY = 'wellnourish_edit_mode';

export function usePlanActions(options: UsePlanActionsOptions = {}): UsePlanActionsReturn {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const clearError = useCallback(() => setError(null), []);
  const clearSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  /**
   * Regenerate the plan by calling the generate-plan API
   */
  const regeneratePlan = useCallback(async (): Promise<PlanData | null> => {
    const storedFormData = sessionStorage.getItem('planFormData');
    
    if (!storedFormData) {
      const errorMsg = 'No form data found. Please go back to onboarding.';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    }

    setIsRegenerating(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const formData = JSON.parse(storedFormData);
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate plan');
      }

      const newPlan: PlanData = await response.json();
      
      // Store the new plan in session storage
      sessionStorage.setItem('generatedPlan', JSON.stringify(newPlan));
      
      options.onPlanUpdate?.(newPlan);
      return newPlan;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to regenerate plan';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    } finally {
      setIsRegenerating(false);
    }
  }, [options]);

  /**
   * Save the plan to Supabase via the save-plan API
   */
  const savePlan = useCallback(async (planData: PlanData): Promise<boolean> => {
    if (!planData) {
      const errorMsg = 'No plan data to save';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planData.plan_id,
          plan_data: planData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save plan');
      }

      const result = await response.json();
      
      // Update the plan_id if it was newly created
      if (result.plan_id && !planData.plan_id) {
        const updatedPlan = { ...planData, plan_id: result.plan_id };
        sessionStorage.setItem('generatedPlan', JSON.stringify(updatedPlan));
        options.onPlanUpdate?.(updatedPlan);
      }

      setSaveSuccess(true);
      options.onSaveSuccess?.();
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save plan';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [options]);

  /**
   * Navigate to onboarding page with preloaded values
   */
  const editPreferences = useCallback(() => {
    setIsEditingPreferences(true);

    try {
      // Get the stored form data and convert it to onboarding format
      const storedFormData = sessionStorage.getItem('planFormData');
      
      if (storedFormData) {
        const formData = JSON.parse(storedFormData);
        
        // Map the API format back to onboarding format
        const onboardingData = {
          age: formData.age,
          height_cm: formData.height_cm,
          weight_kg: formData.weight_kg,
          gender: formData.gender,
          dietary_preferences: formData.dietary_preferences || [],
          cuisine_preferences: formData.cuisine_preferences || [],
          allergies: formData.allergies || [],
          goal: formData.goal,
          activity_level: formData.activity_level,
          // Optional fields
          target_weight_kg: formData.target_weight_kg,
          meals_per_day: formData.meals_per_day,
          snacks_per_day: formData.snacks_per_day,
          workouts_per_week: formData.workouts_per_week,
          workout_duration_minutes: formData.workout_duration_minutes,
          fitness_level: formData.fitness_level,
          cooking_time_preference: formData.cooking_time_preference,
          budget_level: formData.budget_level,
        };

        // Store in localStorage for onboarding to pick up
        localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(onboardingData));
        localStorage.setItem(ONBOARDING_STEP_KEY, '1');
        localStorage.setItem(EDIT_MODE_KEY, 'true');
      }

      // Navigate to onboarding
      router.push('/onboarding');
    } catch (err) {
      console.error('Error preparing preferences for edit:', err);
      // Still navigate even if there was an error
      router.push('/onboarding');
    } finally {
      setIsEditingPreferences(false);
    }
  }, [router]);

  return {
    isRegenerating,
    isSaving,
    isEditingPreferences,
    error,
    saveSuccess,
    regeneratePlan,
    savePlan,
    editPreferences,
    clearError,
    clearSaveSuccess,
  };
}
