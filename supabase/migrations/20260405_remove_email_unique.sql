-- Migration: Remove UNIQUE constraint from email in profiles table
--
-- This allows users who have deleted and recreated their Clerk account 
-- (receiving a new user_id with the same email) to still have a profile 
-- created in Supabase without causing a duplicate key error.
-- user_id (Clerk ID) remains the primary unique identifier for all data.

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_key;
