"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  generatePersonalizedPlan,
  type GeneratePersonalizedPlanOutput,
} from "@/ai/flows/generate-personalized-plan";
import { profileSchema, type ProfileSchema } from "@/lib/zod-schemas";

export async function generateAndSavePlan(values: ProfileSchema) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to generate a plan." };
  }

  const validatedFields = profileSchema.safeParse(values);
  if (!validatedFields.success) {
    const firstErrorMessage = validatedFields.error.errors[0]?.message;
    return { error: firstErrorMessage || "Invalid profile data." };
  }

  // 1. Generate plan from AI
  let planData: GeneratePersonalizedPlanOutput;
  try {
    planData = await generatePersonalizedPlan(validatedFields.data);
  } catch (e: any) {
    console.error("AI error:", e);
    if (e.message?.includes("The AI model did not return a valid plan")) {
      return {
        error:
          "The AI was unable to generate a plan for the provided details. This can sometimes happen due to safety filters. Please try adjusting your inputs.",
      };
    }
    return {
      error: "Failed to generate a plan from AI. Please try again later.",
    };
  }

  // 2. Save profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    age: validatedFields.data.age,
    height: validatedFields.data.height,
    weight: validatedFields.data.weight,
    gender: validatedFields.data.gender,
    activity_level: validatedFields.data.activityLevel,
    fitness_goals: validatedFields.data.fitnessGoals,
    dietary_preferences: validatedFields.data.dietaryPreferences,
    preferred_cuisine: validatedFields.data.preferredCuisine,
    medical_conditions: validatedFields.data.medicalConditions,
    allergies: validatedFields.data.allergies,
  });

  if (profileError) {
    console.error("Profile upsert error:", profileError);
    if (profileError.code === "42501") {
      return {
        error:
          'Failed to save profile due to a permission issue. Please check your database Row Level Security policies for the "profiles" table to allow inserts and updates for authenticated users.',
      };
    }
    return { error: `Failed to save your profile: ${profileError.message}` };
  }

  // 3. Save plan
  const { data: newPlan, error: planError } = await supabase
    .from("plans")
    .insert({
      user_id: user.id,
      diet_plan: planData.dietPlan,
      workout_plan: planData.workoutPlan,
      health_tips: planData.healthTips,
      generation_details: validatedFields.data,
    })
    .select("id")
    .single();

  if (planError) {
    console.error("Supabase plan insertion error:", planError);
    if (planError.code === "42501") {
      return {
        error:
          'Failed to save plan due to a permission issue. Please check your database Row Level Security policies for the "plans" table to allow inserts for authenticated users.',
      };
    }
    return { error: `Failed to save your plan: ${planError.message}` };
  }

  // 4. Redirect to the new plan page
  revalidatePath("/dashboard/history");
  redirect(`/dashboard/plan/${newPlan.id}?new=true`);
}
