'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized diet plans based on user health profiles, preferences, and goals.
 *
 * - generatePersonalizedDietPlan - The function to generate a personalized diet plan.
 * - GeneratePersonalizedDietPlanInput - The input type for the generatePersonalizedDietPlan function.
 * - GeneratePersonalizedDietPlanOutput - The output type for the generatePersonalizedDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedDietPlanInputSchema = z.object({
  age: z.number().optional().describe('The age of the user.'),
  height: z.number().optional().describe('The height of the user in centimeters.'),
  weight: z.number().optional().describe('The weight of the user in kilograms.'),
  gender: z.string().optional().describe('The gender of the user.'),
  activityLevel: z
    .string()
    .optional()
    .describe('The activity level of the user.'),
  medicalConditions: z
    .string()
    .optional()
    .describe('Any medical conditions the user has.'),
  dieteryPreferences: z
    .string()
    .optional()
    .describe('The dietary preferences of the user.'),
  preferredCuisine: z
    .string()
    .optional()
    .describe('The preferred cuisine of the user.'),
  allergies: z.string().optional().describe('Any allergies the user has.'),
});
export type GeneratePersonalizedDietPlanInput = z.infer<
  typeof GeneratePersonalizedDietPlanInputSchema
>;

const GeneratePersonalizedDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe('A personalized diet plan tailored to the user’s health profile, preferences, and goals.'),
  healthTips: z.string().describe('General health tips for the user.'),
});
export type GeneratePersonalizedDietPlanOutput = z.infer<
  typeof GeneratePersonalizedDietPlanOutputSchema
>;

export async function generatePersonalizedDietPlan(
  input: GeneratePersonalizedDietPlanInput
): Promise<GeneratePersonalizedDietPlanOutput> {
  return generatePersonalizedDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedDietPlanPrompt',
  input: {schema: GeneratePersonalizedDietPlanInputSchema},
  output: {schema: GeneratePersonalizedDietPlanOutputSchema},
  prompt: `You are an expert nutritionist. Please generate a personalized diet plan and health tips based on the following user profile:

- Age: {{age}}
- Height: {{height}} cm
- Weight: {{weight}} kg
- Gender: {{gender}}
- Activity Level: {{activityLevel}}
- Medical Conditions: {{{medicalConditions}}}
- Dietary Preferences: {{{dieteryPreferences}}}
- Preferred Cuisine: {{{preferredCuisine}}}
- Allergies: {{{allergies}}}

The diet plan should be detailed, easy to follow, and tailored to the user’s specific needs and preferences.
The health tips should be relevant to the user's profile and goals.
`,
});

const generatePersonalizedDietPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedDietPlanFlow',
    inputSchema: GeneratePersonalizedDietPlanInputSchema,
    outputSchema: GeneratePersonalizedDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
