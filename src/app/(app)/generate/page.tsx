'use client'

import React, { useState, useTransition } from 'react'
import { createDietPlan, createWorkoutPlan, savePlan } from '@/app/actions/plans'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { Markdown } from '@/components/Markdown'
import { useToast } from '@/hooks/use-toast'
import type { GeneratePersonalizedDietPlanOutput } from '@/ai/flows/generate-personalized-diet-plan'
import type { GenerateCustomWorkoutPlanOutput } from '@/ai/flows/generate-custom-workout-plan'

type PlanResult = {
  type: 'diet' | 'workout'
  content: string
} | null

export default function GeneratePage() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // Diet Plan State
  const [dietPreferences, setDietPreferences] = useState('')
  const [dietGoals, setDietGoals] = useState('')

  // Workout Plan State
  const [workoutFitnessLevel, setWorkoutFitnessLevel] = useState('Beginner')
  const [workoutGoals, setWorkoutGoals] = useState('')
  const [workoutEquipment, setWorkoutEquipment] = useState('')

  const [generatedPlan, setGeneratedPlan] = useState<PlanResult>(null)

  const handleGenerateDietPlan = () => {
    startTransition(async () => {
      setGeneratedPlan(null)
      const result = await createDietPlan({ preferences: dietPreferences, goals: dietGoals })
      if (result.dietPlan) {
        setGeneratedPlan({ type: 'diet', content: result.dietPlan })
      } else {
        toast({
          variant: "destructive",
          title: "Error Generating Plan",
          description: "Could not generate diet plan. Please try again.",
        })
      }
    })
  }

  const handleGenerateWorkoutPlan = () => {
    startTransition(async () => {
      setGeneratedPlan(null)
      const result = await createWorkoutPlan({ fitnessLevel: workoutFitnessLevel, goals: workoutGoals, equipment: workoutEquipment })
      if (result.workoutPlan) {
        setGeneratedPlan({ type: 'workout', content: result.workoutPlan })
      } else {
        toast({
          variant: "destructive",
          title: "Error Generating Plan",
          description: "Could not generate workout plan. Please try again.",
        })
      }
    })
  }

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    startTransition(async () => {
        const planName = prompt(`Enter a name for your ${generatedPlan.type} plan:`, `My ${generatedPlan.type} plan - ${new Date().toLocaleDateString()}`)
        if (planName) {
            const result = await savePlan({ name: planName, type: generatedPlan.type, content: generatedPlan.content })
            if (result.success) {
                toast({ title: "Plan Saved!", description: "Your plan has been saved to 'My Plans'." })
            } else {
                toast({ variant: "destructive", title: "Error Saving Plan", description: result.error })
            }
        }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Generate Your Plan</h1>
        <p className="text-muted-foreground mt-1">
          Use our AI to create personalized diet and workout plans in seconds.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Tabs defaultValue="diet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="diet">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">AI Dietitian</CardTitle>
                <CardDescription>Describe your preferences and goals for a custom meal plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diet-preferences">Dietary Preferences & Restrictions</Label>
                  <Textarea id="diet-preferences" value={dietPreferences} onChange={(e) => setDietPreferences(e.target.value)} placeholder="e.g., Vegan, gluten-free, love Italian food, quick 30-min meals..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diet-goals">Diet Goals</Label>
                  <Textarea id="diet-goals" value={dietGoals} onChange={(e) => setDietGoals(e.target.value)} placeholder="e.g., Weight loss, muscle gain, more energy..." />
                </div>
                <Button onClick={handleGenerateDietPlan} disabled={isPending || !dietPreferences || !dietGoals} className="w-full">
                  {isPending && !generatedPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Diet Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="workout">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">AI Personal Trainer</CardTitle>
                <CardDescription>Tell us about your fitness level and goals for a tailored workout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="fitness-level">Fitness Level</Label>
                    <Select value={workoutFitnessLevel} onValueChange={setWorkoutFitnessLevel}>
                      <SelectTrigger id="fitness-level">
                        <SelectValue placeholder="Select your fitness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="workout-goals">Workout Goals</Label>
                  <Textarea id="workout-goals" value={workoutGoals} onChange={(e) => setWorkoutGoals(e.target.value)} placeholder="e.g., Build chest muscle, improve running endurance, 30-day weight loss challenge..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workout-equipment">Available Equipment</Label>
                  <Textarea id="workout-equipment" value={workoutEquipment} onChange={(e) => setWorkoutEquipment(e.target.value)} placeholder="e.g., Full gym access, dumbbells and bench, resistance bands, bodyweight only..." />
                </div>
                <Button onClick={handleGenerateWorkoutPlan} disabled={isPending || !workoutGoals || !workoutEquipment} className="w-full">
                  {isPending && !generatedPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Workout Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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
              {isPending && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Generating your plan...</p>
                </div>
              )}
              {generatedPlan && (
                <Markdown content={generatedPlan.content} />
              )}
              {!isPending && !generatedPlan && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground">Fill out the form on the left and click "Generate" to see your personalized plan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
