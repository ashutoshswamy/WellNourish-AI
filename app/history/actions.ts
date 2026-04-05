"use server";

import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function deletePlanAction(planId: string) {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabaseAccessToken = await getToken({ template: "supabase" });
  if (!supabaseAccessToken) {
    throw new Error("No database access token found");
  }

  const supabase = await createAuthenticatedClient(supabaseAccessToken);

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", planId);

  if (error) {
    console.error("Delete plan error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/history");
  revalidatePath("/dashboard");
  return { success: true };
}
