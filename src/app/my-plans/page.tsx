import { createClient } from '@/lib/supabase/server'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Markdown } from '@/components/Markdown'
import { Salad, Dumbbell, Stethoscope } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function MyPlansPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plans, error } = await supabase
    .from('plans')
    .select('id, diet_plan, workout_plan, health_tips, created_at, generation_details')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    
  const getPlanTitle = (plan: any) => {
    const date = new Date(plan.created_at).toLocaleDateString();
    if (plan.generation_details?.type === 'diet') {
        return `Diet Plan - ${date}`;
    }
    if (plan.generation_details?.type === 'workout') {
        return `Workout Plan - ${date}`;
    }
    return `Plan - ${date}`;
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
              {plans.map((plan) => (
                <AccordionItem value={plan.id.toString()} key={plan.id}>
                  <AccordionTrigger className="text-lg font-body">
                    <div className="flex items-center gap-4">
                      {plan.generation_details?.type === 'diet' ? <Salad className="h-6 w-6 text-primary" /> : <Dumbbell className="h-6 w-6 text-primary" />}
                      <div className="text-left">
                        <span>{getPlanTitle(plan)}</span>
                        <p className="text-sm text-muted-foreground font-normal">
                          Saved on {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={plan.generation_details?.type === 'diet' ? 'default' : 'secondary'} className="capitalize">{plan.generation_details?.type}</Badge>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-background/50 rounded-md space-y-4">
                    {plan.diet_plan && <Markdown content={plan.diet_plan} />}
                    {plan.workout_plan && <Markdown content={plan.workout_plan} />}
                    {plan.health_tips && (
                        <div>
                            <h3 className="font-headline text-xl flex items-center gap-2 mb-2"><Stethoscope className="h-5 w-5 text-primary" /> Health Tips</h3>
                            <Markdown content={plan.health_tips} />
                        </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
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
