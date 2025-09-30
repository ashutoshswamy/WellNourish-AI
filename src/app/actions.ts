"use server";

import { z } from "zod";
import { generateDietPlan } from "@/ai/flows/generate-diet-plan";
import { generateWorkoutRegimen } from "@/ai/flows/generate-workout-regimen";
import { createClient } from "@/lib/supabase/server";

const FormSchema = z.object({
  age: z.coerce.number().min(1, "Age is required."),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    required_error: "Gender is required.",
  }),
  height_cm: z.coerce.number().min(1, "Height in cm is required."),
  height_ft: z.coerce.number().optional(),
  height_inches: z.coerce.number().optional(),
  weight_kg: z.coerce.number().min(1, "Weight in kg is required."),
  weight_lbs: z.coerce.number().optional(),
  activityLevel: z.enum(
    [
      "sedentary",
      "lightlyActive",
      "moderatelyActive",
      "veryActive",
      "extraActive",
    ],
    { required_error: "Activity level is required." }
  ),
  dietary_preferences: z.array(z.string()).optional(),
  preferred_cuisine: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  goal: z.string().min(1, "Goal is required."),
});

export type PlanState = {
  dietPlan?: string;
  workoutRegimen?: string;
  planId?: string;
  error?: string;
};

export async function generatePlans(
  prevState: PlanState,
  formData: FormData
): Promise<PlanState> {
  // Parse arrays from form data
  const dietaryPreferences = formData
    .getAll("dietary_preferences")
    .filter(Boolean) as string[];
  const preferredCuisine = formData
    .getAll("preferred_cuisine")
    .filter(Boolean) as string[];
  const allergiesData = formData
    .getAll("allergies")
    .filter(Boolean) as string[];

  const validatedFields = FormSchema.safeParse({
    age: formData.get("age"),
    gender: formData.get("gender"),
    height_cm: formData.get("height_cm"),
    height_ft: formData.get("height_ft") || undefined,
    height_inches: formData.get("height_inches") || undefined,
    weight_kg: formData.get("weight_kg"),
    weight_lbs: formData.get("weight_lbs") || undefined,
    activityLevel: formData.get("activityLevel"),
    dietary_preferences:
      dietaryPreferences.length > 0 ? dietaryPreferences : undefined,
    preferred_cuisine:
      preferredCuisine.length > 0 ? preferredCuisine : undefined,
    allergies: allergiesData.length > 0 ? allergiesData : undefined,
    goal: formData.get("goal"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError =
      Object.values(errorMessages).flat()[0] || "Invalid input.";
    return {
      error: firstError,
    };
  }

  const {
    age,
    gender,
    height_cm,
    height_ft,
    height_inches,
    weight_kg,
    weight_lbs,
    activityLevel,
    dietary_preferences,
    preferred_cuisine,
    allergies,
    goal,
  } = validatedFields.data;

  try {
    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        error: "You must be logged in to generate plans.",
      };
    }

    // Generate AI plans with enhanced data
    const [dietResult, workoutResult] = await Promise.all([
      generateDietPlan({
        age,
        gender: gender as "male" | "female", // Cast for AI function compatibility
        heightCm: height_cm,
        weightKg: weight_kg,
        activityLevel,
        goal,
        dietaryPreferences,
        preferredCuisine,
        allergies,
      }),
      generateWorkoutRegimen({
        age,
        gender: gender as "male" | "female", // Cast for AI function compatibility
        height: height_cm,
        weight: weight_kg,
        activityLevel,
        fitnessGoals: goal,
      }),
    ]);

    // Save/update profile in database
    let profile = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profile.data) {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          age,
          gender,
          height_cm,
          height_ft,
          height_inches,
          weight_kg,
          weight_lbs,
          activity_level: activityLevel,
          dietary_preferences,
          preferred_cuisine,
          allergies,
          goal,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return {
          error: "Failed to save profile data.",
        };
      }
      profile.data = updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          age,
          gender,
          height_cm,
          height_ft,
          height_inches,
          weight_kg,
          weight_lbs,
          activity_level: activityLevel,
          dietary_preferences,
          preferred_cuisine,
          allergies,
          goal,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return {
          error: "Failed to save profile data.",
        };
      }
      profile.data = newProfile;
    }

    if (!profile.data) {
      return {
        error: "Failed to save profile data.",
      };
    }

    // Save the generated plan
    const planTitle = `${goal} Plan - ${new Date().toLocaleDateString()}`;

    const { data: savedPlan, error: planError } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        profile_id: profile.data.id,
        diet_plan: dietResult.dietPlan,
        workout_regimen: workoutResult.workoutRegimen,
        title: planTitle,
      })
      .select()
      .single();

    if (planError) {
      console.error("Error creating plan:", planError);
      return {
        error: "Plans generated but failed to save. Please try again.",
      };
    }

    return {
      dietPlan: dietResult.dietPlan,
      workoutRegimen: workoutResult.workoutRegimen,
      planId: savedPlan.id,
    };
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to generate plans. Please try again later.",
    };
  }
}
