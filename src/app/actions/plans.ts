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
  if (!profile) throw new Error('Profile not found. Please complete your profile first.');

  const aiInput: GeneratePersonalizedDietPlanInput = {
    firstName: profile.first_name,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    gender: profile.gender,
    activityLevel: profile.activity_level,
    medicalConditions: profile.medical_conditions,
    dietaryPreferences: profile.dietary_preferences,
    preferredCuisine: profile.preferred_cuisine,
    allergies: profile.allergies,
  }

  const plan = await generatePersonalizedDietPlan(aiInput)
  return { ...plan, profile_snapshot: profile }
}

export async function createWorkoutPlan() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) throw new Error('Profile not found. Please complete your profile first.');


  const aiInput: GenerateCustomWorkoutPlanInput = {
    firstName: profile.first_name,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    gender: profile.gender,
    activityLevel: profile.activity_level || 'Sedentary',
    medicalConditions: profile.medical_conditions,
    allergies: profile.allergies,
  }

  const plan = await generateCustomWorkoutPlan(aiInput)
  return { ...plan, profile_snapshot: profile }
}

export async function savePlan(planData: { 
    name: string,
    type: 'diet' | 'workout' | 'hybrid',
    profile_snapshot: any,
    diet_plan_details: any | null,
    workout_plan_details: any | null,
    health_tips: string[]
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to save a plan.' };
  }

  const { error } = await supabase.from('plans').insert({
    user_id: user.id,
    name: planData.name,
    type: planData.type,
    profile_snapshot: planData.profile_snapshot,
    diet_plan_details: planData.diet_plan_details,
    workout_plan_details: planData.workout_plan_details,
    health_tips: planData.health_tips,
  });

  if (error) {
    console.error('Error saving plan:', error);
    return { success: false, error: 'Failed to save the plan. Please try again.' };
  }

  revalidatePath('/my-plans');
  return { success: true };
}
