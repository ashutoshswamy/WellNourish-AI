import { createClient } from '@/lib/supabase/server'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Markdown } from '@/components/Markdown'
import { Salad, Dumbbell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function ProfileDataDisplay({ profile_data }: { profile_data: any }) {
    if (!profile_data) return null;
    return (
        <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-headline text-lg mb-2">Plan Generated with this Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {profile_data.age && <div><strong>Age:</strong> {profile_data.age}</div>}
                {profile_data.height && <div><strong>Height:</strong> {profile_data.height} cm</div>}
                {profile_data.weight && <div><strong>Weight:</strong> {profile_data.weight} kg</div>}
                {profile_data.gender && <div><strong>Gender:</strong> {profile_data.gender}</div>}
                {profile_data.activity_level && <div className="col-span-2"><strong>Activity:</strong> {profile_data.activity_level}</div>}
                 {profile_data.medical_conditions && <div className="col-span-full"><strong>Medical Conditions:</strong> {profile_data.medical_conditions}</div>}
                {profile_data.dietery_preferences && <div className="col-span-full"><strong>Preferences:</strong> {profile_data.dietery_preferences}</div>}
            </div>
        </div>
    )
}

export default async function MyPlansPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plans, error } = await supabase
    .from('plans')
    .select('id, created_at, diet_plan, workout_plan, health_tips, profile_data')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const getPlanType = (plan: any) => {
    if (plan.diet_plan && plan.workout_plan) return 'hybrid'
    if (plan.diet_plan) return 'diet'
    return 'workout'
  }

  const getPlanName = (plan: any) => {
    const type = getPlanType(plan)
    if (type === 'diet') return 'Diet Plan'
    if (type === 'workout') return 'Workout Plan'
    return 'Hybrid Plan'
  }

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
              {plans.map((plan) => {
                const planType = getPlanType(plan);
                const planName = getPlanName(plan);
                return (
                  <AccordionItem value={String(plan.id)} key={plan.id}>
                    <AccordionTrigger className="text-lg font-body hover:no-underline">
                      <div className="flex items-center gap-4">
                        {planType === 'diet' ? <Salad className="h-6 w-6 text-primary" /> : <Dumbbell className="h-6 w-6 text-primary" />}
                        <div className="text-left">
                          <span>{planName}</span>
                          <p className="text-sm text-muted-foreground font-normal">
                            Saved on {new Date(plan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={planType === 'diet' ? 'default' : 'secondary'} className="capitalize">{planType}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/20 rounded-md space-y-4">
                      {plan.diet_plan && <Markdown content={plan.diet_plan} />}
                      {plan.workout_plan && <Markdown content={plan.workout_plan} />}
                      {plan.health_tips && (
                        <div>
                          <h2 className="text-xl font-bold font-headline mt-4 border-t pt-4">Health Tips</h2>
                          <Markdown content={plan.health_tips} />
                        </div>
                      )}
                      {plan.profile_data && <ProfileDataDisplay profile_data={plan.profile_data} />}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">You haven't saved any plans yet.</p>
              <p className="text-muted-foreground">Go to the "Generate Plans" page to create your first one!</p>
            </div>
          )}
          {error && <p className="text-destructive">Could not load plans.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
