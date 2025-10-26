import { z } from "zod";

export const userInputSchema = z.object({
  age: z
    .number()
    .min(10, "Age must be at least 10")
    .max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female", "other"]),
  height: z
    .number()
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height must be less than 300 cm"),
  weight: z
    .number()
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must be less than 500 kg"),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  dietPreference: z.string().min(1, "Diet preference is required"),
  customDietPreference: z.string().optional(),
  cuisinePreferences: z
    .array(z.string())
    .min(1, "Select or add at least one cuisine"),
  customCuisine: z.string().optional(),
  allergies: z.string(),
  goals: z
    .string()
    .min(5, "Please describe your fitness goals (at least 5 characters)"),
});

export type UserInputForm = z.infer<typeof userInputSchema>;
