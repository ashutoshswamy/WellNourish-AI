'use server'

import { generatePersonalizedDietPlan, type GeneratePersonalizedDietPlanInput } from '@/ai/flows/generate-personalized-diet-plan'
import { generateCustomWorkoutPlan, type GenerateCustomWorkoutPlanInput } from '@/ai/flows/generate-custom-workout-plan'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDietPlan() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const aiInput: GeneratePersonalizedDietPlanInput = {
    age: profile?.age,
    height: profile?.height,
    weight: profile?.weight,
    gender: profile?.gender,
    activityLevel: profile?.activity_level,
    medicalConditions: profile?.medical_conditions,
    dietaryPreferences: profile?.dietary_preferences,
    preferredCuisine: profile?.preferred_cuisine,
    allergies: profile?.allergies,
  }

  const plan = await generatePersonalizedDietPlan(aiInput)
  return { ...plan, profile_data: profile }
}

export async function createWorkoutPlan() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const aiInput: GenerateCustomWorkoutPlanInput = {
    age: profile?.age,
    height: profile?.height,
    weight: profile?.weight,
    gender: profile?.gender,
    activityLevel: profile?.activity_level || 'Sedentary',
    medicalConditions: profile?.medical_conditions,
    allergies: profile?.allergies,
  }

  const plan = await generateCustomWorkoutPlan(aiInput)
  return { ...plan, profile_data: profile }
}

export async function savePlan(planData: { diet_plan: string | null, workout_plan: string | null, health_tips: string | null, profile_data: any }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to save a plan.' };
  }

  const { error } = await supabase.from('plans').insert({
    user_id: user.id,
    diet_plan: planData.diet_plan,
    workout_plan: planData.workout_plan,
    health_tips: planData.health_tips,
    profile_data: planData.profile_data,
  });

  if (error) {
    console.error('Error saving plan:', error);
    return { success: false, error: 'Failed to save the plan. Please try again.' };
  }

  revalidatePath('/my-plans');
  return { success: true };
}
