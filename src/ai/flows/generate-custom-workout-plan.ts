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
  fitnessGoals: z.string().describe('The user fitness goals.'),
  activityLevel: z
    .string()
    .describe(
      "The user's current activity level (e.g., Sedentary, Lightly active)."
    ),
  medicalConditions: z
    .string()
    .optional()
    .describe('Any medical conditions the user has.'),
});
export type GenerateCustomWorkoutPlanInput = z.infer<
  typeof GenerateCustomWorkoutPlanInputSchema
>;

const GenerateCustomWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated custom workout plan.'),
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
  prompt: `You are a personal trainer who creates workout plans.

Create a custom workout plan based on the user's fitness goals and activity level. Consider any medical conditions provided.

- Fitness Goals: {{{fitnessGoals}}}
- Activity Level: {{{activityLevel}}}
- Medical Conditions: {{{medicalConditions}}}

Provide a detailed workout plan.`,
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
