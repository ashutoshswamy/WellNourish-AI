-- Migration: Add missing columns to meals table
-- Created: 2026-04-06

ALTER TABLE public.meals 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS ingredients TEXT[],
ADD COLUMN IF NOT EXISTS instructions TEXT;
