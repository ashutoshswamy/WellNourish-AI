'use server';

/**
 * @fileOverview A diet plan generation AI agent.
 *
 * - generateDietPlan - A function that handles the diet plan generation process.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietPlanInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  gender: z.enum(['male', 'female']).describe('The gender of the user.'),
  heightCm: z.number().describe('The height of the user in centimeters.'),
  weightKg: z.number().describe('The weight of the user in kilograms.'),
  activityLevel: z
    .enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive'])
    .describe('The activity level of the user.'),
  goal: z
    .enum(['weightLoss', 'muscleGain', 'maintainWeight'])
    .describe('The fitness goal of the user.'),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('The generated diet plan.'),
});
export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

export async function generateDietPlan(input: GenerateDietPlanInput): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are a personal nutritionist. Generate a diet plan for a user based on their profile and goals.

User Profile:
Age: {{{age}}}
Gender: {{{gender}}}
Height: {{{heightCm}}} cm
Weight: {{{weightKg}}} kg
Activity Level: {{{activityLevel}}}
Goal: {{{goal}}}

Diet Plan:`, 
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
