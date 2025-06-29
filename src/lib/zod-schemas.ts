import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = z
  .object({
    displayName: z.string().min(1, { message: "Display name is required" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120),
  height: z.coerce.number().min(1, "Height is required"),
  weight: z.coerce.number().min(1, "Weight is required"),
  gender: z.enum(["male", "female", "custom"]),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
  fitnessGoals: z.string().min(1, "Fitness goals are required"),
  dietaryPreferences: z.string().min(1, "Dietary preferences are required"),
  preferredCuisine: z.string().min(1, "Cuisine preferences are required"),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
