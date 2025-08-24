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
  healthProfile: z
    .string()
    .describe(
      'A detailed health profile of the user, including medical history, lifestyle, and fitness goals.'
    ),
  preferences: z
    .string()
    .describe('The user’s dietary preferences, including preferred foods and cuisine types, and any allergies or dietary restrictions.'),
  goals: z
    .string()
    .describe('The user’s health and fitness goals, such as weight loss, muscle gain, or improved energy levels.'),
});
export type GeneratePersonalizedDietPlanInput = z.infer<
  typeof GeneratePersonalizedDietPlanInputSchema
>;

const GeneratePersonalizedDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe('A personalized diet plan tailored to the user’s health profile, preferences, and goals.'),
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
  prompt: `You are an expert nutritionist. Please generate a personalized diet plan based on the following information:

Health Profile: {{{healthProfile}}}
Preferences: {{{preferences}}}
Goals: {{{goals}}}

The diet plan should be tailored to the user’s specific needs and preferences. It should be detailed and easy to follow.
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
