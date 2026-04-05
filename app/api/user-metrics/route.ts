import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import { z } from "zod";

const userMetricsSchema = z.object({
  age: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().int().min(1, "Must be at least 1")
  ),
  gender: z.enum(["Male", "Female", "Other"]),
  weight_kg: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().positive("Must be greater than 0")
  ),
  height_cm: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().positive("Must be greater than 0")
  ),
  target_weight: z.preprocess(
    (val) => (val === "" || val === undefined ? null : Number(val)),
    z.number().positive("Must be greater than 0").nullable().optional()
  ),
  activity_level: z.enum([
    "Sedentary",
    "Light",
    "Moderate",
    "Active",
    "Very Active",
  ]),
  health_goal: z.enum(["Lose Weight", "Maintain", "Gain Muscle"]),
  weekly_goal: z.enum(["0.25kg", "0.5kg", "1kg", "Maintain"]),
  cuisine_preferences: z.string().optional().nullable(),
  diet_preferences: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  injuries: z.string().optional().nullable(),
});

type UserMetricsData = z.infer<typeof userMetricsSchema>;

function calculateDailyCalories(data: UserMetricsData) {
  const {
    age,
    gender,
    weight_kg: weight,
    height_cm: height,
    activity_level: activityLevel,
    health_goal: healthGoal,
    weekly_goal: weeklyGoal,
  } = data;

  // Mifflin-St Jeor Equation
  let bmr = 10 * (weight || 0) + 6.25 * (height || 0) - 5 * (age || 0);
  if (gender === "Male") bmr += 5;
  else bmr -= 161;

  const multipliers: Record<string, number> = {
    Sedentary: 1.2,
    Light: 1.375,
    Moderate: 1.55,
    Active: 1.725,
    "Very Active": 1.9,
  };

  let tdee = bmr * (multipliers[activityLevel] || 1.2);

  if (healthGoal === "Lose Weight") {
    if (weeklyGoal === "0.25kg") tdee -= 250;
    else if (weeklyGoal === "0.5kg") tdee -= 500;
    else if (weeklyGoal === "1kg") tdee -= 1000;
  } else if (healthGoal === "Gain Muscle") {
    tdee += 250;
  }

  const result = Math.round(tdee);
  return isNaN(result) || result <= 0 ? null : result;
}

export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be signed in." },
        { status: 401 }
      );
    }

    const rawData = await req.json();
    const validation = userMetricsSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          message: "Please check your inputs and try again.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const supabaseAccessToken = await getToken({ template: "supabase" });

    if (!supabaseAccessToken) {
      return NextResponse.json(
        {
          error: "Auth sync failed",
          message:
            "Could not connect to the database. Please ensure the Supabase JWT template is configured in Clerk.",
        },
        { status: 500 }
      );
    }

    const supabase = await createAuthenticatedClient(supabaseAccessToken);

    // Ensure a profiles row exists before writing to user_metrics (FK dependency)
    const user = await currentUser();
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        email: user?.emailAddresses?.[0]?.emailAddress ?? null,
        full_name:
          [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null,
        avatar_url: user?.imageUrl ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      return NextResponse.json(
        {
          error: "Profile synchronization failed",
          message: profileError.message || "Failed to create or update your profile in the database.",
          details: profileError.code === "23505" ? "This email may already be linked to another account." : null,
        },
        { status: 500 }
      );
    }

    // Save user metrics
    const daily_calorie_target = calculateDailyCalories(data);

    const { error: metricsError } = await supabase
      .from("user_metrics")
      .upsert(
        {
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
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (metricsError) {
      console.error("Metrics upsert error:", metricsError);
      return NextResponse.json(
        {
          error: "Failed to save metrics",
          message: metricsError.message,
        },
        { status: 500 }
      );
    }

    // Log weight for trend tracking (non-blocking)
    const { error: weightLogError } = await supabase
      .from("weight_logs")
      .upsert(
        {
          user_id: userId,
          weight: data.weight_kg,
          logged_at: new Date().toISOString().split("T")[0],
        },
        { onConflict: "user_id,logged_at" }
      );

    if (weightLogError) {
      console.warn("Weight log warning (non-fatal):", weightLogError);
    }

    return NextResponse.json({ success: true, daily_calorie_target });
  } catch (err) {
    console.error("User metrics pipeline failed:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
