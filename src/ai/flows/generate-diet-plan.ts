"use server";

/**
 * @fileOverview A diet plan generation AI agent.
 *
 * - generateDietPlan - A function that handles the diet plan generation process.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateDietPlanInputSchema = z.object({
  age: z.number().describe("The age of the user in years."),
  gender: z.enum(["male", "female"]).describe("The gender of the user."),
  heightCm: z.number().describe("The height of the user in centimeters."),
  weightKg: z.number().describe("The weight of the user in kilograms."),
  activityLevel: z
    .enum([
      "sedentary",
      "lightlyActive",
      "moderatelyActive",
      "veryActive",
      "extraActive",
    ])
    .describe("The activity level of the user."),
  goal: z.string().describe("The fitness goal of the user."),
  dietaryPreferences: z
    .array(z.string())
    .optional()
    .describe("Dietary preferences (e.g., vegetarian, vegan, keto, paleo)."),
  preferredCuisine: z
    .array(z.string())
    .optional()
    .describe(
      "Preferred cuisine types (e.g., Italian, Indian, Mediterranean)."
    ),
  allergies: z
    .array(z.string())
    .optional()
    .describe("Food allergies and intolerances."),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe("The generated diet plan."),
});
export type GenerateDietPlanOutput = z.infer<
  typeof GenerateDietPlanOutputSchema
>;

export async function generateDietPlan(
  input: GenerateDietPlanInput
): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateDietPlanPrompt",
  input: { schema: GenerateDietPlanInputSchema },
  output: { schema: GenerateDietPlanOutputSchema },
  prompt: `You are a personal nutritionist. Generate a diet plan for a user based on their profile and goals.

User Profile:
Age: {{{age}}}
Gender: {{{gender}}}
Height: {{{heightCm}}} cm
Weight: {{{weightKg}}} kg
Activity Level: {{{activityLevel}}}
Goal: {{{goal}}}
{{#if dietaryPreferences}}Dietary Preferences: {{{dietaryPreferences}}}{{/if}}
{{#if preferredCuisine}}Preferred Cuisine: {{{preferredCuisine}}}{{/if}}
{{#if allergies}}Allergies/Intolerances: {{{allergies}}}{{/if}}

Please create a comprehensive diet plan that:
1. Aligns with their fitness goal
2. Respects their dietary preferences and restrictions
3. Incorporates their preferred cuisines when possible
4. Avoids any mentioned allergens completely
5. Provides daily meal suggestions with approximate portions
6. Includes nutritional guidance and tips

**IMPORTANT: Format your response in clean, well-structured Markdown. Use headers (##, ###), bullet points, tables where appropriate, and bold text for emphasis. Make it visually appealing and easy to read.**

Diet Plan:`,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: "generateDietPlanFlow",
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
