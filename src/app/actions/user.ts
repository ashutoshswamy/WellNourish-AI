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
    full_name: formData.get('fullName') as string,
    fitness_level: formData.get('fitnessLevel') as string,
    goals: formData.get('goals') as string,
    health_profile: formData.get('healthProfile') as string,
    preferences: formData.get('preferences') as string,
    equipment: formData.get('equipment') as string,
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
