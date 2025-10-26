/**
 * Database utility functions for WellNourish AI
 */

import { createClient } from "@/lib/supabase/client";
import type { SavedPlan, InsertSavedPlan } from "@/lib/schema";

/**
 * Save a new plan to the database
 */
export async function savePlan(planData: InsertSavedPlan) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_plans")
    .insert(planData)
    .select()
    .single();

  if (error) {
    console.error("Error saving plan:", error);
    throw error;
  }

  return data as SavedPlan;
}

/**
 * Load all saved plans for a user
 */
export async function loadUserPlans(userId: string, limit = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error loading plans:", error);
    throw error;
  }

  return data as SavedPlan[];
}

/**
 * Get a specific saved plan by ID
 */
export async function getPlanById(planId: string, userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_plans")
    .select("*")
    .eq("id", planId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching plan:", error);
    throw error;
  }

  return data as SavedPlan;
}

/**
 * Delete a saved plan
 */
export async function deletePlan(planId: string, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("saved_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }

  return true;
}

/**
 * Check if the saved_plans table exists and is accessible
 */
export async function checkDatabaseSetup() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("saved_plans")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Database setup issue:", error);
      return {
        success: false,
        error: error.message,
        hint: "The saved_plans table may not exist. Please run the schema.sql file in your Supabase SQL Editor.",
      };
    }

    return { success: true, error: null, hint: null };
  } catch (err) {
    console.error("Unexpected error checking database:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      hint: "Please check your Supabase connection and ensure the schema is set up.",
    };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data;
}
