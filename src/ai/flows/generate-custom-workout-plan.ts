'use server';
/**
 * @fileOverview Custom workout plan generation flow.
 *
 * - generateCustomWorkoutPlan - A function that generates a custom workout plan.
 * - GenerateCustomWorkoutPlanInput - The input type for the generateCustomWorkoutPlan function.
 * - GenerateCustomWorkoutPlanOutput - The return type for the generateCustomWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomWorkoutPlanInputSchema = z.object({
  firstName: z.string().optional().describe("The user's first name."),
  age: z.number().optional().describe('The age of the user.'),
  height: z.number().optional().describe('The height of the user in centimeters.'),
  weight: z.number().optional().describe('The weight of the user in kilograms.'),
  gender: z.string().optional().describe('The gender of the user.'),
  activityLevel: z
    .string()
    .describe(
      "The user's current activity level (e.g., Sedentary, Lightly active)."
    ),
  medicalConditions: z
    .string()
    .optional()
    .describe('Any medical conditions the user has.'),
  allergies: z.string().optional().describe('Any allergies the user has.'),
});
export type GenerateCustomWorkoutPlanInput = z.infer<
  typeof GenerateCustomWorkoutPlanInputSchema
>;

const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  sets: z.string().describe('The number of sets (e.g., "3-4").'),
  reps: z.string().describe('The number of repetitions (e.g., "10-12").'),
  rest: z.string().describe('The rest period between sets (e.g., "60 seconds").'),
  notes: z.string().optional().describe('Additional notes or tips for the exercise.'),
});

const DailyWorkoutSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Monday").'),
  title: z.string().describe('The title for the day\'s workout (e.g., "Full Body Strength").'),
  exercises: z.array(ExerciseSchema).describe('A list of exercises for the day.'),
});

const GenerateCustomWorkoutPlanOutputSchema = z.object({
  workoutPlanDetails: z.object({
      title: z.string().describe('A catchy and motivating title for the entire workout plan.'),
      summary: z.string().describe('A brief summary of the workout plan.'),
      weeklySchedule: z.array(DailyWorkoutSchema).describe('A schedule of workouts for the week.')
  }).describe('The structured, generated custom workout plan.'),
  healthTips: z.array(z.string()).describe('An array of general health tips for the user.'),
});
export type GenerateCustomWorkoutPlanOutput = z.infer<
  typeof GenerateCustomWorkoutPlanOutputSchema
>;

export async function generateCustomWorkoutPlan(
  input: GenerateCustomWorkoutPlanInput
): Promise<GenerateCustomWorkoutPlanOutput> {
  return generateCustomWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomWorkoutPlanPrompt',
  input: {schema: GenerateCustomWorkoutPlanInputSchema},
  output: {schema: GenerateCustomWorkoutPlanOutputSchema},
  prompt: `You are a world-class personal trainer, known for creating effective and engaging workout plans.

Your task is to generate a structured, week-long workout plan and a list of actionable health tips for a user named {{firstName}}.

Base the plan on the following user profile, paying close attention to any medical conditions mentioned:

- Age: {{age}}
- Height: {{height}} cm
- Weight: {{weight}} kg
- Gender: {{gender}}
- Activity Level: {{{activityLevel}}}
- Medical Conditions: {{{medicalConditions}}}
- Allergies: {{{allergies}}}

The output must be a JSON object.

**Workout Plan Details:**
- The plan should cover a full week (e.g., 3-5 workout days and rest days).
- For each workout day, provide a clear title (e.g., "Upper Body Power," "Leg Day," "Cardio & Core").
- For each exercise, specify the name, number of sets, repetitions (reps), and rest time.
- Include brief, helpful notes for some exercises where appropriate.

**Health Tips:**
- Provide a list of at least 5 general health and fitness tips that would be beneficial for the user. These should be separate from the workout plan itself.

Generate a comprehensive and motivating plan that will help {{firstName}} achieve their fitness goals.`,
});

const generateCustomWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateCustomWorkoutPlanFlow',
    inputSchema: GenerateCustomWorkoutPlanInputSchema,
    outputSchema: GenerateCustomWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
