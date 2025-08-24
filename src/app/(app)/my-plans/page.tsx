import { createClient } from '@/lib/supabase/server'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Salad, Dumbbell, Stethoscope } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function DietPlanDisplay({ plan }: { plan: any }) {
    if (!plan) return null;
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-xl">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.summary}</p>
            <Accordion type="single" collapsible className="w-full">
                {plan.weekly_diet.map((daily: any, index: number) => (
                    <AccordionItem value={daily.day || `day-${index}`} key={daily.day || `day-${index}`}>
                        <AccordionTrigger className="text-md font-body hover:no-underline">
                            <div className="flex justify-between items-center w-full pr-4">
                                <span>{daily.day}</span>
                                <span className="text-xs text-muted-foreground">{daily.daily_calories} kcal</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                            {daily.meals.map((meal: any, mealIndex: number) => (
                                <div key={meal.name || `meal-${mealIndex}`}>
                                    <h4 className="font-headline text-sm mb-2">{meal.name}</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-xs">
                                        {meal.items.map((item: any, itemIndex: number) => (
                                            <li key={item.name || `item-${itemIndex}`}>
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

function WorkoutPlanDisplay({ plan }: { plan: any }) {
    if (!plan) return null;
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-xl">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.summary}</p>
            <Accordion type="single" collapsible className="w-full">
                {plan.weeklySchedule.map((daily: any, index: number) => (
                    <AccordionItem value={daily.day || `day-${index}`} key={daily.day || `day-${index}`}>
                        <AccordionTrigger className="text-md font-body hover:no-underline">
                            {daily.day} - {daily.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                             <ul className="space-y-2 text-xs">
                                {daily.exercises.map((exercise: any, exIndex: number) => (
                                    <li key={exercise.name || `ex-${exIndex}`}>
                                        <strong>{exercise.name}:</strong> {exercise.sets} sets of {exercise.reps} reps, {exercise.rest} rest.
                                        {exercise.notes && <p className="text-xs text-muted-foreground pl-2">- {exercise.notes}</p>}
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
    const { first_name, age, height, weight, gender, activity_level, medical_conditions, dietary_preferences, allergies, preferred_cuisine } = profile_data;

    return (
        <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-headline text-lg mb-2">Plan Generated with this Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {first_name && <div><strong>Name:</strong> {first_name}</div>}
                {age && <div><strong>Age:</strong> {age}</div>}
                {height && <div><strong>Height:</strong> {height} cm</div>}
                {weight && <div><strong>Weight:</strong> {weight} kg</div>}
                {gender && <div><strong>Gender:</strong> {gender}</div>}
                {activity_level && <div className="sm:col-span-2"><strong>Activity:</strong> {activity_level}</div>}
                {medical_conditions && <div className="sm:col-span-full"><strong>Medical Conditions:</strong> {medical_conditions}</div>}
                {dietary_preferences && <div className="sm:col-span-full"><strong>Dietary Preferences:</strong> {dietary_preferences}</div>}
                {preferred_cuisine && <div className="sm:col-span-full"><strong>Cuisine:</strong> {preferred_cuisine}</div>}
                {allergies && <div className="sm:col-span-full"><strong>Allergies:</strong> {allergies}</div>}
            </div>
        </div>
    )
}

export default async function MyPlansPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">My Saved Plans</h1>
        <p className="text-muted-foreground mt-1">
          Here are all the diet and workout plans you've saved.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl sm:text-2xl">Your Collection</CardTitle>
          <CardDescription>Click on a plan to view its details.</CardDescription>
        </CardHeader>
        <CardContent>
          {plans && plans.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {plans.map((plan: any) => {
                const isDiet = plan.type === 'diet' || plan.type === 'hybrid';
                const isWorkout = plan.type === 'workout' || plan.type === 'hybrid';
                
                return (
                  <AccordionItem value={String(plan.id)} key={plan.id}>
                    <AccordionTrigger className="text-lg font-body hover:no-underline">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                                {isDiet && <Salad className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                                {isWorkout && <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                            </div>
                            <div className="text-left flex-1">
                                <span className="text-base sm:text-lg">{plan.name}</span>
                                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                    Saved on {new Date(plan.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <Badge variant={isDiet && isWorkout ? 'outline' : (isDiet ? 'default' : 'secondary')} className="capitalize ml-auto">{plan.type}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-6">
                      {isDiet && <DietPlanDisplay plan={plan.diet_plan_details} />}
                      {isWorkout && <WorkoutPlanDisplay plan={plan.workout_plan_details} />}
                      
                      {plan.health_tips && plan.health_tips.length > 0 && (
                        <div className="border-t pt-4">
                          <h2 className="text-lg sm:text-xl font-bold font-headline flex items-center gap-2"><Stethoscope className="h-5 w-5"/> Health Tips</h2>
                          <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                            {plan.health_tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                          </ul>
                        </div>
                      )}
                      {plan.profile_snapshot && <ProfileDataDisplay profile_data={plan.profile_snapshot} />}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-muted-foreground">You haven't saved any plans yet.</p>
              <p className="text-muted-foreground mt-2">Go to the "Generate" page to create your first one!</p>
            </div>
          )}
          {error && <p className="text-destructive text-center py-12 sm:py-16">Could not load plans.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
