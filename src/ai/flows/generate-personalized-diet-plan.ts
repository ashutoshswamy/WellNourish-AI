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
  firstName: z.string().optional().describe("The user's first name."),
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
  dietaryPreferences: z
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

const MealItemSchema = z.object({
  name: z.string().describe('The name of the meal item (e.g., "Greek Yogurt Parfait").'),
  description: z.string().describe('A brief description of the meal item.'),
  calories: z.number().optional().describe('Estimated calories for the meal item.'),
});

const MealSchema = z.object({
  name: z.string().describe('The name of the meal (e.g., "Breakfast", "Lunch", "Dinner", "Snack").'),
  items: z.array(MealItemSchema).describe('A list of food items for this meal.'),
});

const DailyDietSchema = z.object({
    day: z.string().describe('The day of the week (e.g., "Monday").'),
    meals: z.array(MealSchema).describe('A list of meals for the day.'),
    daily_calories: z.number().optional().describe('Estimated total calories for the day.'),
});


const GeneratePersonalizedDietPlanOutputSchema = z.object({
  dietPlanDetails: z.object({
      title: z.string().describe('A catchy and appealing title for the diet plan.'),
      summary: z.string().describe('A brief summary of the diet plan and its goals.'),
      weekly_diet: z.array(DailyDietSchema).describe('A full week of daily diet plans.')
  }).describe('A structured, personalized diet plan tailored to the user’s health profile, preferences, and goals.'),
  healthTips: z.array(z.string()).describe('An array of general health and nutrition tips for the user.'),
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
  prompt: `You are an expert nutritionist and chef, creating a personalized diet plan for a user named {{firstName}}.

Please generate a structured, week-long diet plan and a list of helpful health tips based on the following user profile:

- Name: {{firstName}}
- Age: {{age}}
- Height: {{height}} cm
- Weight: {{weight}} kg
- Gender: {{gender}}
- Activity Level: {{activityLevel}}
- Medical Conditions: {{{medicalConditions}}}
- Dietary Preferences: {{{dietaryPreferences}}}
- Preferred Cuisine: {{{preferredCuisine}}}
- Allergies: {{{allergies}}}

The output must be a JSON object.

**Diet Plan Details:**
- The plan should cover a full week.
- For each day, list out meals (Breakfast, Lunch, Dinner, and optionally Snacks).
- For each meal, provide one or more meal items with a name, a brief description, and estimated calories.
- Calculate an estimated total calorie count for each day.
- The plan should be tailored to the user’s specific needs, goals, and preferences. Make it delicious and easy to follow.

**Health Tips:**
- Provide a list of at least 5 general health and nutrition tips that would be beneficial for the user.
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
