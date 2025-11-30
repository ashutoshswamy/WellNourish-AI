import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { GeneratedPlan, PlanType } from '@/types/database.types';

// Validation schema for save plan request
const savePlanSchema = z.object({
  plan_id: z.string().uuid().optional(),
  plan_data: z.object({
    success: z.boolean(),
    plan_id: z.string().optional(),
    summary: z.string(),
    daily_calories: z.number(),
    meal_plan: z.any(),
    workout_plan: z.any(),
    warnings: z.array(z.string()),
    confidence_score: z.number(),
    metadata: z.object({
      created_at: z.string(),
      plan_type: z.string(),
      duration_days: z.number(),
      tokens_used: z.number().nullable(),
    }).optional(),
  }),
  is_favorite: z.boolean().optional().default(true),
  plan_name: z.string().min(1).max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
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

    const validationResult = savePlanSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { plan_id, plan_data, is_favorite, plan_name } = validationResult.data;

    // If plan_id is provided, update the existing plan
    if (plan_id) {
      // First verify the plan belongs to the user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingPlan, error: fetchError } = await (supabase as any)
        .from('generated_plans')
        .select('id, user_id')
        .eq('id', plan_id)
        .single();

      if (fetchError || !existingPlan) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        );
      }

      if (existingPlan.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized to update this plan' },
          { status: 403 }
        );
      }

      // Update the plan
      const updateData = {
        is_favorite: is_favorite ?? true,
        updated_at: new Date().toISOString(),
        ...(plan_name && { plan_name }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('generated_plans')
        .update(updateData)
        .eq('id', plan_id);

      if (updateError) {
        console.error('Error updating plan:', updateError);
        return NextResponse.json(
          { error: 'Failed to update plan' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Plan updated successfully',
        plan_id: plan_id,
      });
    }

    // No plan_id provided - create a new plan
    const metadata = plan_data.metadata;
    
    // Extract macros from the first day if available
    const firstDay = plan_data.meal_plan?.days?.[0];
    
    const newPlan = {
      user_id: user.id,
      plan_name: plan_name || `My Plan - ${new Date().toLocaleDateString()}`,
      plan_type: (metadata?.plan_type as PlanType) || 'combined',
      duration_days: metadata?.duration_days || 7,
      meal_plan: plan_data.meal_plan,
      workout_plan: plan_data.workout_plan,
      daily_calories: plan_data.daily_calories,
      daily_protein_g: firstDay?.total_protein_g || null,
      daily_carbs_g: firstDay?.total_carbs_g || null,
      daily_fats_g: firstDay?.total_fats_g || null,
      is_active: true,
      is_favorite: is_favorite ?? true,
      completion_percentage: 0,
      ai_model_used: 'gemini-pro',
      generation_prompt: null,
      generation_tokens: metadata?.tokens_used || null,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(
        Date.now() + (metadata?.duration_days || 7) * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
    };

    // Deactivate any existing active plans for this user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('generated_plans')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Insert the new plan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: insertedPlan, error: insertError } = await (supabase as any)
      .from('generated_plans')
      .insert(newPlan)
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting plan:', insertError);
      return NextResponse.json(
        { error: 'Failed to save plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Plan saved successfully',
      plan_id: insertedPlan.id,
    });
  } catch (error) {
    console.error('Unexpected error in save-plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to retrieve saved plans
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const onlyFavorites = searchParams.get('favorites') === 'true';
    const onlyActive = searchParams.get('active') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let query = supabase
      .from('generated_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (onlyFavorites) {
      query = query.eq('is_favorite', true);
    }

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data: plans, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching plans:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plans: plans || [],
      count: plans?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error in get plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
