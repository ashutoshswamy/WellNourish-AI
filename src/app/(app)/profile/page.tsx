import { createClient } from '@/lib/supabase/server'
import { updateUserProfile } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Health Profile</h1>
        <p className="text-muted-foreground mt-1">
          This information helps us create the most effective plans for you.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Profile Details</CardTitle>
          <CardDescription>Keep your health profile up to date for the best results.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateUserProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" defaultValue={profile?.full_name ?? ''} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level</Label>
                <Select name="fitnessLevel" defaultValue={profile?.fitness_level ?? 'Beginner'}>
                  <SelectTrigger id="fitnessLevel">
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goals">Health & Fitness Goals</Label>
              <Textarea id="goals" name="goals" placeholder="e.g., Lose 10 pounds, build muscle, improve cardio..." defaultValue={profile?.goals ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthProfile">Health Profile</Label>
              <Textarea id="healthProfile" name="healthProfile" placeholder="Include any relevant medical history, lifestyle details (e.g., sedentary job), allergies, and dietary restrictions." defaultValue={profile?.health_profile ?? ''}/>
              <p className="text-sm text-muted-foreground">This information is kept confidential and is only used to personalize your plans.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Dietary Preferences</Label>
              <Textarea id="preferences" name="preferences" placeholder="e.g., I love Mediterranean food, prefer quick meals, dislike spicy food." defaultValue={profile?.preferences ?? ''}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Available Equipment</Label>
              <Textarea id="equipment" name="equipment" placeholder="e.g., Dumbbells, resistance bands, treadmill, or 'bodyweight only'." defaultValue={profile?.equipment ?? ''}/>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
