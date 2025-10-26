export interface UserInput {
  age: number;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  dietPreference: string; // Now accepts any custom string
  customDietPreference?: string;
  cuisinePreferences: string[]; // Now accepts any custom cuisines
  customCuisine?: string;
  allergies: string;
  goals: string; // Now required
}

export interface PlanResponse {
  dietPlan: string;
  workoutPlan: string;
  nutritionSummary: string;
  recommendations: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface SavedPlan {
  id: string;
  user_id: string;
  plan_data: {
    fullPlan: string;
    bmi: string;
    bmiCategory: string;
  };
  user_inputs: UserInput;
  created_at: string;
  updated_at: string;
}
