-- Migration: Add Shopping List Table
-- Created: 2026-04-05

-- 6. SHOPPING LIST Table
CREATE TABLE IF NOT EXISTS public.shopping_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping List Policies
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shopping list" ON public.shopping_list
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own shopping list" ON public.shopping_list
    FOR ALL USING (auth.jwt() ->> 'sub' = user_id);
