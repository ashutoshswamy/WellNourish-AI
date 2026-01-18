import { z } from "zod"

export const profileSchema = z.object({
  age: z.number().min(10, "Must be at least 10").max(100, "Must be less than 100"),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().min(50, "Must be at least 50cm").max(300, "Must be less than 300cm"), // cm
  weight: z.number().min(20, "Must be at least 20kg").max(500, "Must be less than 500kg"), // kg
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active"
  ]),
  cuisinePreferences: z.string().array().min(1, "Select at least one cuisine"),
  dietaryPreferences: z.string().array(),
  medicalConditions: z.string().array(),
  allergies: z.string().array(),
  goals: z.string().array().min(1, "Select at least one goal"),
})

export const onboardingSchema = profileSchema.extend({
  planDuration: z.literal("7"),
})

export type ProfileData = z.infer<typeof profileSchema>
export type OnboardingData = z.infer<typeof onboardingSchema>
