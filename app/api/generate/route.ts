import { NextResponse } from "next/server";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Schema } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const mealTypes = ["breakfast", "lunch", "dinner", "snacks"] as const;

const generatedMealSchema = z.object({
  type: z.enum(mealTypes),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  calories: z.number().int().positive(),
  protein: z.string().trim().min(1),
  carbs: z.string().trim().min(1),
  fat: z.string().trim().min(1),
  ingredients: z.array(z.string().trim().min(1)).min(1),
  instructions: z.string().trim().min(1),
});

const generatedDaySchema = z
  .object({
    day_number: z.number().int().min(1).max(7),
    total_calories: z.number().int().positive(),
    meals: z.array(generatedMealSchema).length(4),
  })
  .superRefine((day, ctx) => {
    const seenTypes = new Set(day.meals.map((meal) => meal.type));

    if (seenTypes.size !== mealTypes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Day ${day.day_number} must include exactly one breakfast, lunch, dinner, and snacks meal.`,
      });
    }

    for (const mealType of mealTypes) {
      if (!seenTypes.has(mealType)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Day ${day.day_number} is missing the ${mealType} meal.`,
        });
      }
    }
  });

const generatedPlanSchema = z.object({
  days: z.array(generatedDaySchema).length(7),
});

type GeneratedPlan = z.infer<typeof generatedPlanSchema>;

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
  created_at: FirebaseFirestore.FieldValue;
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    days: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day_number: { type: SchemaType.INTEGER, format: "int32" },
          total_calories: { type: SchemaType.INTEGER, format: "int32" },
          meals: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                type: {
                  type: SchemaType.STRING,
                  format: "enum",
                  enum: [...mealTypes],
                },
                name: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                calories: { type: SchemaType.INTEGER, format: "int32" },
                protein: { type: SchemaType.STRING },
                carbs: { type: SchemaType.STRING },
                fat: { type: SchemaType.STRING },
                ingredients: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
                instructions: { type: SchemaType.STRING },
              },
              required: [
                "type",
                "name",
                "description",
                "calories",
                "protein",
                "carbs",
                "fat",
                "ingredients",
                "instructions",
              ],
            },
          },
        },
        required: ["day_number", "total_calories", "meals"],
      },
    },
  },
  required: ["days"],
} as const as unknown as Schema;

// Helper to sanitize text for LLM prompt
function sanitizeForPrompt(text: string | null | undefined): string {
  if (!text) return "None";
  // Remove potential control characters and excessive whitespace
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    .trim()
    .slice(0, 500);
}

async function generatePlanText(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 65536,
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST() {
  try {
    const user = await getServerUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    const userId = user.uid;

    // 1. Rate Limiting Check (Simple version: 1 plan per hour)
    const recentPlansSnap = await adminDb
      .collection("mealPlans")
      .where("user_id", "==", userId)
      .orderBy("created_at", "desc")
      .limit(1)
      .get();

    if (!recentPlansSnap.empty) {
      const lastCreated = recentPlansSnap.docs[0].data().created_at?.toDate?.() ?? new Date(0);
      const now = new Date();
      const diffMs = now.getTime() - lastCreated.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) {
        return new NextResponse(
          JSON.stringify({
            error: "Rate limit exceeded",
            message: `Please wait ${60 - diffMins} more minutes before generating a new plan.`,
          }),
          { status: 429 },
        );
      }
    }

    // 2. Fetch User Metrics for Personalization
    const metricsSnap = await adminDb.collection("userMetrics").doc(userId).get();
    const metrics = metricsSnap.data();

    if (!metrics) {
      return new NextResponse(
        "User metrics not found. Please setup your profile.",
        { status: 404 },
      );
    }

    // 3. Archive previous active plans for this user
    const activePlansSnap = await adminDb
      .collection("mealPlans")
      .where("user_id", "==", userId)
      .where("status", "==", "active")
      .get();

    if (!activePlansSnap.empty) {
      const archiveBatch = adminDb.batch();
      activePlansSnap.forEach((doc) => archiveBatch.update(doc.ref, { status: "archived" }));
      await archiveBatch.commit();
    }

    const calorieTarget = metrics.daily_calorie_target;
    if (!calorieTarget) {
      return new NextResponse(
        "Daily calorie target is missing. Please update your profile.",
        { status: 400 },
      );
    }

    const sanitizedDiet = sanitizeForPrompt(metrics.diet_preferences);
    const sanitizedAllergies = sanitizeForPrompt(metrics.allergies);
    const sanitizedCuisines = sanitizeForPrompt(metrics.cuisine_preferences);

    const prompt = `
      You are an expert nutritionist.
      Create a hyper-personalized 7-day meal plan for the following user.

      Hard requirements:
      - Return exactly 7 days.
      - Each day must include exactly 4 meals: breakfast, lunch, dinner, and snacks.
      - Keep each day's total calories within 10 percent of the target.
      - Use real, ordinary foods that can actually be prepared.
      - Keep ingredients aligned with the user's diet, allergies, and cuisine preferences.
      - Do not repeat the same meal name across multiple days.
      - Avoid ingredients that conflict with allergies.

      User profile:
      - Age: ${metrics.age}
      - Gender: ${metrics.gender}
      - Weight: ${metrics.weight_kg}kg
      - Height: ${metrics.height_cm}cm
      - Activity: ${metrics.activity_level}
      - Goal: ${metrics.health_goal} (${metrics.weekly_goal}/week)
      - Diet: ${sanitizedDiet}
      - Allergies: ${sanitizedAllergies}
      - Cuisines: ${sanitizedCuisines}
      - Calorie Target: ${calorieTarget} kcal/day

      Calorie split target per day:
      - breakfast: 25 percent
      - lunch: 30 percent
      - dinner: 30 percent
      - snacks: 15 percent

      Return only JSON matching the schema.
    `;

    const responseText = await generatePlanText(prompt);
    let planData: GeneratedPlan;

    try {
      planData = generatedPlanSchema.parse(JSON.parse(responseText));
    } catch {
      try {
        const start = responseText.indexOf("{");
        const end = responseText.lastIndexOf("}");
        const cleanedJson =
          start !== -1 && end !== -1 && end > start
            ? responseText.substring(start, end + 1)
            : responseText;
        planData = generatedPlanSchema.parse(JSON.parse(cleanedJson));
      } catch {
        console.error(
          "Failed to parse Gemini JSON. Raw response:",
          responseText,
        );
        return new NextResponse(
          JSON.stringify({
            error: "AI_FORMAT_ERROR",
            message:
              "The AI returned an invalid response format. Please try again.",
            raw: responseText.slice(0, 500),
          }),
          { status: 500 },
        );
      }
    }

    const dayNumbers = new Set(planData.days.map((day) => day.day_number));
    if (
      dayNumbers.size !== 7 ||
      ![1, 2, 3, 4, 5, 6, 7].every((dayNumber) => dayNumbers.has(dayNumber))
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "AI_VALIDATION_ERROR",
          message:
            "The AI returned an incomplete 7-day plan. Please try again.",
        }),
        { status: 500 },
      );
    }

    const calorieTolerance = Math.max(150, Math.round(calorieTarget * 0.1));
    const normalizedDays = [] as GeneratedPlan["days"];

    for (const day of planData.days) {
      const meals = day.meals.map((meal) => ({
        type: meal.type,
        name: meal.name.trim(),
        description: meal.description.trim(),
        calories: meal.calories,
        protein: meal.protein.trim(),
        carbs: meal.carbs.trim(),
        fat: meal.fat.trim(),
        ingredients: meal.ingredients
          .map((ingredient) => ingredient.trim())
          .filter(Boolean),
        instructions: meal.instructions.trim(),
      }));

      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

      if (Math.abs(totalCalories - calorieTarget) > calorieTolerance) {
        return new NextResponse(
          JSON.stringify({
            error: "AI_VALIDATION_ERROR",
            message: `Day ${day.day_number} is too far from the calorie target.`,
          }),
          { status: 500 },
        );
      }

      normalizedDays.push({
        day_number: day.day_number,
        total_calories: totalCalories,
        meals,
      });
    }

    normalizedDays.sort((left, right) => left.day_number - right.day_number);

    if (!normalizedDays.every((day, index) => day.day_number === index + 1)) {
      return new NextResponse(
        JSON.stringify({
          error: "AI_VALIDATION_ERROR",
          message:
            "The AI returned days out of order or with duplicates. Please try again.",
        }),
        { status: 500 },
      );
    }

    planData = { days: normalizedDays };

    // 5. Persistence into Firestore
    const planRef = adminDb.collection("mealPlans").doc();
    await planRef.set({
      user_id: userId,
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
      created_at: FieldValue.serverTimestamp(),
    });

    // Write each day (with its meals embedded) and collect shopping list items
    const shoppingListItems: ShoppingListItem[] = [];
    const daysBatch = adminDb.batch();

    for (const day of planData.days) {
      const meals = day.meals.map((m: GeneratedMeal) => ({
        meal_type: m.type,
        name: m.name,
        description: m.description,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        ingredients: m.ingredients,
        instructions: m.instructions,
      }));

      const dayRef = planRef.collection("days").doc();
      daysBatch.set(dayRef, {
        day_number: day.day_number,
        total_calories: day.total_calories,
        meals,
      });

      day.meals.forEach((m: GeneratedMeal) => {
        m.ingredients.forEach((ing: string) => {
          shoppingListItems.push({
            user_id: userId,
            plan_id: planRef.id,
            item_name: ing,
            is_checked: false,
            created_at: FieldValue.serverTimestamp(),
          });
        });
      });
    }

    try {
      await daysBatch.commit();
    } catch (dayError) {
      console.error("Error saving plan days:", dayError);
      return new NextResponse("Failed to save meal plan data", { status: 500 });
    }

    if (shoppingListItems.length > 0) {
      // Firestore batches cap at 500 writes; chunk to stay safely under that
      const chunkSize = 400;
      for (let i = 0; i < shoppingListItems.length; i += chunkSize) {
        const chunk = shoppingListItems.slice(i, i + chunkSize);
        const shoppingBatch = adminDb.batch();
        chunk.forEach((item) => {
          shoppingBatch.set(adminDb.collection("shoppingList").doc(), item);
        });
        await shoppingBatch.commit();
      }
    }

    return NextResponse.json({ success: true, planId: planRef.id });
  } catch (error) {
    console.error("Generation pipeline failed:", error);
    return new NextResponse("Internal server error during generation", {
      status: 500,
    });
  }
}
