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

const GenerateCustomWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated custom workout plan.'),
  healthTips: z.string().describe('General health tips for the user.'),
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

Create a custom workout plan and some health tips based on the user's profile. Consider any medical conditions provided.

- Age: {{age}}
- Height: {{height}} cm
- Weight: {{weight}} kg
- Gender: {{gender}}
- Activity Level: {{{activityLevel}}}
- Medical Conditions: {{{medicalConditions}}}
- Allergies: {{{allergies}}}

Provide a detailed workout plan and relevant health tips.`,
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
