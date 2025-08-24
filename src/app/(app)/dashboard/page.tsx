import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BotMessageSquare, NotebookText } from 'lucide-react'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userName = user?.email?.split('@')[0] || 'User'
  userName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground mt-1">Here's your wellness snapshot. Ready to continue your journey?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <BotMessageSquare className="text-primary" />
              Generate a New Plan
            </CardTitle>
            <CardDescription>Let our AI craft a new diet or workout plan tailored just for you.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild className="w-full">
              <Link href="/generate">
                Generate Plan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <NotebookText className="text-primary" />
              View Saved Plans
            </CardTitle>
            <CardDescription>Access your previously saved diet and workout routines.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild variant="secondary" className="w-full">
              <Link href="/my-plans">My Plans</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1 bg-accent/20 border-accent/20 flex flex-col">
           <CardHeader>
            <CardTitle className="font-headline text-2xl">Track Your Progress</CardTitle>
            <CardDescription>Visualize your journey and stay motivated.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <div className="text-center text-muted-foreground p-8">
                <p>Progress tracking charts coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
