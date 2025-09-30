// src/ai/flows/generate-workout-regimen.ts
"use server";
/**
 * @fileOverview Workout regimen AI agent.
 *
 * - generateWorkoutRegimen - A function that handles the workout regimen generation.
 * - GenerateWorkoutRegimenInput - The input type for the generateWorkoutRegimen function.
 * - GenerateWorkoutRegimenOutput - The return type for the generateWorkoutRegimen function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateWorkoutRegimenInputSchema = z.object({
  age: z.number().describe("The age of the user."),
  gender: z.string().describe("The gender of the user."),
  height: z.number().describe("The height of the user in centimeters."),
  weight: z.number().describe("The weight of the user in kilograms."),
  activityLevel: z
    .string()
    .describe(
      "The activity level of the user (e.g., sedentary, lightly active, moderately active, very active, extra active)."
    ),
  fitnessGoals: z
    .string()
    .describe(
      "The fitness goals of the user (e.g., weight loss, muscle gain, general fitness)."
    ),
});
export type GenerateWorkoutRegimenInput = z.infer<
  typeof GenerateWorkoutRegimenInputSchema
>;

const GenerateWorkoutRegimenOutputSchema = z.object({
  workoutRegimen: z
    .string()
    .describe("A personalized workout regimen tailored to the user."),
});
export type GenerateWorkoutRegimenOutput = z.infer<
  typeof GenerateWorkoutRegimenOutputSchema
>;

export async function generateWorkoutRegimen(
  input: GenerateWorkoutRegimenInput
): Promise<GenerateWorkoutRegimenOutput> {
  return generateWorkoutRegimenFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateWorkoutRegimenPrompt",
  input: { schema: GenerateWorkoutRegimenInputSchema },
  output: { schema: GenerateWorkoutRegimenOutputSchema },
  prompt: `You are a personal trainer who specializes in creating workout plans.

  Based on the user's profile and goals, generate a comprehensive workout regimen.

  User Profile:
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Height: {{{height}}} cm
  - Weight: {{{weight}}} kg
  - Activity Level: {{{activityLevel}}}
  - Fitness Goals: {{{fitnessGoals}}}

  Please create a detailed workout regimen that includes:
  1. Weekly schedule breakdown
  2. Specific exercises with sets and reps
  3. Rest days and recovery guidance
  4. Progression tips
  5. Safety considerations

  **IMPORTANT: Format your response in clean, well-structured Markdown. Use headers (##, ###), bullet points, tables where appropriate, and bold text for emphasis. Make it visually appealing and easy to read.**

  Workout Regimen:`,
});

const generateWorkoutRegimenFlow = ai.defineFlow(
  {
    name: "generateWorkoutRegimenFlow",
    inputSchema: GenerateWorkoutRegimenInputSchema,
    outputSchema: GenerateWorkoutRegimenOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
