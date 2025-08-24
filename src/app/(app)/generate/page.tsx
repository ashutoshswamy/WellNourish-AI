'use client'

import React, { useState, useTransition } from 'react'
import { createDietPlan, createWorkoutPlan, savePlan } from '@/app/actions/plans'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, WandSparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { GeneratePersonalizedDietPlanOutput } from '@/ai/flows/generate-personalized-diet-plan'
import type { GenerateCustomWorkoutPlanOutput } from '@/ai/flows/generate-custom-workout-plan'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion, AnimatePresence } from 'framer-motion'

type PlanResult = (GeneratePersonalizedDietPlanOutput | GenerateCustomWorkoutPlanOutput) & {
  type: 'diet' | 'workout'
  profile_snapshot?: any
} | null


function DietPlanDisplay({ plan }: { plan: GeneratePersonalizedDietPlanOutput['dietPlanDetails'] }) {
    return (
        <div className="space-y-4">
            <h2 className="font-headline text-2xl">{plan.title}</h2>
            <p className="text-muted-foreground">{plan.summary}</p>
            <Accordion type="single" collapsible className="w-full">
                {plan.weekly_diet.map(daily => (
                    <AccordionItem value={daily.day} key={daily.day}>
                        <AccordionTrigger className="text-lg font-body hover:no-underline">
                            <div className="flex justify-between items-center w-full pr-4">
                                <span>{daily.day}</span>
                                <span className="text-sm text-muted-foreground">{daily.daily_calories} kcal</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                            {daily.meals.map(meal => (
                                <div key={meal.name}>
                                    <h4 className="font-headline text-md mb-2">{meal.name}</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {meal.items.map(item => (
                                            <li key={item.name}>
                                                <strong>{item.name}:</strong> {item.description} ({item.calories} kcal)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

function WorkoutPlanDisplay({ plan }: { plan: GenerateCustomWorkoutPlanOutput['workoutPlanDetails'] }) {
    return (
        <div className="space-y-4">
            <h2 className="font-headline text-2xl">{plan.title}</h2>
            <p className="text-muted-foreground">{plan.summary}</p>
            <Accordion type="single" collapsible className="w-full">
                {plan.weeklySchedule.map(daily => (
                    <AccordionItem value={daily.day} key={daily.day}>
                        <AccordionTrigger className="text-lg font-body hover:no-underline">
                            {daily.day} - {daily.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                             <ul className="space-y-2">
                                {daily.exercises.map(exercise => (
                                    <li key={exercise.name}>
                                        <strong>{exercise.name}:</strong> {exercise.sets} sets of {exercise.reps} reps, {exercise.rest} rest.
                                        {exercise.notes && <p className="text-sm text-muted-foreground pl-2">- {exercise.notes}</p>}
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}


function ProfileDataDisplay({ profile_data }: { profile_data: any }) {
    if (!profile_data) return null;
    return (
        <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-headline text-lg mb-2">Plan Generated with this Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {profile_data.first_name && <div><strong>Name:</strong> {profile_data.first_name}</div>}
                {profile_data.age && <div><strong>Age:</strong> {profile_data.age}</div>}
                {profile_data.height && <div><strong>Height:</strong> {profile_data.height} cm</div>}
                {profile_data.weight && <div><strong>Weight:</strong> {profile_data.weight} kg</div>}
                {profile_data.gender && <div><strong>Gender:</strong> {profile_data.gender}</div>}
                {profile_data.activity_level && <div className="col-span-2"><strong>Activity:</strong> {profile_data.activity_level}</div>}
            </div>
        </div>
    )
}

export default function GeneratePage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [generatedPlan, setGeneratedPlan] = useState<PlanResult>(null)
  const [generationType, setGenerationType] = useState<'diet' | 'workout' | null>(null);

  const handleGenerateDietPlan = () => {
    startTransition(async () => {
      setGeneratedPlan(null)
      setGenerationType('diet');
      try {
        const result = await createDietPlan()
        if (result.dietPlanDetails) {
            setGeneratedPlan({ ...result, type: 'diet' })
        } else {
            throw new Error("Failed to generate diet plan.");
        }
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Error Generating Plan",
          description: e.message || "Could not generate diet plan. Please try again.",
        })
      }
      setGenerationType(null);
    })
  }

  const handleGenerateWorkoutPlan = () => {
    startTransition(async () => {
      setGeneratedPlan(null)
      setGenerationType('workout');
       try {
        const result = await createWorkoutPlan()
        if (result.workoutPlanDetails) {
            setGeneratedPlan({ ...result, type: 'workout' })
        } else {
             throw new Error("Failed to generate workout plan.");
        }
       } catch(e: any) {
         toast({
          variant: "destructive",
          title: "Error Generating Plan",
          description: e.message || "Could not generate workout plan. Please try again.",
        })
       }
      setGenerationType(null);
    })
  }

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    startTransition(async () => {
        const planToSave = {
          name: generatedPlan.type === 'diet'
            ? (generatedPlan as GeneratePersonalizedDietPlanOutput).dietPlanDetails.title
            : (generatedPlan as GenerateCustomWorkoutPlanOutput).workoutPlanDetails.title,
          type: generatedPlan.type,
          profile_snapshot: generatedPlan.profile_snapshot,
          diet_plan_details: generatedPlan.type === 'diet' ? (generatedPlan as GeneratePersonalizedDietPlanOutput).dietPlanDetails : null,
          workout_plan_details: generatedPlan.type === 'workout' ? (generatedPlan as GenerateCustomWorkoutPlanOutput).workoutPlanDetails : null,
          health_tips: generatedPlan.healthTips || [],
        }

        const result = await savePlan(planToSave);

        if (result.success) {
            toast({ title: "Plan Saved!", description: "Your plan has been saved to 'My Plans'." })
        } else {
            toast({ variant: "destructive", title: "Error Saving Plan", description: result.error })
        }
    });
  }

  const isGenerating = isPending && generationType !== null;
  const isSaving = isPending && !generationType && !!generatedPlan;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Generate Your Plan</h1>
        <p className="text-muted-foreground mt-1">
          Use our AI to create personalized diet and workout plans based on your profile.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl sm:text-2xl">AI Dietitian</CardTitle>
              <CardDescription>Generates a meal plan based on your profile data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateDietPlan} disabled={isGenerating} className="w-full">
                {isGenerating && generationType === 'diet' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles />}
                Generate Diet Plan
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl sm:text-2xl">AI Personal Trainer</CardTitle>
              <CardDescription>Creates a workout routine tailored to your goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateWorkoutPlan} disabled={isGenerating} className="w-full">
                {isGenerating && generationType === 'workout' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles />}
                Generate Workout Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="sticky top-20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl sm:text-2xl">Generated Plan</CardTitle>
                <CardDescription>Your AI-crafted plan will appear here.</CardDescription>
              </div>
              {generatedPlan && (
                 <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                 >
                    <Button variant="outline" size="icon" onClick={handleSavePlan} disabled={isPending}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4"/>}
                    <span className="sr-only">Save Plan</span>
                    </Button>
                </motion.div>
              )}
            </CardHeader>
            <CardContent className="min-h-[400px] max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <Loader2 className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="mt-4 text-muted-foreground">Generating your {generationType} plan...</p>
                  </motion.div>
                )}

                {!isGenerating && generatedPlan && (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {generatedPlan.type === 'diet' && (
                      <DietPlanDisplay plan={(generatedPlan as GeneratePersonalizedDietPlanOutput).dietPlanDetails} />
                    )}
                    {generatedPlan.type === 'workout' && (
                      <WorkoutPlanDisplay plan={(generatedPlan as GenerateCustomWorkoutPlanOutput).workoutPlanDetails} />
                    )}
                    {generatedPlan?.healthTips && generatedPlan.healthTips.length > 0 && (
                      <div>
                          <h2 className="text-xl font-bold font-headline mt-4 border-t pt-4">Health Tips</h2>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            {generatedPlan.healthTips.map((tip, i) => <li key={i}>{tip}</li>)}
                          </ul>
                      </div>
                    )}
                    {generatedPlan?.profile_snapshot && (
                        <ProfileDataDisplay profile_data={generatedPlan.profile_snapshot} />
                    )}
                  </motion.div>
                )}
                
                {!isGenerating && !generatedPlan && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center h-full p-4"
                  >
                    <p className="text-muted-foreground">Click a "Generate" button to create a personalized plan.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
