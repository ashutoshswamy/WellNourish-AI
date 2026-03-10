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
      const { data } = await supabase
        .from("generated_plans")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (data && data.length > 0) {
        setPlans(data.map(p => ({ ...p.plan_data, id: p.id, created_at: p.created_at })))
      }
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
        
        if (count === 0) {
            console.warn("No rows deleted. Check RLS policies or if plan exists.")
            alert("Could not delete plan. You might not have permission.")
            return
        }

        const newPlans = plans.filter(p => p.id !== planId)
        setPlans(newPlans)
        
        const storedPlanStr = localStorage.getItem("wellnourish_plan")
        if (storedPlanStr) {
             console.log("Found stored plan, checking for removal...")
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
      <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
  )

  if (plans.length === 0) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Navbar />
            <div className="text-center max-w-sm">
                <div className="bg-primary/10 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-5">
                    <Calendar className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No Plans Found</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    You don&apos;t have any active diet or workout plans. Start by creating one.
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
    <div className="min-h-screen bg-secondary/20 dark:bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <AnimatedSection>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <div>
                 <h1 className="text-2xl font-bold text-foreground">Your Wellness Plan</h1>
                 <p className="text-muted-foreground text-sm">Personalized for your goals</p>
              </div>
              <div className="flex gap-2 items-center">
                 <Button variant="outline" size="sm" onClick={() => setShowShoppingList(true)}>
                    <ShoppingBasket className="mr-2 h-4 w-4" /> Shopping List
                 </Button>
                 <Button size="sm" onClick={() => router.push("/onboarding")}>New Plan</Button>
              </div>
           </div>

           {/* Stats Overview */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard label="Daily Calories" value={plan.nutrition_summary.daily_calories} icon={<Flame className="text-amber-500" />} />
              <StatCard label="Protein" value={plan.nutrition_summary.macros.protein} icon={<Utensils className="text-primary" />} />
              <StatCard label="Hydration" value={plan.nutrition_summary.hydration_goal} icon={<Droplets className="text-blue-500" />} />
              <StatCard label="Duration" value={`${days.length} Days`} icon={<Calendar className="text-purple-500" />} />
           </div>

           <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                  {/* Plan Switcher */}
                  <div className="bg-background rounded-xl p-5 border border-border">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        Plan History
                      </h3>
                      <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                        {plans.map((p, i) => (
                              <div
                                key={p.id || i}
                                onClick={() => {
                                  setCurrentPlanIndex(i)
                                  setSelectedDay(1)
                                }}
                                className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-start cursor-pointer text-sm ${
                                  currentPlanIndex === i
                                    ? "bg-primary/5 border-primary text-foreground" 
                                    : "bg-muted/30 border-transparent hover:bg-muted text-muted-foreground"
                                }`}
                              >
                                 <div className="flex-1 min-w-0 mr-2">
                                    <div className="font-medium truncate">
                                      {p.user_profile?.goals?.[0] || `${p.plan_duration || "7"} Day Plan`}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {p.user_profile?.calories && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded border border-border">
                                                {p.user_profile.calories} kcal
                                            </span>
                                        )}
                                        {p.user_profile?.dietary_preferences?.[0] && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded border border-border">
                                                {p.user_profile.dietary_preferences[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs opacity-60 mt-1 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(p.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      <span className="mx-0.5">·</span>
                                      {p.plan_duration || "7"} Days
                                    </div>
                                 </div>
                                 {p.id && (
                                     <button 
                                        onClick={(e) => deletePlan(p.id, e)}
                                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                                     >
                                        <Trash2 className="h-3.5 w-3.5" />
                                     </button>
                                 )}
                              </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
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
                  <div className="bg-background rounded-xl p-5 border border-border">
                     <h3 className="font-semibold text-foreground mb-3 text-sm">Day View</h3>
                     <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                        {days.map((day: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                           <button
                             key={day.day}
                             onClick={() => setSelectedDay(day.day)}
                             className={`w-full text-left p-2.5 rounded-lg border transition-all flex justify-between items-center text-sm ${
                               selectedDay === day.day 
                                 ? "bg-primary text-primary-foreground border-primary" 
                                 : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted"
                             }`}
                           >
                              <span className="font-medium">Day {day.day}</span>
                              <span className="text-xs opacity-70 truncate ml-2">
                                  {typeof day.workout === 'string' ? "Workout" : day.workout.type}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-5">
                 {/* Meals */}
                 <div className="bg-background rounded-xl p-5 border border-border">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                       <Utensils className="h-5 w-5 text-primary" />
                       Nutrition
                    </h2>
                    <div className="space-y-2.5">
                       <MealCard type="Breakfast" meal={currentDayPlan.meals.breakfast} />
                       <MealCard type="Lunch" meal={currentDayPlan.meals.lunch} />
                       <MealCard type="Dinner" meal={currentDayPlan.meals.dinner} />
                       <MealCard type="Snack" meal={currentDayPlan.meals.snack} />
                    </div>
                 </div>

                 {/* Workout */}
                 <div className="bg-background rounded-xl p-5 border border-border">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                       <Dumbbell className="h-5 w-5 text-purple-500" />
                       {currentDayPlan.workout.type}
                    </h2>
                    
                    <div className="flex flex-wrap gap-2 mb-5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg">
                            <Clock className="h-3.5 w-3.5" />
                            {currentDayPlan.workout.duration}
                        </div>
                        {currentDayPlan.workout.warmup && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg">
                                <span className="font-medium text-purple-600 dark:text-purple-400">Warmup:</span>
                                {currentDayPlan.workout.warmup}
                            </div>
                        )}
                         {currentDayPlan.workout.cooldown && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-lg">
                                <span className="font-medium text-purple-600 dark:text-purple-400">Cooldown:</span>
                                {currentDayPlan.workout.cooldown}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                       {Array.isArray(currentDayPlan.workout.exercises) && typeof currentDayPlan.workout.exercises[0] === 'string' ? (
                           <ul className="space-y-2">
                               {currentDayPlan.workout.exercises.map((ex: string, i: number) => (
                                  <li key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                                     <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                     <span>{ex}</span>
                                  </li>
                               ))}
                           </ul>
                       ) : (
                            <div className="grid gap-3">
                                {currentDayPlan.workout.exercises.map((ex: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                    <div key={i} className="bg-muted/40 rounded-lg p-4 border border-border">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h4 className="font-semibold text-foreground">{ex.name}</h4>
                                            <div className="flex gap-1.5 text-xs">
                                                <span className="bg-background px-2 py-0.5 rounded border border-border font-mono">{ex.sets} Sets</span>
                                                <span className="bg-background px-2 py-0.5 rounded border border-border font-mono">{ex.reps} Reps</span>
                                            </div>
                                        </div>
                                        {ex.notes && (
                                            <p className="text-xs text-muted-foreground italic">
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
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowShoppingList(false)}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-background rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl border border-border flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 border-b border-border flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <ShoppingBasket className="h-5 w-5 text-primary" />
                            Shopping List
                        </h2>
                        <button onClick={() => setShowShoppingList(false)} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">✕</button>
                    </div>
                    <div className="p-5 overflow-y-auto">
                        {!plan.shopping_list || plan.shopping_list.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground text-sm">
                                <p>No shopping list available for this plan.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {plan.shopping_list.map((category: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                    <div key={idx}>
                                        <h3 className="font-medium text-primary mb-2 uppercase tracking-wider text-xs">
                                            {category.category}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                            {category.items.map((item: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2.5 p-2.5 bg-muted/40 rounded-lg border border-border">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    <span className="text-sm text-foreground">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-border bg-muted/30">
                        <Button className="w-full" size="sm" onClick={() => setShowShoppingList(false)}>Close</Button>
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
      <div className="bg-background p-3.5 rounded-xl border border-border flex items-center gap-3">
         <div className="p-2 bg-muted rounded-lg">
            {icon}
         </div>
         <div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-bold text-foreground">{value}</div>
         </div>
      </div>
   )
}

function MealCard({ type, meal }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
   const [isOpen, setIsOpen] = useState(false)

   return (
      <div className="border border-border rounded-lg overflow-hidden bg-background">
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full flex items-center justify-between p-3.5 hover:bg-muted/50 transition-colors"
         >
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-16 text-left">{type}</span>
               <span className="font-medium text-foreground text-sm">{meal.name}</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
               {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
         </button>
         
         {isOpen && (
            <div className="p-4 border-t border-border">
               <p className="text-sm text-muted-foreground mb-3 italic">
                   {meal.description}
               </p>
               
               {meal.ingredients && (
                   <div className="mb-3">
                       <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">Ingredients</h4>
                       <ul className="grid grid-cols-2 gap-1.5">
                           {meal.ingredients.map((ing: string, i: number) => (
                               <li key={i} className="text-sm text-foreground flex items-center gap-2">
                                   <div className="h-1 w-1 rounded-full bg-primary" />
                                   {ing}
                               </li>
                           ))}
                       </ul>
                   </div>
               )}

               {meal.preparation && (
                   <div>
                       <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">Preparation</h4>
                       <p className="text-sm text-foreground leading-relaxed">
                           {meal.preparation}
                       </p>
                   </div>
               )}
            </div>
         )}
      </div>
   )
}
