// src/ai/flows/receive-health-tips.ts
"use server";

/**
 * @fileOverview A personalized health tips AI agent.
 *
 * - receiveHealthTips - A function that generates personalized health tips.
 * - ReceiveHealthTipsInput - The input type for the receiveHealthTips function.
 * - ReceiveHealthTipsOutput - The return type for the receiveHealthTips function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ReceiveHealthTipsInputSchema = z.object({
  age: z.number().describe("The user's age in years."),
  height: z.number().describe("The user's height in centimeters."),
  weight: z.number().describe("The user's weight in kilograms."),
  gender: z.string().describe("The user's gender."),
  activityLevel: z
    .string()
    .describe(
      "The user's activity level (e.g., sedentary, lightly active, moderately active, very active, extra active)."
    ),
  dietaryPreferences: z
    .string()
    .describe(
      "The user's dietary preferences (e.g., vegetarian, vegan, gluten-free, ketogenic, paleo, etc.)."
    ),
  preferredCuisine: z
    .string()
    .describe(
      "The user's preferred cuisines (e.g., Italian, Mexican, Asian, etc.)."
    ),
  dietPlan: z.string().describe("The user's personalized diet plan."),
  workoutPlan: z.string().describe("The user's personalized workout plan."),
});
export type ReceiveHealthTipsInput = z.infer<
  typeof ReceiveHealthTipsInputSchema
>;

const ReceiveHealthTipsOutputSchema = z.object({
  healthTips: z.string().describe("Personalized health tips for the user."),
});
export type ReceiveHealthTipsOutput = z.infer<
  typeof ReceiveHealthTipsOutputSchema
>;

export async function receiveHealthTips(
  input: ReceiveHealthTipsInput
): Promise<ReceiveHealthTipsOutput> {
  return receiveHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: "receiveHealthTipsPrompt",
  input: { schema: ReceiveHealthTipsInputSchema },
  output: { schema: ReceiveHealthTipsOutputSchema },
  prompt: `You are a personal health advisor. Based on the user's profile and generated plans, provide personalized health tips.

Here is the user's profile:
Age: {{{age}}}
Height: {{{height}}} cm
Weight: {{{weight}}} kg
Gender: {{{gender}}}
Activity Level: {{{activityLevel}}}
Dietary Preferences: {{{dietaryPreferences}}}
Preferred Cuisine: {{{preferredCuisine}}}

Here is the user's diet plan:
{{{dietPlan}}}

Here is the user's workout plan:
{{{workoutPlan}}}

Provide 3-5 actionable and personalized health tips to help the user achieve their health goals.`,
});

const receiveHealthTipsFlow = ai.defineFlow(
  {
    name: "receiveHealthTipsFlow",
    inputSchema: ReceiveHealthTipsInputSchema,
    outputSchema: ReceiveHealthTipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
