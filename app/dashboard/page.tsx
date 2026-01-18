"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Calendar, ChevronDown, ChevronUp, Dumbbell, Droplets, Flame, Utensils, Loader2, Trash2, Clock, ShoppingBasket, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function DashboardPage() {
  const [plans, setPlans] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPlans = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Fetch from DB
      const { data } = await supabase
        .from("generated_plans")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (data && data.length > 0) {
        setPlans(data.map(p => ({ ...p.plan_data, id: p.id, created_at: p.created_at })))
      }
      // If no data, plans remains [], showing empty state correctly
    } else {
      checkLocal()
    }
    setLoading(false)
  }

  const checkLocal = () => {
     const storedPlan = localStorage.getItem("wellnourish_plan")
     if (storedPlan) {
       setPlans([JSON.parse(storedPlan)])
     } else {
       router.push("/onboarding")
     }
  }

  const deletePlan = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this plan?")) return;

    console.log("Attempting to delete plan:", planId)

    try {
        const { error, count, status, statusText } = await supabase
            .from("generated_plans")
            .delete({ count: 'exact' })
            .eq("id", planId)

        console.log("Delete response:", { error, count, status, statusText })

        if (error) {
            console.error("Supabase delete error:", error)
            throw error
        }
        
        // If count is 0, it might mean RLS prevented it or it doesn't exist
        if (count === 0) {
            console.warn("No rows deleted. Check RLS policies or if plan exists.")
            alert("Could not delete plan. You might not have permission.")
            return
        }

        // Update local state
        const newPlans = plans.filter(p => p.id !== planId)
        setPlans(newPlans)
        
        // Remove from localStorage if it matches
        const storedPlanStr = localStorage.getItem("wellnourish_plan")
        if (storedPlanStr) {
             console.log("Found stored plan, checking for removal...")
             // aggressive removal for now to ensure sync
             if (plans.length === 1 || plans[0].id === planId) {
                  console.log("Removing wellnourish_plan from localStorage")
                  localStorage.removeItem("wellnourish_plan")
             }
        }
        
        if (newPlans.length === 0) {
            setCurrentPlanIndex(0)
        } else if (currentPlanIndex >= newPlans.length) {
            setCurrentPlanIndex(0)
        }

    } catch (err) {
        console.error("Error deleting plan:", err)
        alert("Failed to delete plan: " + (err as Error).message)
    }
  }

  const [showShoppingList, setShowShoppingList] = useState(false)

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
  )

  if (plans.length === 0) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Navbar />
            <div className="text-center max-w-md">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Plans Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    You don&apos;t have any active diet or workout plans. improved your health by creating one today!
                </p>
                <Button onClick={() => router.push("/onboarding")} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" /> Generate New Plan
                </Button>
            </div>
        </div>
      )
  }

  const plan = plans[currentPlanIndex]
  const days = plan.daily_plan
  const currentDayPlan = days.find((d: any) => d.day === selectedDay) || days[0] // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Wellness Plan</h1>
                 <p className="text-gray-500 dark:text-gray-400">Personalized for your goals</p>
              </div>
              <div className="flex gap-2 items-center">
                 <Button variant="outline" onClick={() => setShowShoppingList(true)}>
                    <ShoppingBasket className="mr-2 h-4 w-4" /> Shopping List
                 </Button>
                 <Button onClick={() => router.push("/onboarding")}>New Plan</Button>
              </div>
           </div>

           {/* Stats Overview */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Daily Calories" value={plan.nutrition_summary.daily_calories} icon={<Flame className="text-orange-500" />} />
              <StatCard label="Protein" value={plan.nutrition_summary.macros.protein} icon={<Utensils className="text-emerald-500" />} />
              <StatCard label="Hydration" value={plan.nutrition_summary.hydration_goal} icon={<Droplets className="text-blue-500" />} />
              <StatCard label="Duration" value={`${days.length} Days`} icon={<Calendar className="text-purple-500" />} />
           </div>

           <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar - Plan History & Days */}
              <div className="lg:col-span-1 space-y-8">
                  {/* Plan Switcher */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        Plan History
                      </h3>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {plans.map((p, i) => (
                              <div
                                key={p.id || i}
                                onClick={() => {
                                  setCurrentPlanIndex(i)
                                  setSelectedDay(1)
                                }}
                                className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-start cursor-pointer group ${
                                  currentPlanIndex === i
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-500/50 dark:text-emerald-100" 
                                    : "bg-gray-50 dark:bg-slate-800 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                 <div className="flex-1 min-w-0 mr-2">
                                    <div className="font-semibold text-sm truncate">
                                      {p.user_profile?.goals?.[0] || `${p.plan_duration || "7"} Day Plan`}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {p.user_profile?.calories && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded border border-gray-200 dark:border-gray-700">
                                                {p.user_profile.calories} kcal
                                            </span>
                                        )}
                                        {p.user_profile?.dietary_preferences?.[0] && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded border border-gray-200 dark:border-gray-700">
                                                {p.user_profile.dietary_preferences[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs opacity-60 mt-1.5 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(p.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      <span className="mx-1">•</span>
                                      {p.plan_duration || "7"} Days
                                    </div>
                                 </div>
                                 {p.id && (
                                     <button 
                                        onClick={(e) => deletePlan(p.id, e)}
                                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                     >
                                        <Trash2 className="h-3.5 w-3.5" />
                                     </button>
                                 )}
                              </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push("/onboarding")}
                        >
                          Generate New Plan
                        </Button>
                      </div>
                  </div>

                  {/* Day Picker */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Day View</h3>
                     <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {days.map((day: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                           <button
                             key={day.day}
                             onClick={() => setSelectedDay(day.day)}
                             className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center text-sm ${
                               selectedDay === day.day 
                                 ? "bg-emerald-600 text-white shadow-md border-emerald-600" 
                                 : "bg-gray-50 dark:bg-slate-800 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                             }`}
                           >
                              <span className="font-semibold">Day {day.day}</span>
                              <span className="text-xs opacity-80 truncate ml-2">
                                  {typeof day.workout === 'string' ? "Workout" : day.workout.type}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
              </div>

              {/* Main Content - Meals & Workout */}
              <div className="lg:col-span-3 space-y-6">
                 {/* Meals */}
                 <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                       <Utensils className="h-6 w-6 text-emerald-600" />
                       Nutrition
                    </h2>
                    <div className="space-y-4">
                       <MealCard type="Breakfast" meal={currentDayPlan.meals.breakfast} />
                       <MealCard type="Lunch" meal={currentDayPlan.meals.lunch} />
                       <MealCard type="Dinner" meal={currentDayPlan.meals.dinner} />
                       <MealCard type="Snack" meal={currentDayPlan.meals.snack} />
                    </div>
                 </div>

                 {/* Workout */}
                 <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                       <Dumbbell className="h-6 w-6 text-purple-600" />
                       {currentDayPlan.workout.type}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                            <Clock className="h-4 w-4" />
                            {currentDayPlan.workout.duration}
                        </div>
                        {currentDayPlan.workout.warmup && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                <span className="font-semibold text-purple-600">Warmup:</span>
                                {currentDayPlan.workout.warmup}
                            </div>
                        )}
                         {currentDayPlan.workout.cooldown && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                <span className="font-semibold text-purple-600">Cooldown:</span>
                                {currentDayPlan.workout.cooldown}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                       {Array.isArray(currentDayPlan.workout.exercises) && typeof currentDayPlan.workout.exercises[0] === 'string' ? (
                           // Legacy format support
                           <ul className="space-y-3">
                               {currentDayPlan.workout.exercises.map((ex: string, i: number) => (
                                  <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                     <div className="h-2 w-2 rounded-full bg-purple-500" />
                                     <span>{ex}</span>
                                  </li>
                               ))}
                           </ul>
                       ) : (
                           // Detailed format
                            <div className="grid gap-4">
                                {currentDayPlan.workout.exercises.map((ex: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{ex.name}</h4>
                                            <div className="flex gap-2 text-xs font-mono">
                                                <span className="bg-white dark:bg-slate-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{ex.sets} Sets</span>
                                                <span className="bg-white dark:bg-slate-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{ex.reps} Reps</span>
                                            </div>
                                        </div>
                                        {ex.notes && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                Tip: {ex.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </AnimatedSection>
        
        {/* Shopping List Modal */}
        {showShoppingList && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowShoppingList(false)}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShoppingBasket className="h-6 w-6 text-emerald-600" />
                            Shopping List
                        </h2>
                        <button onClick={() => setShowShoppingList(false)} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {!plan.shopping_list || plan.shopping_list.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>No shopping list available for this plan.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {plan.shopping_list.map((category: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                    <div key={idx}>
                                        <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3 uppercase tracking-wider text-xs">
                                            {category.category}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {category.items.map((item: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50">
                        <Button className="w-full" onClick={() => setShowShoppingList(false)}>Close</Button>
                    </div>
                </motion.div>
            </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, icon }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
   return (
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
         <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {icon}
         </div>
         <div>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-lg font-bold">{value}</div>
         </div>
      </div>
   )
}

function MealCard({ type, meal }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
   const [isOpen, setIsOpen] = useState(false)

   return (
      <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
         >
            <div className="flex items-center gap-4">
               <span className="text-xs font-bold uppercase tracking-wider text-gray-500 w-20 text-left">{type}</span>
               <span className="font-semibold text-gray-900 dark:text-white">{meal.name}</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-500">{meal.calories} kcal</span>
               {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
         </button>
         
         {isOpen && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
               <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">
                   {meal.description}
               </p>
               
               {meal.ingredients && (
                   <div className="mb-4">
                       <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Ingredients</h4>
                       <ul className="grid grid-cols-2 gap-2">
                           {meal.ingredients.map((ing: string, i: number) => (
                               <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                   {ing}
                               </li>
                           ))}
                       </ul>
                   </div>
               )}

               {meal.preparation && (
                   <div>
                       <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Preparation</h4>
                       <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                           {meal.preparation}
                       </p>
                   </div>
               )}
            </div>
         )}
      </div>
   )
}
