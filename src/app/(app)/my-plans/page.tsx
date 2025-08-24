import { createClient } from '@/lib/supabase/server'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Salad, Dumbbell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function DietPlanDisplay({ plan }: { plan: any }) {
    if (!plan) return null;
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-xl">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.summary}</p>
            <Accordion type="single" collapsible className="w-full">
                {plan.weekly_diet.map((daily: any) => (
                    <AccordionItem value={daily.day} key={daily.day}>
                        <AccordionTrigger className="text-md font-body hover:no-underline">
                            <div className="flex justify-between items-center w-full pr-4">
                                <span>{daily.day}</span>
                                <span className="text-xs text-muted-foreground">{daily.daily_calories} kcal</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                            {daily.meals.map((meal: any) => (
                                <div key={meal.name}>
                                    <h4 className="font-headline text-sm mb-2">{meal.name}</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-xs">
                                        {meal.items.map((item: any) => (
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

function WorkoutPlanDisplay({ plan }: { plan: any }) {
    if (!plan) return null;
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-xl">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.summary}</p>
            <Accordion type="single" collapsible className="w-full">
                {plan.weeklySchedule.map((daily: any) => (
                    <AccordionItem value={daily.day} key={daily.day}>
                        <AccordionTrigger className="text-md font-body hover:no-underline">
                            {daily.day} - {daily.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                             <ul className="space-y-2 text-xs">
                                {daily.exercises.map((exercise: any) => (
                                    <li key={exercise.name}>
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
    return (
        <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-headline text-lg mb-2">Plan Generated with this Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {profile_data.first_name && <div><strong>Name:</strong> {profile_data.first_name}</div>}
                {profile_data.age && <div><strong>Age:</strong> {profile_data.age}</div>}
                {profile_data.height && <div><strong>Height:</strong> {profile_data.height} cm</div>}
                {profile_data.weight && <div><strong>Weight:</strong> {profile_data.weight} kg</div>}
                {profile_data.gender && <div><strong>Gender:</strong> {profile_data.gender}</div>}
                {profile_data.activity_level && <div className="col-span-full"><strong>Activity:</strong> {profile_data.activity_level}</div>}
                {profile_data.medical_conditions && <div className="col-span-full"><strong>Medical Conditions:</strong> {profile_data.medical_conditions}</div>}
                {profile_data.dietary_preferences && <div className="col-span-full"><strong>Preferences:</strong> {profile_data.dietary_preferences}</div>}
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Saved Plans</h1>
        <p className="text-muted-foreground mt-1">
          Here are all the diet and workout plans you've saved.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Your Collection</CardTitle>
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
                          {isDiet && <Salad className="h-6 w-6 text-primary" />}
                          {isWorkout && <Dumbbell className="h-6 w-6 text-primary" />}
                        </div>
                        <div className="text-left">
                          <span>{plan.name}</span>
                          <p className="text-sm text-muted-foreground font-normal">
                            Saved on {new Date(plan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isDiet && isWorkout ? 'outline' : (isDiet ? 'default' : 'secondary')} className="capitalize">{plan.type}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-6">
                      {isDiet && <DietPlanDisplay plan={plan.diet_plan_details} />}
                      {isWorkout && <WorkoutPlanDisplay plan={plan.workout_plan_details} />}
                      
                      {plan.health_tips && plan.health_tips.length > 0 && (
                        <div className="border-t pt-4">
                          <h2 className="text-xl font-bold font-headline">Health Tips</h2>
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
            <div className="text-center py-16">
              <p className="text-muted-foreground">You haven't saved any plans yet.</p>
              <p className="text-muted-foreground">Go to the "Generate" page to create your first one!</p>
            </div>
          )}
          {error && <p className="text-destructive">Could not load plans.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
