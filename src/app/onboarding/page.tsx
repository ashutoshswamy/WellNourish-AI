'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingStepper } from '@/components/OnboardingStepper';
import {
  BasicInfoForm,
  DietaryPreferencesForm,
  CuisinePreferencesForm,
  AllergiesForm,
  GoalsForm,
} from '@/components/forms';
import {
  onboardingSchema,
  basicInfoSchema,
  dietaryPreferencesSchema,
  cuisinePreferencesSchema,
  allergiesSchema,
  goalsSchema,
  type OnboardingData,
} from '@/lib/validations/onboarding';
import { createClient } from '@/lib/supabase/client';
import { isEditMode, loadPreferencesFromDatabase } from './loadPreferences';
import type { ActivityLevel, GoalType, DietaryPreference, GenderType } from '@/types/database.types';

const STORAGE_KEY = 'wellnourish_onboarding_data';
const STEP_KEY = 'wellnourish_onboarding_step';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Diet', description: 'Your dietary preferences' },
  { id: 3, title: 'Cuisine', description: 'Cuisine preferences' },
  { id: 4, title: 'Allergies', description: 'Food allergies' },
  { id: 5, title: 'Goals', description: 'Your health goals' },
];

const stepSchemas = [
  basicInfoSchema,
  dietaryPreferencesSchema,
  cuisinePreferencesSchema,
  allergiesSchema,
  goalsSchema,
];

const defaultValues: Partial<OnboardingData> = {
  age: undefined,
  height_cm: undefined,
  weight_kg: undefined,
  gender: undefined,
  dietary_preferences: [],
  cuisine_preferences: [],
  allergies: [],
  goal: '',
  activity_level: undefined,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingPreferences, setHasExistingPreferences] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitMode, setSubmitMode] = useState<'save' | 'generate' | 'save-generate'>('generate');
  const initialDataRef = useRef<string>('');

  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues, reset, watch, formState: { errors } } = methods;

  // Watch for form changes
  useEffect(() => {
    const subscription = watch((formData) => {
      if (initialDataRef.current && !isLoading) {
        const currentData = JSON.stringify(formData);
        setHasChanges(currentData !== initialDataRef.current);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        // Check if we're in edit mode
        const editMode = isEditMode();
        setIsEditing(editMode);

        const savedData = localStorage.getItem(STORAGE_KEY);
        const savedStep = localStorage.getItem(STEP_KEY);

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          reset({ ...defaultValues, ...parsedData });
          initialDataRef.current = JSON.stringify({ ...defaultValues, ...parsedData });
          setHasExistingPreferences(true);
        } else {
          // Try loading from database
          const dbPreferences = await loadPreferencesFromDatabase();
          if (dbPreferences) {
            // Map gender - prefer_not_to_say is mapped to other for form compatibility
            const mappedGender = dbPreferences.gender === 'prefer_not_to_say' 
              ? 'other' 
              : dbPreferences.gender as 'male' | 'female' | 'other' | undefined;
            
            const formData = {
              ...defaultValues,
              age: dbPreferences.age,
              height_cm: dbPreferences.height_cm,
              weight_kg: dbPreferences.weight_kg,
              gender: mappedGender,
              dietary_preferences: dbPreferences.dietary_preferences || [],
              cuisine_preferences: dbPreferences.cuisine_preferences || [],
              allergies: dbPreferences.allergies || [],
              goal: dbPreferences.goal || '',
              activity_level: dbPreferences.activity_level as 'sedentary' | 'light' | 'moderate' | 'active' | undefined,
            };
            reset(formData);
            initialDataRef.current = JSON.stringify(formData);
            setHasExistingPreferences(true);
          }
        }

        if (savedStep) {
          const step = parseInt(savedStep, 10);
          if (step >= 1 && step <= steps.length) {
            setCurrentStep(step);
          }
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProgress();
  }, [reset]);

  // Save progress whenever form data or step changes
  const saveProgress = useCallback(() => {
    try {
      const formData = getValues();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STEP_KEY, currentStep.toString());
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [getValues, currentStep]);

  // Save on step change
  useEffect(() => {
    if (!isLoading) {
      saveProgress();
    }
  }, [currentStep, isLoading, saveProgress]);

  // Auto-save form data periodically
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      saveProgress();
    }, 2000); // Save every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading, saveProgress]);

  const clearSavedProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  };

  const validateCurrentStep = async () => {
    const stepSchema = stepSchemas[currentStep - 1];
    const fieldsToValidate = Object.keys(stepSchema.shape) as (keyof OnboardingData)[];
    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      saveProgress();
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    saveProgress();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    const shouldGenerate = submitMode === 'generate' || submitMode === 'save-generate';

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Map activity level to database enum
      const activityLevelMap: Record<string, ActivityLevel> = {
        'sedentary': 'sedentary',
        'light': 'lightly_active',
        'moderate': 'moderately_active',
        'active': 'very_active',
      };

      // Map dietary preference to database enum
      const mapDietaryPreference = (pref: string): DietaryPreference => {
        const validPreferences: DietaryPreference[] = [
          'none', 'vegetarian', 'vegan', 'pescatarian', 
          'keto', 'paleo', 'mediterranean', 'gluten_free', 'dairy_free'
        ];
        return validPreferences.includes(pref as DietaryPreference) 
          ? (pref as DietaryPreference) 
          : 'none';
      };

      // Map gender to database enum
      const mapGender = (gender: string): GenderType => {
        const validGenders: GenderType[] = ['male', 'female', 'other', 'prefer_not_to_say'];
        return validGenders.includes(gender as GenderType) 
          ? (gender as GenderType) 
          : 'prefer_not_to_say';
      };

      // Upsert profile with basic info (handles case where profile doesn't exist)
      const profileData = {
        id: user.id,
        email: user.email!,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        gender: mapGender(data.gender),
        // Calculate date_of_birth from age (approximate)
        date_of_birth: new Date(
          new Date().getFullYear() - data.age,
          0,
          1
        ).toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData as never, {
          onConflict: 'id',
        });

      if (profileError) {
        throw profileError;
      }

      // Upsert user preferences
      const userPreferences = {
        user_id: user.id,
        activity_level: activityLevelMap[data.activity_level] || 'sedentary',
        goal: data.goal as GoalType,
        dietary_preference: mapDietaryPreference(data.dietary_preferences[0] || 'none'),
        allergies: data.allergies,
        preferred_cuisines: data.cuisine_preferences,
        updated_at: new Date().toISOString(),
        // Required fields with defaults
        meals_per_day: 3,
        snacks_per_day: 1,
        workouts_per_week: 3,
        workout_duration_minutes: 45,
      };

      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert(userPreferences as never, {
          onConflict: 'user_id',
        });

      if (preferencesError) {
        throw preferencesError;
      }

      // Clear saved progress on successful submission
      clearSavedProgress();

      // Prepare form data for plan generation
      const planFormData = {
        age: data.age,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        gender: mapGender(data.gender),
        dietary_preferences: data.dietary_preferences,
        cuisine_preferences: data.cuisine_preferences,
        allergies: data.allergies,
        goal: data.goal,
        activity_level: activityLevelMap[data.activity_level] || 'sedentary',
        duration_days: 7,
      };

      // Store form data for plan generation
      sessionStorage.setItem('planFormData', JSON.stringify(planFormData));

      if (shouldGenerate) {
        // Generate the plan
        const response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planFormData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate plan');
        }

        const generatedPlan = await response.json();
        
        // Store the generated plan
        sessionStorage.setItem('generatedPlan', JSON.stringify(generatedPlan));

        // Redirect to plan page to view the generated plan
        router.push('/plan');
      } else {
        // Just saved, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert('Failed to save your preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoForm />;
      case 2:
        return <DietaryPreferencesForm />;
      case 3:
        return <CuisinePreferencesForm />;
      case 4:
        return <AllergiesForm />;
      case 5:
        return <GoalsForm />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome to WellNourish AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Let&apos;s personalize your experience
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-6 sm:mb-8">
          <OnboardingStepper currentStep={currentStep} steps={steps} />
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 min-h-[350px] sm:min-h-[400px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-4 sm:mt-6 gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Back
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
                >
                  Continue
                </button>
              ) : (
                <div className="flex gap-2 sm:gap-3 flex-wrap justify-end">
                  {/* Show different buttons based on whether user has existing preferences and made changes */}
                  {hasExistingPreferences || isEditing ? (
                    hasChanges ? (
                      <>
                        {/* User has changes - show Save and Save & Generate */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => setSubmitMode('save')}
                          className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-foreground rounded-lg font-medium transition-all text-sm sm:text-base ${
                            isSubmitting
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {isSubmitting && submitMode === 'save' ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="hidden sm:inline">Saving...</span>
                            </span>
                          ) : (
                            'Save'
                          )}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => setSubmitMode('save-generate')}
                          className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 text-white rounded-lg font-medium transition-all text-sm sm:text-base ${
                            isSubmitting
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-emerald-600'
                          }`}
                        >
                          {isSubmitting && submitMode === 'save-generate' ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="hidden sm:inline">Generating...</span>
                            </span>
                          ) : (
                            <span className="whitespace-nowrap">Save & Generate</span>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* No changes - show Generate or Save */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => setSubmitMode('save')}
                          className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-foreground rounded-lg font-medium transition-all text-sm sm:text-base ${
                            isSubmitting
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {isSubmitting && submitMode === 'save' ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="hidden sm:inline">Saving...</span>
                            </span>
                          ) : (
                            'Save'
                          )}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => setSubmitMode('generate')}
                          className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 text-white rounded-lg font-medium transition-all text-sm sm:text-base ${
                            isSubmitting
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-emerald-600'
                          }`}
                        >
                          {isSubmitting && submitMode === 'generate' ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="hidden sm:inline">Generating...</span>
                            </span>
                          ) : (
                            'Generate'
                          )}
                        </button>
                      </>
                    )
                  ) : (
                    /* New user - show Complete Setup */
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => setSubmitMode('generate')}
                      className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-emerald-500 text-white rounded-lg font-medium transition-all text-sm sm:text-base ${
                        isSubmitting
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-emerald-600'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="hidden sm:inline">Setting up...</span>
                        </span>
                      ) : (
                        'Complete Setup'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </form>
        </FormProvider>

        {/* Back to Dashboard option */}
        <div className="text-center mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && Object.keys(errors).length > 0 && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
            <p className="font-medium">Validation Errors:</p>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(errors, (key, value) => {
                // Skip 'ref' properties to avoid circular references from DOM elements
                if (key === 'ref') return undefined;
                return value;
              }, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
