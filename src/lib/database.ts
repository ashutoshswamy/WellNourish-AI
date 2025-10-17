import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

type Plan = Database["public"]["Tables"]["plans"]["Row"];
type PlanInsert = Database["public"]["Tables"]["plans"]["Insert"];

export class DatabaseService {
  private supabase = createClient();

  // Profile methods
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // Handle the case where no profile exists (this is expected for new users)
        if (error.code === "PGRST116") {
          console.log("No profile found for user:", userId);
          return null;
        }
        console.error("Error fetching profile:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        return null;
      }

      return data;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  }

  async createProfile(profile: ProfileInsert): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      throw new Error("Failed to create profile");
    }

    return data;
  }

  async updateProfile(
    userId: string,
    updates: ProfileUpdate
  ): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }

    return data;
  }

  // Plan methods
  async createPlan(plan: PlanInsert): Promise<Plan | null> {
    const { data, error } = await this.supabase
      .from("plans")
      .insert(plan)
      .select()
      .single();

    if (error) {
      console.error("Error creating plan:", error);
      throw new Error("Failed to save plan");
    }

    return data;
  }

  async getUserPlans(userId: string): Promise<Plan[]> {
    const { data, error } = await this.supabase
      .from("plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching plans:", error);
      return [];
    }

    return data;
  }

  async getRecentUserPlans(userId: string, limit: number = 3): Promise<Plan[]> {
    const { data, error } = await this.supabase
      .from("plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent plans:", error);
      return [];
    }

    return data;
  }

  async getTotalUserPlansCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("plans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching plans count:", error);
      return 0;
    }

    return count || 0;
  }

  async getPlan(planId: string, userId: string): Promise<Plan | null> {
    const { data, error } = await this.supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching plan:", error);
      return null;
    }

    return data;
  }

  async deletePlan(planId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("plans")
      .delete()
      .eq("id", planId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting plan:", error);
      return false;
    }

    return true;
  }
}
