"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/components/AuthProvider"
import { onboardingSchema, type OnboardingData } from "./schema"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

const STEPS = [
  { id: "basics", title: "The Basics", description: "Let's start with some fundamental details." },
  { id: "lifestyle", title: "Lifestyle", description: "How active are you currently?" },
  { id: "preferences", title: "Food Preferences", description: "What do you love to eat?" },
  { id: "health", title: "Health & Goals", description: "Any conditions we should know about?" },
]


export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const { control, handleSubmit, trigger, watch, register, setValue, formState: { errors } } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      cuisinePreferences: [],
      dietaryPreferences: [],
      medicalConditions: [],
      allergies: [],
      goals: [],
      planDuration: "7",
    }
  })

  const [foundProfile, setFoundProfile] = useState<any>(null)
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  const [customGoal, setCustomGoal] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        setFoundProfile(data)
        // If data exists, prompt the user
        // We only prompt if we are on step 0 and form is largely empty (checking age as proxy)
        const currentAge = watch("age")
        if (!currentAge) {
             setShowProfilePrompt(true)
        }
      }
    }

    fetchProfile()
  }, [user]) // Removed setValue and watch dependency to avoid loops

  const loadProfileData = () => {
      if (!foundProfile) return
      
      if (foundProfile.age) setValue("age", foundProfile.age)
      if (foundProfile.gender) setValue("gender", foundProfile.gender as any)
      if (foundProfile.height) setValue("height", foundProfile.height)
      if (foundProfile.weight) setValue("weight", foundProfile.weight)
      if (foundProfile.activity_level) setValue("activityLevel", foundProfile.activity_level as any)
      
      if (foundProfile.cuisine_preferences) setValue("cuisinePreferences", foundProfile.cuisine_preferences)
      if (foundProfile.dietary_preferences) setValue("dietaryPreferences", foundProfile.dietary_preferences)
      if (foundProfile.medical_conditions) setValue("medicalConditions", foundProfile.medical_conditions)
      if (foundProfile.allergies) setValue("allergies", foundProfile.allergies)
      if (foundProfile.goals) setValue("goals", foundProfile.goals)
      
      setShowProfilePrompt(false)
  }

  // Watch values for conditional rendering or UI feedback
  const watchGender = watch("gender")
  const watchActivity = watch("activityLevel")
  const watchGoals = watch("goals")

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingData)[] = []
    
    if (currentStep === 0) fieldsToValidate = ["age", "gender", "height", "weight"]
    if (currentStep === 1) fieldsToValidate = ["activityLevel"]
    // Step 2 & 3 are largely optional text arrays now, but good to validate just in case schema changes
    if (currentStep === 2) fieldsToValidate = ["cuisinePreferences", "dietaryPreferences"] 
    if (currentStep === 3) fieldsToValidate = ["goals", "medicalConditions", "allergies", "planDuration"]

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const prevStep = () => {
      if (currentStep === 0) {
          router.push("/dashboard")
      } else {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
      }
  }

  const onSubmit = async (data: OnboardingData) => {
    setIsGenerating(true)
    try {
      // 1. Update Profile first
      const supabase = createClient()
      if (user) {
          const updates = {
            id: user.id,
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
          
          await supabase.from('profiles').upsert(updates)
      }

      // 2. Generate Plan
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to generate plan")
      
      const planData = await response.json()
      
      // Inject user profile data into planData for history context
      planData.user_profile = {
        goals: data.goals,
        dietary_preferences: data.dietaryPreferences,
        cuisine_preferences: data.cuisinePreferences,
        calories: planData.nutrition_summary?.daily_calories
      }
      
      // Save locally (always as backup/latest)
      localStorage.setItem("wellnourish_plan", JSON.stringify(planData))
      
      if (user) {
        const { error } = await supabase.from("generated_plans").insert({
          user_id: user.id,
          plan_duration: data.planDuration,
          plan_data: planData
        })
        if (error) console.error("Failed to save plan to DB:", error)
      }
      
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Failed to generate plan. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Common input class
  const inputClass = "w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 border-gray-200 dark:border-gray-800 transition-all placeholder:text-gray-400"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
             <div key={step.id} className={cn("text-xs font-semibold uppercase tracking-wider", index <= currentStep ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")}>
               Step {index + 1}
             </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div 
        layout
        className="bg-white dark:bg-black w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className="p-8 md:p-12">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
               <div className="mb-8">
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{STEPS[currentStep].title}</h2>
                 <p className="text-gray-500 dark:text-gray-400">{STEPS[currentStep].description}</p>
               </div>

               <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Basics */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium mb-2">Age</label>
                          <input 
                            type="number" 
                            {...register("age", { valueAsNumber: true })} 
                            className={cn(inputClass, errors.age ? "border-red-500 focus:ring-red-500" : "")} 
                            placeholder="25" 
                          />
                          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-2">Gender</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["male", "female", "other"].map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setValue("gender", g as any, { shouldValidate: true })}
                                className={cn("p-3 rounded-xl border text-sm capitalize transition-all", watchGender === g ? "bg-emerald-100 border-emerald-500 text-emerald-800" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100", errors.gender && "border-red-500")}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-2">Height (cm)</label>
                          <input 
                            type="number" 
                            {...register("height", { valueAsNumber: true })} 
                            className={cn(inputClass, errors.height ? "border-red-500 focus:ring-red-500" : "")} 
                            placeholder="175" 
                          />
                          {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                          <input 
                            type="number" 
                            {...register("weight", { valueAsNumber: true })} 
                            className={cn(inputClass, errors.weight ? "border-red-500 focus:ring-red-500" : "")} 
                            placeholder="70" 
                          />
                          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                       </div>
                    </div>
                  )}

                  {/* Step 2: Activity */}
                  {currentStep === 1 && (
                     <div className="space-y-3">
                        {[
                          { val: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
                          { val: "lightly_active", label: "Lightly Active", desc: "Exercise 1-3 times/week" },
                          { val: "moderately_active", label: "Moderately Active", desc: "Exercise 4-5 times/week" },
                          { val: "very_active", label: "Very Active", desc: "Daily exercise or intense physical job" },
                          { val: "extra_active", label: "Extra Active", desc: "Very hard exercise & physical job" },
                        ].map((opt) => (
                           <button
                             key={opt.val}
                             type="button"
                             onClick={() => setValue("activityLevel", opt.val as any, { shouldValidate: true })}
                             className={cn("w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center group", watchActivity === opt.val ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500" : "bg-white border-gray-200 hover:border-emerald-300", errors.activityLevel && !watchActivity && "border-red-500")}
                           >
                             <div>
                               <div className={cn("font-medium", watchActivity === opt.val ? "text-emerald-800" : "text-gray-900")}>{opt.label}</div>
                               <div className="text-sm text-gray-500">{opt.desc}</div>
                             </div>
                             {watchActivity === opt.val && <Check className="h-5 w-5 text-emerald-600" />}
                           </button>
                        ))}
                        {errors.activityLevel && <p className="text-red-500 text-xs mt-1">{errors.activityLevel.message}</p>}
                     </div>
                  )}

                  {/* Step 3: Preferences (Now Inputs) */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                       <div>
                         <label className="block text-sm font-medium mb-3">Cuisines you enjoy (Comma separated)</label>
                         <input
                            type="text"
                            {...register("cuisinePreferences", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                            className={inputClass}
                            placeholder="Italian, Mexican, Thai..."
                          />
                         {errors.cuisinePreferences && <p className="text-red-500 text-xs mt-1">{errors.cuisinePreferences.message}</p>}
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium mb-3">Dietary Restrictions (Comma separated)</label>
                         <input
                            type="text"
                            {...register("dietaryPreferences", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                            className={inputClass}
                            placeholder="Vegetarian, Gluten-Free..."
                          />
                       </div>
                    </div>
                  )}

                   {/* Step 4: Health & Goals */}
                  {currentStep === 3 && (
                     <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Health Goals</label>
                          <div className="flex flex-wrap gap-3 mb-3">
                             {["Weight Loss", "Muscle Gain", "Maintenance", "Better Energy", "Improve Digestion"].concat(
                               (watchGoals || []).filter(g => !["Weight Loss", "Muscle Gain", "Maintenance", "Better Energy", "Improve Digestion"].includes(g))
                             )
                             // Unique items just in case
                             .filter((v, i, a) => a.indexOf(v) === i)
                             .map(g => (
                               <button
                                 key={g}
                                 type="button"
                                 onClick={() => {
                                    const current = watchGoals || []
                                    if (current.includes(g)) setValue("goals", current.filter(x => x !== g), { shouldValidate: true })
                                    else setValue("goals", [...current, g], { shouldValidate: true })
                                 }}
                                 className={cn("p-3 rounded-xl border text-sm text-center transition-all", (watchGoals || []).includes(g) ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium" : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", errors.goals && (watchGoals || []).length === 0 && "border-red-500")}
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
                                  if (!customGoal.trim()) return
                                  const current = watchGoals || []
                                  if (!current.includes(customGoal.trim())) {
                                    setValue("goals", [...current, customGoal.trim()], { shouldValidate: true })
                                  }
                                  setCustomGoal("")
                                }
                              }}
                              className={inputClass}
                              placeholder="Add custom goal (e.g. Marathon Training)"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                if (!customGoal.trim()) return
                                const current = watchGoals || []
                                if (!current.includes(customGoal.trim())) {
                                  setValue("goals", [...current, customGoal.trim()], { shouldValidate: true })
                                }
                                setCustomGoal("")
                              }}
                              className="shrink-0 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                            >
                                Add
                            </Button>
                          </div>
                          {errors.goals && <p className="text-red-500 text-xs mt-1">{errors.goals.message}</p>}
                        </div>

                        {/* Medical Conditions */}
                        <div>
                           <label className="block text-sm font-medium mb-3">Medical Conditions (Comma separated)</label>
                           <input
                              type="text"
                              {...register("medicalConditions", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                              className={inputClass}
                              placeholder="Diabetes, Hypertension... (Optional)"
                            />
                        </div>

                        {/* Allergies */}
                        <div>
                           <label className="block text-sm font-medium mb-3">Allergies (Comma separated)</label>
                           <input
                              type="text"
                              {...register("allergies", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                              className={inputClass}
                              placeholder="Peanuts, Shellfish... (Optional)"
                            />
                        </div>
                     </div>
                  )}
               </form>
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
            <Button variant="ghost" onClick={prevStep} disabled={isGenerating}>
               <ChevronLeft className="mr-2 h-4 w-4" /> 
               {currentStep === 0 ? "Back to Dashboard" : "Back"}
            </Button>

            {currentStep < STEPS.length - 1 ? (
               <Button onClick={nextStep}>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
               </Button>
            ) : (
               <Button onClick={() => (document.getElementById("onboarding-form") as HTMLFormElement)?.requestSubmit()} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...
                    </>
                  ) : (
                    <>
                      Generate Plan <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
               </Button>
            )}
        </div>
      </motion.div>

      {/* Profile Load Prompt Modal */}
      <AnimatePresence>
        {showProfilePrompt && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
               >
                   <div className="flex flex-col items-center text-center mb-6">
                       <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
                           <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 dark:text-white">Found Existing Profile</h3>
                       <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                           We found your saved health profile. Would you like to use this data to pre-fill the form?
                       </p>
                   </div>
                   <div className="flex gap-3">
                       <Button variant="outline" className="flex-1" onClick={() => setShowProfilePrompt(false)}>
                           Start Fresh
                       </Button>
                       <Button className="flex-1" onClick={loadProfileData}>
                           Load Profile
                       </Button>
                   </div>
               </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  )
}
