"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
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

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = useForm<OnboardingData>({
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

  const [foundProfile, setFoundProfile] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
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
        const currentAge = watch("age")
        if (!currentAge) {
             setShowProfilePrompt(true)
        }
      }
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadProfileData = () => {
      if (!foundProfile) return
      
      if (foundProfile.age) setValue("age", foundProfile.age)
      if (foundProfile.gender) setValue("gender", foundProfile.gender as "male" | "female" | "other")
      if (foundProfile.height) setValue("height", foundProfile.height)
      if (foundProfile.weight) setValue("weight", foundProfile.weight)
      if (foundProfile.activity_level) setValue("activityLevel", foundProfile.activity_level as "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active")
      
      if (foundProfile.cuisine_preferences) setValue("cuisinePreferences", foundProfile.cuisine_preferences)
      if (foundProfile.dietary_preferences) setValue("dietaryPreferences", foundProfile.dietary_preferences)
      if (foundProfile.medical_conditions) setValue("medicalConditions", foundProfile.medical_conditions)
      if (foundProfile.allergies) setValue("allergies", foundProfile.allergies)
      if (foundProfile.goals) setValue("goals", foundProfile.goals)
      
      setShowProfilePrompt(false)
  }

  const watchGender = watch("gender")
  const watchActivity = watch("activityLevel")
  const watchGoals = watch("goals")

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingData)[] = []
    
    if (currentStep === 0) fieldsToValidate = ["age", "gender", "height", "weight"]
    if (currentStep === 1) fieldsToValidate = ["activityLevel"]
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

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to generate plan")
      
      const planData = await response.json()
      
      planData.user_profile = {
        goals: data.goals,
        dietary_preferences: data.dietaryPreferences,
        cuisine_preferences: data.cuisinePreferences,
        calories: planData.nutrition_summary?.daily_calories
      }
      
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

  const inputClass = "w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/40 focus:border-primary/40 border-border transition-all placeholder:text-muted-foreground text-sm"

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-background flex flex-col justify-center items-center p-4">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
             <div key={step.id} className={cn("text-xs font-medium tracking-wide", index <= currentStep ? "text-primary" : "text-muted-foreground")}>
               Step {index + 1}
             </div>
          ))}
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div 
        layout
        className="bg-background w-full max-w-2xl rounded-xl shadow-sm border border-border overflow-hidden"
      >
        <div className="p-8 md:p-10">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 15 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -15 }}
               transition={{ duration: 0.25 }}
             >
               <div className="mb-6">
                 <h2 className="text-2xl font-bold text-foreground mb-1">{STEPS[currentStep].title}</h2>
                 <p className="text-muted-foreground text-sm">{STEPS[currentStep].description}</p>
               </div>

               <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Step 1: Basics */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                          <label className="block text-sm font-medium mb-1.5">Age</label>
                          <input 
                            type="number" 
                            {...register("age", { valueAsNumber: true })} 
                            className={cn(inputClass, errors.age ? "border-red-500 focus:ring-red-400/40" : "")} 
                            placeholder="25" 
                          />
                          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-1.5">Gender</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["male", "female", "other"].map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setValue("gender", g as "male" | "female" | "other", { shouldValidate: true })}
                                className={cn("p-2.5 rounded-lg border text-sm capitalize transition-all", watchGender === g ? "bg-primary/10 border-primary text-primary font-medium" : "bg-background border-border text-muted-foreground hover:bg-muted", errors.gender && "border-red-500")}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-1.5">Height (cm)</label>
                          <input 
                            type="number" 
                            {...register("height", { valueAsNumber: true })} 
                            className={cn(inputClass, errors.height ? "border-red-500 focus:ring-red-400/40" : "")} 
                            placeholder="175" 
                          />
                          {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
                          <input 
                            type="number" 
                            {...register("weight", { valueAsNumber: true })} 
                            className={cn(inputClass, errors.weight ? "border-red-500 focus:ring-red-400/40" : "")} 
                            placeholder="70" 
                          />
                          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                       </div>
                    </div>
                  )}

                  {/* Step 2: Activity */}
                  {currentStep === 1 && (
                     <div className="space-y-2">
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
                             onClick={() => setValue("activityLevel", opt.val as "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active", { shouldValidate: true })}
                             className={cn("w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center", watchActivity === opt.val ? "bg-primary/5 border-primary" : "bg-background border-border hover:border-primary/30", errors.activityLevel && !watchActivity && "border-red-500")}
                           >
                             <div>
                               <div className={cn("font-medium text-sm", watchActivity === opt.val ? "text-primary" : "text-foreground")}>{opt.label}</div>
                               <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                             </div>
                             {watchActivity === opt.val && <Check className="h-4 w-4 text-primary" />}
                           </button>
                        ))}
                        {errors.activityLevel && <p className="text-red-500 text-xs mt-1">{errors.activityLevel.message}</p>}
                     </div>
                  )}

                  {/* Step 3: Preferences */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                       <div>
                         <label className="block text-sm font-medium mb-1.5">Cuisines you enjoy (Comma separated)</label>
                         <input
                            type="text"
                            {...register("cuisinePreferences", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                            className={inputClass}
                            placeholder="Italian, Mexican, Thai..."
                          />
                         {errors.cuisinePreferences && <p className="text-red-500 text-xs mt-1">{errors.cuisinePreferences.message}</p>}
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium mb-1.5">Dietary Restrictions (Comma separated)</label>
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
                     <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">Health Goals</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                             {["Weight Loss", "Muscle Gain", "Maintenance", "Better Energy", "Improve Digestion"].concat(
                               (watchGoals || []).filter(g => !["Weight Loss", "Muscle Gain", "Maintenance", "Better Energy", "Improve Digestion"].includes(g))
                             )
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
                                 className={cn("px-3 py-2 rounded-lg border text-sm transition-all", (watchGoals || []).includes(g) ? "bg-primary/10 border-primary text-primary font-medium" : "bg-background border-border text-muted-foreground hover:bg-muted", errors.goals && (watchGoals || []).length === 0 && "border-red-500")}
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
                              size="sm"
                              onClick={() => {
                                if (!customGoal.trim()) return
                                const current = watchGoals || []
                                if (!current.includes(customGoal.trim())) {
                                  setValue("goals", [...current, customGoal.trim()], { shouldValidate: true })
                                }
                                setCustomGoal("")
                              }}
                              className="shrink-0"
                            >
                                Add
                            </Button>
                          </div>
                          {errors.goals && <p className="text-red-500 text-xs mt-1">{errors.goals.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium mb-1.5">Medical Conditions (Comma separated)</label>
                           <input
                              type="text"
                              {...register("medicalConditions", { setValueAs: (v) => typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v })}
                              className={inputClass}
                              placeholder="Diabetes, Hypertension... (Optional)"
                            />
                        </div>

                        <div>
                           <label className="block text-sm font-medium mb-1.5">Allergies (Comma separated)</label>
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

        <div className="px-8 py-5 border-t border-border bg-muted/30 flex justify-between items-center">
            <Button variant="ghost" onClick={prevStep} disabled={isGenerating}>
               <ChevronLeft className="mr-1 h-4 w-4" /> 
               {currentStep === 0 ? "Dashboard" : "Back"}
            </Button>

            {currentStep < STEPS.length - 1 ? (
               <Button onClick={nextStep}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
               </Button>
            ) : (
               <Button onClick={() => (document.getElementById("onboarding-form") as HTMLFormElement)?.requestSubmit()} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
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
           <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.97 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.97 }}
                 className="bg-background rounded-xl w-full max-w-sm p-6 shadow-xl border border-border"
               >
                   <div className="flex flex-col items-center text-center mb-6">
                       <div className="bg-primary/10 p-3 rounded-full mb-4">
                           <Sparkles className="h-5 w-5 text-primary" />
                       </div>
                       <h3 className="text-lg font-semibold text-foreground">Found Existing Profile</h3>
                       <p className="text-muted-foreground text-sm mt-2">
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
