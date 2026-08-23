import { NextResponse } from "next/server";
import { adminDb, deleteMealPlanCascade, getServerUser } from "@/lib/firebase-admin";

export async function DELETE(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("id");
    if (!planId) return new NextResponse("Missing plan id", { status: 400 });

    const planSnap = await adminDb.collection("mealPlans").doc(planId).get();
    if (!planSnap.exists || planSnap.data()?.user_id !== user.uid) {
      return new NextResponse("Failed to delete plan", { status: 500 });
    }

    await deleteMealPlanCascade(planId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Plans API error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
