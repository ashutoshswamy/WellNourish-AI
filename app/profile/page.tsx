"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/components/AuthProvider"
import { createClient } from "@/utils/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileData } from "@/app/onboarding/schema"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Loader2, Save, User, Mail, Link2, Unlink } from "lucide-react"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth()
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
  const [linking, setLinking] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [customGoal, setCustomGoal] = useState("")
  
  // New state for setting password
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()



  const fetchProfile = useCallback(async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        if (data.age) setValue("age", data.age)
        if (data.gender) setValue("gender", data.gender as "male" | "female" | "other")
        if (data.height) setValue("height", data.height)
        if (data.weight) setValue("weight", data.weight)
        if (data.activity_level) setValue("activityLevel", data.activity_level as "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active")
        
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
  }, [user, supabase, setValue])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchProfile()
    }
  }, [user, authLoading, router, supabase, fetchProfile])

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

  const linkAccount = async (provider: "google" | "github") => {
    setLinking(provider)
    setMessage(null)
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      })
      if (error) {
        console.error(`Supabase linkIdentity error:`, error)
        throw error
      }
      // If successful, this should redirect to provider OAuth page
      // So we only reach here if there's an issue
      if (!data?.url) {
        throw new Error("No redirect URL returned from Supabase")
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(`Error linking ${provider}:`, error)
      const errorMessage = error?.message || `Failed to link ${provider}. Please try again.`
      setMessage({ type: 'error', text: errorMessage })
      setLinking(null)
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      setMessage({ type: 'success', text: 'Password set successfully! You can now log in with email/password.' })
      setNewPassword("")
      setConfirmPassword("")
      setIsSettingPassword(false)
      await refreshUser()
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Error setting password:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to set password' })
    } finally {
      setSaving(false)
    }
  }

  const unlinkAccount = async (provider: "google" | "github") => {
    setLinking(provider)
    setMessage(null)
    try {
      const identity = user?.identities?.find(i => i.provider === provider)
      if (!identity) throw new Error("Identity not found")
      
      // Check if we have another identity (OAuth or email) to log in with
      const otherIdentities = user?.identities?.filter(i => i.provider !== provider) || []
      if (otherIdentities.length === 0) {
        throw new Error("Cannot disconnect your only login method. Please connect another account (Google or GitHub) first.")
      }
      
      const { error } = await supabase.auth.unlinkIdentity(identity)
      if (error) throw error
      
      setMessage({ type: 'success', text: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected.` })
      // Refresh the user data
      await refreshUser()
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(`Error unlinking ${provider}:`, error)
      const errorMessage = error?.message || `Failed to unlink ${provider}. You must have at least one login method.`
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setLinking(null)
    }
  }

  // Get user info
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User"
  const userEmail = user?.email || ""
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  
  // Get connected providers from actual identities
  const identities = user?.identities || []
  // const identityCount = identities.length
  const connectedProviders = identities.map(i => i.provider)
  const isGoogleConnected = connectedProviders.includes("google")
  const isGithubConnected = connectedProviders.includes("github")
  
  // Check if user signed up with email/password (has email identity)
  const hasEmailIdentity = connectedProviders.includes("email")
  
  // Count OAuth providers (exclude email)
  const oauthProviderCount = connectedProviders.filter(p => p !== "email").length
  
  // User can disconnect an OAuth account if:
  // 1. They have an email identity (signed up with email/password) - can disconnect any OAuth
  // 2. They have more than 1 OAuth provider - can disconnect one but must keep at least one
  // NOTE: Setting a password via updateUser does NOT create a new identity, so it doesn't help
  const canDisconnectOAuth = hasEmailIdentity || (oauthProviderCount > 1)
  const canDisconnectGoogle = isGoogleConnected && canDisconnectOAuth
  const canDisconnectGithub = isGithubConnected && canDisconnectOAuth

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

            {/* User Info Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-100 dark:border-emerald-800/50">
              <div className="flex items-center gap-4">
                {userAvatar ? (
                  <Image 
                    src={userAvatar} 
                    alt={userName}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border-2 border-white dark:border-slate-700 shadow-md"
                    unoptimized={userAvatar.startsWith('http')}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-md">
                    <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{userName}</h2>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Accounts Section */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Link2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connected Accounts</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Connect your accounts for easier sign-in and enhanced security.
              </p>
              
              {/* Show warning if user has only one OAuth connection and can't disconnect */}
              {!hasEmailIdentity && oauthProviderCount === 1 && !isSettingPassword && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Note:</strong> To disconnect your account, please connect another account or <button onClick={() => setIsSettingPassword(true)} className="underline font-semibold hover:text-amber-800 dark:hover:text-amber-300">set a password</button> first.
                  </p>
                </div>
              )}
              
              {/* Set Password Section */}
              {!hasEmailIdentity && (
                <div className="mb-4">
                  {isSettingPassword ? (
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Set Password</h4>
                      <p className="text-xs text-slate-500 mb-3">Set a password to log in with email and enable disconnecting social accounts.</p>
                      <form onSubmit={handleSetPassword} className="space-y-3">
                        <input
                          type="password"
                          placeholder="New Password (min 6 chars)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={inputClass}
                        />
                         <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={inputClass}
                        />
                        <div className="flex gap-2 justify-end">
                           <Button type="button" variant="ghost" size="sm" onClick={() => setIsSettingPassword(false)}>Cancel</Button>
                           <Button type="submit" size="sm" disabled={saving}>
                             {saving ? "Saving..." : "Set Password"}
                           </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                     <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-slate-400" />
                             <div>
                                <p className="font-medium text-slate-900 dark:text-white">Email & Password</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Not set</p>
                            </div>
                         </div>
                         <Button variant="outline" size="sm" onClick={() => setIsSettingPassword(true)}>
                            Set Password
                         </Button>
                     </div>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                {/* Google */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Icons.google className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Google</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isGoogleConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isGoogleConnected ? "outline" : "primary"}
                    size="sm"
                    onClick={() => isGoogleConnected ? unlinkAccount("google") : linkAccount("google")}
                    disabled={linking === "google" || (isGoogleConnected && !canDisconnectGoogle)}
                    className={isGoogleConnected ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed" : ""}
                    title={isGoogleConnected && !canDisconnectGoogle ? "Connect another account to disconnect this one" : undefined}
                  >
                    {linking === "google" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isGoogleConnected ? (
                      <>
                        <Unlink className="h-4 w-4 mr-1" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Icons.github className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">GitHub</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isGithubConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isGithubConnected ? "outline" : "primary"}
                    size="sm"
                    onClick={() => isGithubConnected ? unlinkAccount("github") : linkAccount("github")}
                    disabled={linking === "github" || (isGithubConnected && !canDisconnectGithub)}
                    className={isGithubConnected ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed" : ""}
                    title={isGithubConnected && !canDisconnectGithub ? "Connect another account to disconnect this one" : undefined}
                  >
                    {linking === "github" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isGithubConnected ? (
                      <>
                        <Unlink className="h-4 w-4 mr-1" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Health Data Section Title */}
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Health Data</h3>
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
