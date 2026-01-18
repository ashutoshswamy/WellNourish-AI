"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import { createClient } from "@/utils/supabase/client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileData } from "@/app/onboarding/schema"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Loader2, Save, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { control, handleSubmit, register, setValue, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      cuisinePreferences: [],
      dietaryPreferences: [],
      medicalConditions: [],
      allergies: [],
      goals: [],
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [customGoal, setCustomGoal] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchProfile()
    }
  }, [user, authLoading])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        if (data.age) setValue("age", data.age)
        if (data.gender) setValue("gender", data.gender as any)
        if (data.height) setValue("height", data.height)
        if (data.weight) setValue("weight", data.weight)
        if (data.activity_level) setValue("activityLevel", data.activity_level as any)
        
        if (data.cuisine_preferences) setValue("cuisinePreferences", data.cuisine_preferences)
        if (data.dietary_preferences) setValue("dietaryPreferences", data.dietary_preferences)
        if (data.medical_conditions) setValue("medicalConditions", data.medical_conditions)
        if (data.allergies) setValue("allergies", data.allergies)
        if (data.goals) setValue("goals", data.goals)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomGoal = () => {
    if (!customGoal.trim()) return
    const current = (control._formValues.goals || []) as string[]
    if (!current.includes(customGoal.trim())) {
      setValue("goals", [...current, customGoal.trim()], { shouldValidate: true })
    }
    setCustomGoal("")
  }

  const onSubmit = async (data: ProfileData) => {
    setSaving(true)
    setMessage(null)

    try {
      const updates = {
        id: user!.id,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        activity_level: data.activityLevel,
        goals: data.goals,
        dietary_preferences: data.dietaryPreferences,
        cuisine_preferences: data.cuisinePreferences,
        medical_conditions: data.medicalConditions,
        allergies: data.allergies,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Common input class for high visibility
  const inputClass = "w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Profile</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your personal health data for better AI recommendations.</p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
                  <input
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    className={inputClass}
                    placeholder="e.g. 30"
                  />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                  <select
                    {...register("gender")}
                    className={inputClass}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Height (cm)</label>
                  <input
                    type="number"
                    {...register("height", { valueAsNumber: true })}
                    className={inputClass}
                    placeholder="e.g. 175"
                  />
                  {errors.height && <p className="text-red-500 text-xs">{errors.height.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weight (kg)</label>
                  <input
                    type="number"
                    {...register("weight", { valueAsNumber: true })}
                    className={inputClass}
                    placeholder="e.g. 70"
                  />
                  {errors.weight && <p className="text-red-500 text-xs">{errors.weight.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity Level</label>
                <select
                  {...register("activityLevel")}
                  className={inputClass}
                >
                  <option value="">Select Activity Level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="lightly_active">Lightly active (light exercise 1-3 days/week)</option>
                  <option value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</option>
                  <option value="very_active">Very active (hard exercise 6-7 days/week)</option>
                  <option value="extra_active">Extra active (very hard exercise & physical job)</option>
                </select>
                 {errors.activityLevel && <p className="text-red-500 text-xs">{errors.activityLevel.message}</p>}
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Goals</label>
                <div className="flex flex-wrap gap-2 mb-3">
                   {(control._formValues.goals || [])
                    .filter((g: string) => !["Weight Loss", "Muscle Gain", "Maintenance", "Better Energy", "Improve Digestion"].includes(g))
                    .concat(["Weight Loss", "Muscle Gain", "Maintenance", "Better Energy", "Improve Digestion"])
                    // Remove duplicates just in case, though logic should prevent them
                    .reduce((acc: string[], curr: string) => acc.includes(curr) ? acc : [...acc, curr], [])
                    .map((g: string) => (
                     <button
                       key={g}
                       type="button"
                       onClick={() => {
                          const current = (control._formValues.goals || []) as string[]
                          if (current.includes(g)) setValue("goals", current.filter(x => x !== g), { shouldValidate: true })
                          else setValue("goals", [...current, g], { shouldValidate: true })
                       }}
                       className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${(control._formValues.goals || []).includes(g) ? "bg-emerald-100 border-emerald-500 text-emerald-800 font-medium" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
                     >
                       {g}
                     </button>
                   ))}
                </div>
                
                <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomGoal()
                        }
                      }}
                      className={inputClass}
                      placeholder="Add custom goal (e.g. Marathon Training)"
                    />
                    <Button type="button" onClick={addCustomGoal} variant="outline" className="shrink-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        Add
                    </Button>
                </div>

                {errors.goals && <p className="text-red-500 text-xs">{errors.goals.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dietary Preferences</label>
                   <input
                    type="text"
                    {...register("dietaryPreferences", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                    className={inputClass}
                    placeholder="e.g. Vegetarian, Keto (comma separated)"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500">Separate with commas</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cuisine Preferences</label>
                   <input
                    type="text"
                    {...register("cuisinePreferences", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                    className={inputClass}
                    placeholder="e.g. Italian, Mexican (comma separated)"
                  />
                  {errors.cuisinePreferences && <p className="text-red-500 text-xs">{errors.cuisinePreferences.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Medical Conditions</label>
                  <input
                    type="text"
                    {...register("medicalConditions", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                    className={inputClass}
                    placeholder="e.g. Diabetes (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Allergies</label>
                  <input
                    type="text"
                     {...register("allergies", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                    className={inputClass}
                    placeholder="e.g. Peanuts (comma separated)"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" size="lg" disabled={saving} className="w-full sm:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
