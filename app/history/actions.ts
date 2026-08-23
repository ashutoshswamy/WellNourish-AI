"use server";

import { adminDb, deleteMealPlanCascade, getServerUser } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function deletePlanAction(planId: string) {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const planSnap = await adminDb.collection("mealPlans").doc(planId).get();
  if (!planSnap.exists || planSnap.data()?.user_id !== user.uid) {
    return { success: false, error: "Plan not found" };
  }

  try {
    await deleteMealPlanCascade(planId);
  } catch (err) {
    console.error("Delete plan error:", err);
    return { success: false, error: "Failed to delete plan" };
  }

  revalidatePath("/history");
  revalidatePath("/dashboard");
  return { success: true };
}
