'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update your profile.' }
  }

  const profileData = {
    id: user.id,
    age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
    height: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
    weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
    gender: formData.get('gender') as string,
    activity_level: formData.get('activityLevel') as string,
    dietery_preferences: formData.get('dietaryPreferences') as string,
    preferred_cuisine: formData.get('preferredCuisine') as string,
    medical_conditions: formData.get('medicalConditions') as string,
    allergies: formData.get('allergies') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').upsert(profileData)

  if (error) {
    console.error('Error updating profile:', error)
    return redirect(`/profile?error=${encodeURIComponent('Failed to update profile.')}`)
  }

  revalidatePath('/profile')
  revalidatePath('/generate')
  redirect('/profile?success=true')
}
