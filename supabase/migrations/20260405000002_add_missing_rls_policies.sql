-- Migration: Add Missing RLS Policies
-- Created: 2026-04-05

-- 1. MEAL PLANS Policies
CREATE POLICY "Users can insert their own meal plans" ON public.meal_plans
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own meal plans" ON public.meal_plans
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- 2. PLAN DAYS Policies
CREATE POLICY "Users can insert days for their own plans" ON public.plan_days
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE public.meal_plans.id = public.plan_days.meal_plan_id
            AND public.meal_plans.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can update days for their own plans" ON public.plan_days
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE public.meal_plans.id = public.plan_days.meal_plan_id
            AND public.meal_plans.user_id = (auth.jwt() ->> 'sub')
        )
    );

-- 3. MEALS Policies
CREATE POLICY "Users can insert meals for their own plans" ON public.meals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.plan_days
            JOIN public.meal_plans ON public.meal_plans.id = public.plan_days.meal_plan_id
            WHERE public.plan_days.id = public.meals.plan_day_id
            AND public.meal_plans.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can update meals for their own plans" ON public.meals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.plan_days
            JOIN public.meal_plans ON public.meal_plans.id = public.plan_days.meal_plan_id
            WHERE public.plan_days.id = public.meals.plan_day_id
            AND public.meal_plans.user_id = (auth.jwt() ->> 'sub')
        )
    );
