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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" defaultValue={profile?.age ?? ''} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" name="height" type="number" step="0.1" defaultValue={profile?.height ?? ''} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" defaultValue={profile?.weight ?? ''} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={profile?.gender ?? ''}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select name="activityLevel" defaultValue={profile?.activity_level ?? ''}>
                    <SelectTrigger id="activityLevel">
                        <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="Lightly active">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                        <SelectItem value="Moderately active">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                        <SelectItem value="Very active">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                        <SelectItem value="Extra active">Extra active (very hard exercise/sports & physical job)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
              <Textarea id="dietaryPreferences" name="dietaryPreferences" placeholder="e.g., Vegetarian, Vegan, Gluten-Free, prefer quick meals, dislike spicy food." defaultValue={profile?.dietary_preferences ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredCuisine">Preferred Cuisine</Label>
              <Textarea id="preferredCuisine" name="preferredCuisine" placeholder="e.g., I love Mediterranean food, Mexican, Italian." defaultValue={profile?.preferred_cuisine ?? ''}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Textarea id="medicalConditions" name="medicalConditions" placeholder="Please list any medical conditions, e.g., diabetes, high blood pressure, etc." defaultValue={profile?.medical_conditions ?? ''}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea id="allergies" name="allergies" placeholder="Please list any food allergies, e.g., peanuts, shellfish, etc." defaultValue={profile?.allergies ?? ''}/>
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
