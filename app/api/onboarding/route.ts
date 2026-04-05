import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import { z } from "zod";

const onboardingSchema = z.object({
  age: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().int().min(1, "Must be at least 1")),
  gender: z.enum(["Male", "Female", "Other"]),
  weight_kg: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().positive("Must be greater than 0")),
  height_cm: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().positive("Must be greater than 0")),
  target_weight: z.preprocess((val) => (val === "" || val === undefined ? null : Number(val)), z.number().positive("Must be greater than 0").nullable().optional()),
  activity_level: z.enum(["Sedentary", "Light", "Moderate", "Active", "Very Active"]),
  health_goal: z.enum(["Lose Weight", "Maintain", "Gain Muscle"]),
  weekly_goal: z.enum(["0.25kg", "0.5kg", "1kg", "Maintain"]),
  cuisine_preferences: z.string().optional().nullable(),
  diet_preferences: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  injuries: z.string().optional().nullable(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

function calculateDailyCalories(data: OnboardingData) {
  const { age, gender, weight_kg: weight, height_cm: height, activity_level: activityLevel, health_goal: healthGoal, weekly_goal: weeklyGoal } = data;

  // Mifflin-St Jeor Equation
  let bmr = (10 * (weight || 0)) + (6.25 * (height || 0)) - (5 * (age || 0));
  if (gender === "Male") bmr += 5;
  else bmr -= 161;

  const multipliers: Record<string, number> = {
    "Sedentary": 1.2,
    "Light": 1.375,
    "Moderate": 1.55,
    "Active": 1.725,
    "Very Active": 1.9,
  };

  let tdee = bmr * (multipliers[activityLevel] || 1.2);

  // Adjust for goals
  if (healthGoal === "Lose Weight") {
    if (weeklyGoal === "0.25kg") tdee -= 250;
    else if (weeklyGoal === "0.5kg") tdee -= 500;
    else if (weeklyGoal === "1kg") tdee -= 1000;
  } else if (healthGoal === "Gain Muscle") {
    tdee += 250; // Lean bulk
  }

  const result = Math.round(tdee);
  return isNaN(result) || result <= 0 ? null : result;
}

export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", message: "You must be signed in to complete onboarding." }, { status: 401 });
    }

    const rawData = await req.json();
    const validation = onboardingSchema.safeParse(rawData);

    if (!validation.success) {
      console.error("Onboarding Validation Error:", validation.error.flatten());
      return new NextResponse(JSON.stringify({
        error: "Invalid data",
        details: validation.error.flatten()
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = validation.data;
    const supabaseAccessToken = await getToken({ template: "supabase" });

    if (!supabaseAccessToken) {
      console.error("Missing Clerk-Supabase JWT Template ('supabase')");
      return new NextResponse(JSON.stringify({
        error: "Auth Sync Failed",
        message: "Missing 'supabase' JWT Template in Clerk Dashboard. Please add it to enable database operations."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabase = await createAuthenticatedClient(supabaseAccessToken);
    const daily_calorie_target = calculateDailyCalories(data);

    const payload = {
      user_id: userId,
      age: data.age,
      gender: data.gender,
      weight_kg: data.weight_kg,
      height_cm: data.height_cm,
      target_weight: data.target_weight || null,
      activity_level: data.activity_level,
      health_goal: data.health_goal,
      weekly_goal: data.weekly_goal,
      daily_calorie_target,
      cuisine_preferences: data.cuisine_preferences || null,
      diet_preferences: data.diet_preferences || null,
      allergies: data.allergies || null,
      injuries: data.injuries || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_metrics')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error("Supabase Error (user_metrics):", error);
      return new NextResponse(JSON.stringify({
        error: "Database operation failed",
        message: error.message,
        code: error.code
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }


    // Update weight log for trend tracking
    const { error: weightLogError } = await supabase.from('weight_logs').upsert({
      user_id: userId,
      weight: data.weight_kg,
      logged_at: new Date().toISOString().split('T')[0]
    }, { onConflict: 'user_id,logged_at' });

    if (weightLogError) {
      console.warn("Weight Log Warning (non-fatal):", weightLogError);
    }

    return NextResponse.json({ success: true, daily_calorie_target });
  } catch (err) {
    console.error("Onboarding pipeline failed:", err);
    return NextResponse.json({ error: "Internal server error", message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

