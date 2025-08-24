'use server'

import { generatePersonalizedDietPlan, type GeneratePersonalizedDietPlanInput } from '@/ai/flows/generate-personalized-diet-plan'
import { generateCustomWorkoutPlan, type GenerateCustomWorkoutPlanInput } from '@/ai/flows/generate-custom-workout-plan'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDietPlan(input: { preferences: string; goals: string }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data: profile } = await supabase.from('profiles').select('health_profile').eq('id', user.id).single()

  const aiInput: GeneratePersonalizedDietPlanInput = {
    healthProfile: profile?.health_profile || 'No detailed health profile provided.',
    preferences: input.preferences,
    goals: input.goals,
  }

  const plan = await generatePersonalizedDietPlan(aiInput)
  return plan
}

export async function createWorkoutPlan(input: Omit<GenerateCustomWorkoutPlanInput, 'fitnessLevel'> & { fitnessLevel: string }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const aiInput: GenerateCustomWorkoutPlanInput = {
    fitnessLevel: input.fitnessLevel as 'Beginner' | 'Intermediate' | 'Advanced',
    goals: input.goals,
    equipment: input.equipment,
  }

  const plan = await generateCustomWorkoutPlan(aiInput)
  return plan
}

export async function savePlan(planData: { name: string; type: 'diet' | 'workout'; content: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to save a plan.' };
  }

  const { error } = await supabase.from('plans').insert({
    user_id: user.id,
    name: planData.name,
    type: planData.type,
    content: planData.content,
  });

  if (error) {
    console.error('Error saving plan:', error);
    return { success: false, error: 'Failed to save the plan. Please try again.' };
  }

  revalidatePath('/my-plans');
  return { success: true };
}
