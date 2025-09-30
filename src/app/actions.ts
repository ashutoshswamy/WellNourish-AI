'use server';

import { z } from 'zod';
import { generateDietPlan } from '@/ai/flows/generate-diet-plan';
import { generateWorkoutRegimen } from '@/ai/flows/generate-workout-regimen';

const FormSchema = z.object({
  age: z.coerce.number().min(1, 'Age is required.'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required.' }),
  height: z.coerce.number().min(1, 'Height is required.'),
  weight: z.coerce.number().min(1, 'Weight is required.'),
  activityLevel: z.enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive'], { required_error: 'Activity level is required.' }),
  goal: z.enum(['weightLoss', 'muscleGain', 'maintainWeight'], { required_error: 'Goal is required.' }),
});

export type PlanState = {
  dietPlan?: string;
  workoutRegimen?: string;
  error?: string;
};

export async function generatePlans(
  prevState: PlanState,
  formData: FormData,
): Promise<PlanState> {
  const validatedFields = FormSchema.safeParse({
    age: formData.get('age'),
    gender: formData.get('gender'),
    height: formData.get('height'),
    weight: formData.get('weight'),
    activityLevel: formData.get('activityLevel'),
    goal: formData.get('goal'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || "Invalid input."
    return {
      error: firstError,
    };
  }
  
  const { age, gender, height, weight, activityLevel, goal } = validatedFields.data;

  try {
    const [dietResult, workoutResult] = await Promise.all([
      generateDietPlan({
        age,
        gender,
        heightCm: height,
        weightKg: weight,
        activityLevel,
        goal,
      }),
      generateWorkoutRegimen({
        age,
        gender,
        height,
        weight,
        activityLevel,
        fitnessGoals: goal,
      }),
    ]);
    
    return {
      dietPlan: dietResult.dietPlan,
      workoutRegimen: workoutResult.workoutRegimen,
    };
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to generate plans. Please try again later.',
    };
  }
}
