import type { ProfileSchema } from "./zod-schemas";

export type Plan = {
  id: string;
  created_at: string;
  user_id: string;
  diet_plan: string;
  workout_plan: string;
  health_tips: string;
  generation_details: ProfileSchema | null;
};

export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  gender: "male" | "female" | "custom" | null;
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active"
    | null;
  fitness_goals: string | null;
  dietary_preferences: string | null;
  preferred_cuisine: string | null;
  medical_conditions: string | null;
  allergies: string | null;
};
