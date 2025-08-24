'use client'

import React, { useState, useTransition } from 'react'
import { createDietPlan, createWorkoutPlan, savePlan } from '@/app/actions/plans'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, WandSparkles } from 'lucide-react'
import { Markdown } from '@/components/Markdown'
import { useToast } from '@/hooks/use-toast'

type PlanResult = {
  dietPlan?: string | null
  workoutPlan?: string | null
  healthTips?: string | null
  profile_data?: any
} | null

export default function GeneratePage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [generatedPlan, setGeneratedPlan] = useState<PlanResult>(null)
  const [generationType, setGenerationType] = useState<'diet' | 'workout' | null>(null);

  const handleGenerateDietPlan = () => {
    startTransition(async () => {
      setGeneratedPlan(null)
      setGenerationType('diet');
      const result = await createDietPlan()
      if (result.dietPlan) {
        setGeneratedPlan({ dietPlan: result.dietPlan, healthTips: result.healthTips, profile_data: result.profile_data })
      } else {
        toast({
          variant: "destructive",
          title: "Error Generating Plan",
          description: "Could not generate diet plan. Please try again.",
        })
      }
      setGenerationType(null);
    })
  }

  const handleGenerateWorkoutPlan = () => {
    startTransition(async () => {
      setGeneratedPlan(null)
      setGenerationType('workout');
      const result = await createWorkoutPlan()
      if (result.workoutPlan) {
        setGeneratedPlan({ workoutPlan: result.workoutPlan, profile_data: result.profile_data })
      } else {
        toast({
          variant: "destructive",
          title: "Error Generating Plan",
          description: "Could not generate workout plan. Please try again.",
        })
      }
      setGenerationType(null);
    })
  }

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    startTransition(async () => {
        const result = await savePlan({
            diet_plan: generatedPlan.dietPlan || null,
            workout_plan: generatedPlan.workoutPlan || null,
            health_tips: generatedPlan.healthTips || null,
            profile_data: generatedPlan.profile_data,
        });
        if (result.success) {
            toast({ title: "Plan Saved!", description: "Your plan has been saved to 'My Plans'." })
        } else {
            toast({ variant: "destructive", title: "Error Saving Plan", description: result.error })
        }
    });
  }

  const isGenerating = isPending && generationType !== null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Generate Your Plan</h1>
        <p className="text-muted-foreground mt-1">
          Use our AI to create personalized diet and workout plans based on your profile.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">AI Dietitian</CardTitle>
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
              <CardTitle className="font-headline">AI Personal Trainer</CardTitle>
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
        
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Generated Plan</CardTitle>
                <CardDescription>Your AI-crafted plan will appear here.</CardDescription>
              </div>
              {generatedPlan && (
                <Button variant="outline" size="icon" onClick={handleSavePlan} disabled={isPending}>
                  <Save className="h-4 w-4"/>
                  <span className="sr-only">Save Plan</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="min-h-[400px] max-h-[60vh] overflow-y-auto">
              {isGenerating && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Generating your {generationType} plan...</p>
                </div>
              )}
              {generatedPlan?.dietPlan && (
                <Markdown content={generatedPlan.dietPlan} />
              )}
              {generatedPlan?.workoutPlan && (
                <Markdown content={generatedPlan.workoutPlan} />
              )}
               {generatedPlan?.healthTips && (
                <>
                    <h2 className="text-xl font-bold mt-4 font-headline">Health Tips</h2>
                    <Markdown content={generatedPlan.healthTips} />
                </>
              )}
              {!isGenerating && !generatedPlan && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground">Click a "Generate" button to create a personalized plan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
