import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { buildPrompt, type UserData } from '@/utils/buildPrompt';
import { parseGeminiResponse, GeminiParseError } from '@/utils/parseGeminiResponse';
import type { GeneratedPlanInsert, PlanType } from '@/types/database.types';

// Validation schema for the incoming request
const generatePlanSchema = z.object({
  // Basic info
  age: z.number().min(13).max(120),
  height_cm: z.number().min(50).max(300),
  weight_kg: z.number().min(20).max(500),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),

  // Preferences
  dietary_preferences: z.array(z.string()).default([]),
  cuisine_preferences: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),

  // Goals
  goal: z.enum([
    'weight_loss',
    'muscle_gain',
    'maintenance',
    'athletic_performance',
    'general_health',
  ]),
  activity_level: z.enum([
    'sedentary',
    'light',
    'lightly_active',
    'moderate',
    'moderately_active',
    'active',
    'very_active',
    'extremely_active',
  ]),

  // Optional preferences
  target_weight_kg: z.number().min(20).max(500).optional(),
  meals_per_day: z.number().min(1).max(6).optional(),
  snacks_per_day: z.number().min(0).max(4).optional(),
  workouts_per_week: z.number().min(0).max(7).optional(),
  workout_duration_minutes: z.number().min(10).max(180).optional(),
  fitness_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  cooking_time_preference: z.enum(['quick', 'moderate', 'elaborate']).optional(),
  budget_level: z.enum(['budget', 'moderate', 'premium']).optional(),

  // Plan options
  plan_name: z.string().min(1).max(100).optional(),
  duration_days: z.number().min(1).max(30).default(7),
});

type GeneratePlanInput = z.infer<typeof generatePlanSchema>;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Supabase client and verify authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validationResult = generatePlanSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input: GeneratePlanInput = validationResult.data;

    // Build the prompt for Gemini
    const userData: UserData = {
      age: input.age,
      height_cm: input.height_cm,
      weight_kg: input.weight_kg,
      gender: input.gender,
      dietary_preferences: input.dietary_preferences,
      cuisine_preferences: input.cuisine_preferences,
      allergies: input.allergies,
      goal: input.goal,
      activity_level: input.activity_level,
      target_weight_kg: input.target_weight_kg,
      meals_per_day: input.meals_per_day,
      snacks_per_day: input.snacks_per_day,
      workouts_per_week: input.workouts_per_week,
      workout_duration_minutes: input.workout_duration_minutes,
      fitness_level: input.fitness_level,
      cooking_time_preference: input.cooking_time_preference,
      budget_level: input.budget_level,
    };

    const prompt = buildPrompt(userData);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 65536,
        responseMimeType: 'application/json',
      },
    });

    // Generate the plan
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Track token usage if available
    const usageMetadata = response.usageMetadata;
    const totalTokens = usageMetadata?.totalTokenCount;

    // Parse and validate the response
    let parsedPlan;
    try {
      parsedPlan = parseGeminiResponse(responseText);
    } catch (error) {
      if (error instanceof GeminiParseError) {
        console.error('Failed to parse Gemini response:', error.message);
        console.error('Raw response (first 2000 chars):', responseText?.slice(0, 2000));
        return NextResponse.json(
          { 
            error: 'Failed to parse AI response. Please try again.',
            details: error.message,
            rawPreview: responseText?.slice(0, 500),
          },
          { status: 500 }
        );
      }
      console.error('Unexpected error parsing response:', error);
      throw error;
    }

    // Calculate daily macros from the first day's meals
    const firstDay = parsedPlan.meal_plan.days[0];
    const dailyProtein = firstDay?.total_protein_g || 0;
    const dailyCarbs = firstDay?.total_carbs_g || 0;
    const dailyFats = firstDay?.total_fats_g || 0;

    // Determine plan type
    const hasMeals = parsedPlan.meal_plan.days.length > 0;
    const hasWorkouts = parsedPlan.workout_plan.weeks.length > 0;
    const planType = hasMeals && hasWorkouts ? 'combined' : hasMeals ? 'meal' : 'workout';

    // Store the plan in Supabase
    const planData: GeneratedPlanInsert = {
      user_id: user.id,
      plan_name: input.plan_name || `Wellness Plan - ${new Date().toLocaleDateString()}`,
      plan_type: planType as PlanType,
      duration_days: input.duration_days,
      goal: input.goal,
      meal_plan: parsedPlan.meal_plan,
      workout_plan: parsedPlan.workout_plan,
      daily_calories: parsedPlan.daily_calories,
      daily_protein_g: dailyProtein,
      daily_carbs_g: dailyCarbs,
      daily_fats_g: dailyFats,
      is_active: true,
      is_favorite: false,
      completion_percentage: 0,
      ai_model_used: modelName,
      generation_prompt: prompt,
      generation_tokens: totalTokens || null,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + input.duration_days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: savedPlan, error: insertError } = await (supabase as any)
      .from('generated_plans')
      .insert(planData)
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save plan:', insertError);
      return NextResponse.json(
        { error: 'Failed to save plan to database' },
        { status: 500 }
      );
    }

    // Return the parsed plan with metadata
    return NextResponse.json({
      success: true,
      plan_id: savedPlan.id,
      summary: parsedPlan.summary,
      daily_calories: parsedPlan.daily_calories,
      meal_plan: parsedPlan.meal_plan,
      workout_plan: parsedPlan.workout_plan,
      warnings: parsedPlan.warnings,
      confidence_score: parsedPlan.confidence_score,
      metadata: {
        created_at: savedPlan.created_at,
        plan_type: planType,
        duration_days: input.duration_days,
        tokens_used: totalTokens,
        goal: input.goal,
      },
    });
  } catch (error) {
    console.error('Error generating plan:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('rate')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
