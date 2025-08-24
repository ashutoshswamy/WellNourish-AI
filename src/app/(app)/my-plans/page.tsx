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

export default async function MyPlansPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plans, error } = await supabase
    .from('plans')
    .select('id, created_at, diet_plan, workout_plan, health_tips')
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

  const getPlanContent = (plan: any) => {
    let content = ''
    if (plan.diet_plan) {
      content += plan.diet_plan
    }
    if (plan.workout_plan) {
      content += `\n\n${plan.workout_plan}`
    }
    if (plan.health_tips) {
      content += `\n\n## Health Tips\n${plan.health_tips}`
    }
    return content
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
                const planContent = getPlanContent(plan);
                return (
                  <AccordionItem value={String(plan.id)} key={plan.id}>
                    <AccordionTrigger className="text-lg font-body">
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
                    <AccordionContent className="p-4 bg-background/50 rounded-md">
                      <Markdown content={planContent} />
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
