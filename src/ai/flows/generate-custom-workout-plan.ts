// This file is machine-generated - edit with caution!
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
  fitnessLevel: z
    .enum(['Beginner', 'Intermediate', 'Advanced'])
    .describe('The user fitness level: Beginner, Intermediate, or Advanced.'),
  goals: z.string().describe('The user fitness goals.'),
  equipment: z.string().describe('The available equipment.'),
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

Create a custom workout plan based on the user's fitness level, goals, and available equipment.

Fitness Level: {{{fitnessLevel}}}
Goals: {{{goals}}}
Available Equipment: {{{equipment}}}

Workout Plan:`, 
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
