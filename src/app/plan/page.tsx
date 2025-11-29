'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MealPlanCard from '@/components/MealPlanCard';
import WorkoutPlanCard from '@/components/WorkoutPlanCard';
import WarningsBox from '@/components/WarningsBox';
import { createClient } from '@/lib/supabase/client';
import type { MealPlanData, WorkoutPlanData } from '@/types/database.types';
import { formatNumber, formatGrams } from '@/utils/formatNumber';

interface PlanData {
  success: boolean;
  plan_id?: string;
  summary: string;
  daily_calories: number;
  meal_plan: MealPlanData;
  workout_plan: WorkoutPlanData;
  warnings: string[];
  confidence_score: number;
  metadata?: {
    created_at: string;
    plan_type: string;
    duration_days: number;
    tokens_used: number | null;
    goal?: string;
  };
}

function PlanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('id');
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load plan data from sessionStorage, URL param, or fetch from database
  useEffect(() => {
    const loadPlan = async () => {
      // If there's a plan ID in the URL, fetch that specific plan
      if (planId) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            setError('Please log in to view your plan.');
            setIsLoading(false);
            return;
          }

          // Fetch the specific plan by ID
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: plan, error: fetchError } = await (supabase as any)
            .from('generated_plans')
            .select('*')
            .eq('id', planId)
            .eq('user_id', user.id)
            .single();

          if (fetchError || !plan) {
            setError('Plan not found or you do not have permission to view it.');
            setIsLoading(false);
            return;
          }

          // Convert database plan to PlanData format
          const convertedPlan: PlanData = {
            success: true,
            plan_id: plan.id,
            summary: `Your personalized ${plan.plan_type} plan for ${plan.duration_days} days`,
            daily_calories: plan.daily_calories || 2000,
            meal_plan: plan.meal_plan || { days: [] },
            workout_plan: plan.workout_plan || { weeks: [] },
            warnings: [],
            confidence_score: 85,
            metadata: {
              created_at: plan.created_at,
              plan_type: plan.plan_type,
              duration_days: plan.duration_days,
              tokens_used: plan.generation_tokens,
              goal: plan.goal || null,
            },
          };

          setPlanData(convertedPlan);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error('Error loading plan:', err);
          setError('Failed to load plan. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      // First try sessionStorage (for newly generated plans)
      const storedPlan = sessionStorage.getItem('generatedPlan');
      if (storedPlan) {
        try {
          const parsed = JSON.parse(storedPlan);
          setPlanData(parsed);
          setIsLoading(false);
          return;
        } catch {
          // Continue to fetch from database
        }
      }

      // If no sessionStorage data, try to fetch the active plan from database
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Please log in to view your plan.');
          setIsLoading(false);
          return;
        }

        // Fetch the most recent active plan
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: activePlan, error: fetchError } = await (supabase as any)
          .from('generated_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError || !activePlan) {
          setError('No plan found. Please generate a plan first.');
          setIsLoading(false);
          return;
        }

        // Convert database plan to PlanData format
        const convertedPlan: PlanData = {
          success: true,
          plan_id: activePlan.id,
          summary: `Your personalized ${activePlan.plan_type} plan for ${activePlan.duration_days} days`,
          daily_calories: activePlan.daily_calories || 2000,
          meal_plan: activePlan.meal_plan || { days: [] },
          workout_plan: activePlan.workout_plan || { weeks: [] },
          warnings: [],
          confidence_score: 85,
          metadata: {
            created_at: activePlan.created_at,
            plan_type: activePlan.plan_type,
            duration_days: activePlan.duration_days,
            tokens_used: activePlan.generation_tokens,
            goal: activePlan.goal || null,
          },
        };

        setPlanData(convertedPlan);
        // Store in sessionStorage for faster subsequent loads
        sessionStorage.setItem('generatedPlan', JSON.stringify(convertedPlan));
      } catch (err) {
        console.error('Error loading plan:', err);
        setError('Failed to load plan. Please try again.');
      }
      
      setIsLoading(false);
    };

    loadPlan();
  }, [planId]);

  // Regenerate plan
  const handleRegenerate = useCallback(async () => {
    const storedFormData = sessionStorage.getItem('planFormData');
    if (!storedFormData) {
      // Try to redirect to onboarding if no form data
      router.push('/onboarding');
      return;
    }

    setIsRegenerating(true);
    setError(null);

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

      const newPlan = await response.json();
      setPlanData(newPlan);
      sessionStorage.setItem('generatedPlan', JSON.stringify(newPlan));
      setSaveSuccess(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate plan');
    } finally {
      setIsRegenerating(false);
    }
  }, []);

  // Save plan to Supabase
  const handleSave = useCallback(async () => {
    if (!planData || !planData.plan_id) {
      setError('No plan to save');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      // Update the plan to mark it as favorite/saved
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('generated_plans')
        .update({ is_favorite: true })
        .eq('id', planData.plan_id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSaveSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plan');
    } finally {
      setIsSaving(false);
    }
  }, [planData]);

  // Delete plan
  const handleDelete = useCallback(async () => {
    if (!planData || !planData.plan_id) {
      setError('No plan to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deleteError } = await (supabase as any)
        .from('generated_plans')
        .delete()
        .eq('id', planData.plan_id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Clear sessionStorage and redirect to dashboard
      sessionStorage.removeItem('generatedPlan');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete plan');
    } finally {
      setIsDeleting(false);
    }
  }, [planData, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (error && !planData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Oops!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="mt-6 rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (!planData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-gray-300 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shrink-0"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  Your Wellness Plan
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Generated with AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-gray-300 bg-white px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isRegenerating ? (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Regenerating...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">Regenerate</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors disabled:cursor-not-allowed ${
                  saveSuccess
                    ? 'bg-green-500'
                    : 'bg-green-600 hover:bg-green-700 disabled:opacity-50'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">Saved!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="hidden sm:inline">Save Plan</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-red-300 bg-white px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                {isDeleting ? (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Warnings */}
        <div className="mb-6">
          <WarningsBox warnings={planData.warnings} />
        </div>

        {/* Daily Calorie Summary Card */}
        <div className="mb-6 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 sm:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-medium text-green-100">Daily Target</h2>
              <p className="mt-0.5 sm:mt-1 text-2xl sm:text-4xl font-bold">{formatNumber(planData.daily_calories)} calories</p>
            </div>
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-1">
              <div className="rounded-lg sm:rounded-xl bg-white/20 p-2.5 sm:p-4 text-center backdrop-blur-sm min-w-[60px] sm:min-w-[80px]">
                <div className="text-lg sm:text-2xl font-bold">
                  {formatGrams(planData.meal_plan.days[0]?.total_protein_g || 0)}
                </div>
                <div className="text-[10px] sm:text-xs text-green-100">Protein</div>
              </div>
              <div className="rounded-lg sm:rounded-xl bg-white/20 p-2.5 sm:p-4 text-center backdrop-blur-sm min-w-[60px] sm:min-w-[80px]">
                <div className="text-lg sm:text-2xl font-bold">
                  {formatGrams(planData.meal_plan.days[0]?.total_carbs_g || 0)}
                </div>
                <div className="text-[10px] sm:text-xs text-green-100">Carbs</div>
              </div>
              <div className="rounded-lg sm:rounded-xl bg-white/20 p-2.5 sm:p-4 text-center backdrop-blur-sm min-w-[60px] sm:min-w-[80px]">
                <div className="text-lg sm:text-2xl font-bold">
                  {formatGrams(planData.meal_plan.days[0]?.total_fats_g || 0)}
                </div>
                <div className="text-[10px] sm:text-xs text-green-100">Fats</div>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap">
            {planData.metadata?.goal && (
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm backdrop-blur-sm">
                <span>🎯</span>
                <span className="capitalize">{planData.metadata.goal.replace(/_/g, ' ')}</span>
              </div>
            )}
            {planData.metadata?.plan_type && planData.metadata.plan_type !== 'combined' && (
              <div className="rounded-full bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm capitalize backdrop-blur-sm">
                {planData.metadata.plan_type} Plan
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Meal Plan */}
          <section>
            <MealPlanCard mealPlan={planData.meal_plan} />
          </section>

          {/* Workout Plan */}
          <section>
            <WorkoutPlanCard workoutPlan={planData.workout_plan} />
          </section>
        </div>
      </main>
    </div>
  );
}

function PlanPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your plan...</p>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanPageLoading />}>
      <PlanPageContent />
    </Suspense>
  );
}
