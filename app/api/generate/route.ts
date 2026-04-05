import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GeneratedMeal {
  type: string;
  name: string;
  description: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  instructions: string;
}

interface ShoppingListItem {
  user_id: string;
  plan_id: string;
  item_name: string;
  is_checked: boolean;
}

// Helper to sanitize text for LLM prompt
function sanitizeForPrompt(text: string | null | undefined): string {
  if (!text) return "None";
  // Remove potential control characters and excessive whitespace
  return text.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim().slice(0, 500);
}

export async function POST() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const supabaseAccessToken = await getToken({ template: "supabase" });
    if (!supabaseAccessToken) {
      return new NextResponse("Failed to synchronize authentication", { status: 500 });
    }
    const supabase = await createAuthenticatedClient(supabaseAccessToken);

    // 1. Rate Limiting Check (Simple version: 1 plan per hour)
    const { data: recentPlans, error: recentError } = await supabase
      .from("meal_plans")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentError) {
      console.error("Rate limit check error:", recentError);
    } else if (recentPlans && recentPlans.length > 0) {
      const lastCreated = new Date(recentPlans[0].created_at);
      const now = new Date();
      const diffMs = now.getTime() - lastCreated.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) {
        return new NextResponse(JSON.stringify({ 
          error: "Rate limit exceeded", 
          message: `Please wait ${60 - diffMins} more minutes before generating a new plan.` 
        }), { status: 429 });
      }
    }

    // 2. Fetch User Metrics for Personalization
    const { data: metrics, error: metricsError } = await supabase
      .from("user_metrics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (metricsError || !metrics) {
      return new NextResponse("User metrics not found. Please setup your profile.", { status: 404 });
    }

    // 3. Archive previous active plans for this user
    await supabase
      .from("meal_plans")
      .update({ status: 'archived' })
      .eq("user_id", userId)
      .eq("status", "active");

    // 4. AI Generation setup
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite-preview", 
      generationConfig: { 
        responseMimeType: "application/json",
      } 
    });

    const sanitizedDiet = sanitizeForPrompt(metrics.diet_preferences);
    const sanitizedAllergies = sanitizeForPrompt(metrics.allergies);
    const sanitizedCuisines = sanitizeForPrompt(metrics.cuisine_preferences);

    const prompt = `
      You are an expert nutritionist and world-class researcher.
      Create a hyper-personalized 7-day meal plan for the following user:
      - Age: ${metrics.age}
      - Gender: ${metrics.gender}
      - Weight: ${metrics.weight_kg}kg
      - Height: ${metrics.height_cm}cm
      - Activity: ${metrics.activity_level}
      - Goal: ${metrics.health_goal} (${metrics.weekly_goal}/week)
      - Diet: ${sanitizedDiet}
      - Allergies: ${sanitizedAllergies}
      - Cuisines: ${sanitizedCuisines}
      - Calorie Target: ${metrics.daily_calorie_target} kcal/day

      IMPORTANT: You MUST return ONLY a JSON object. Do not include any text before, after, or around the JSON. Do not wrap the JSON in markdown code blocks.
      
      The JSON object must have exactly one top-level key "days" which is an array of 7 objects.
      Each day object must have:
      - "day_number": integer (1-7)
      - "total_calories": integer
      - "meals": an array of meal objects:
        - "type": one of ["breakfast", "lunch", "dinner", "snacks"]
        - "name": string
        - "description": string
        - "calories": integer
        - "protein": string (e.g. "30g")
        - "carbs": string (e.g. "45g")
        - "fat": string (e.g. "15g")
        - "ingredients": array of strings
        - "instructions": string

      Ensure the plan is realistic, nutritionally balanced, and strictly follows the caloric target.
    `;

    const result = await model.generateContent(prompt);
    
    // Helper to extract JSON from a string that might contain markdown blocks
    function extractJSON(text: string) {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        return text.substring(start, end + 1);
      }
      return text;
    }

    const responseText = result.response.text();
    let planData;

    try {
      const cleanedJson = extractJSON(responseText);
      planData = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Failed to parse Gemini JSON. Raw response:", responseText);
      return new NextResponse(JSON.stringify({ 
        error: "AI_FORMAT_ERROR", 
        message: "The AI returned an invalid response format. Please try again.",
        raw: responseText.slice(0, 500)
      }), { status: 500 });
    }

    // 5. Persistence into Normalized Tables
    const { data: newPlan, error: planError } = await supabase
      .from("meal_plans")
      .insert({
        user_id: userId,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (planError || !newPlan) {
      console.error("Plan creation error:", planError);
      return new NextResponse("Failed to initialize meal plan", { status: 500 });
    }

    // Insert Days and Meals
    const shoppingListItems: ShoppingListItem[] = [];

    for (const day of planData.days) {
      const { data: insertedDay, error: dayError } = await supabase
        .from("plan_days")
        .insert({
          meal_plan_id: newPlan.id,
          day_number: day.day_number,
          total_calories: day.total_calories
        })
        .select()
        .single();

      if (dayError || !insertedDay) {
        console.error(`Error inserting day ${day.day_number}:`, dayError);
        return new NextResponse(`Failed to save meal plan data (Day ${day.day_number})`, { status: 500 });
      }

      const mealsToInsert = day.meals.map((m: GeneratedMeal) => ({
        plan_day_id: insertedDay.id,
        meal_type: m.type,
        name: m.name,
        description: m.description,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        ingredients: m.ingredients,
        instructions: m.instructions
      }));

      const { error: mealsError } = await supabase.from("meals").insert(mealsToInsert);
      if (mealsError) {
        console.error("Meals insert error:", mealsError);
        return new NextResponse("Failed to save meals for the plan", { status: 500 });
      }

      day.meals.forEach((m: GeneratedMeal) => {
        m.ingredients.forEach((ing: string) => {
          shoppingListItems.push({
            user_id: userId,
            plan_id: newPlan.id,
            item_name: ing,
            is_checked: false
          });
        });
      });
    }

    if (shoppingListItems.length > 0) {
      // Chunk inserts for shopping list to avoid limit issues
      const chunkSize = 50;
      for (let i = 0; i < shoppingListItems.length; i += chunkSize) {
        await supabase.from("shopping_list").insert(shoppingListItems.slice(i, i + chunkSize));
      }
    }

    return NextResponse.json({ success: true, planId: newPlan.id });

  } catch (error) {
    console.error("Generation pipeline failed:", error);
    return new NextResponse("Internal server error during generation", { status: 500 });
  }
}

