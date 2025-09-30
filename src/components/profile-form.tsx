'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generatePlans, type PlanState } from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';

const initialState: PlanState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Generate My Plan
        </>
      )}
    </Button>
  );
}

export function ProfileForm({
  onPlanGenerated,
}: {
  onPlanGenerated: (plans: PlanState) => void;
}) {
  const [state, formAction] = useFormState(generatePlans, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    } else if (state.dietPlan && state.workoutRegimen) {
      onPlanGenerated(state);
    }
  }, [state, onPlanGenerated, toast]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <form action={formAction}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself to generate a personalized wellness plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" placeholder="e.g., 30" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" name="height" type="number" placeholder="e.g., 175" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" placeholder="e.g., 70" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Activity Level</Label>
              <RadioGroup name="activityLevel" defaultValue="moderatelyActive" className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3 lg:grid-cols-5">
                <div>
                  <RadioGroupItem value="sedentary" id="sedentary" className="peer sr-only" />
                  <Label htmlFor="sedentary" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Sedentary
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="lightlyActive" id="lightlyActive" className="peer sr-only" />
                  <Label htmlFor="lightlyActive" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="moderatelyActive" id="moderatelyActive" className="peer sr-only" />
                  <Label htmlFor="moderatelyActive" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Moderate
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="veryActive" id="veryActive" className="peer sr-only" />
                  <Label htmlFor="veryActive" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Very Active
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="extraActive" id="extraActive" className="peer sr-only" />
                  <Label htmlFor="extraActive" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Extra Active
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="goal">Primary Goal</Label>
              <Select name="goal" required>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weightLoss">Weight Loss</SelectItem>
                  <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                  <SelectItem value="maintainWeight">Maintain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
