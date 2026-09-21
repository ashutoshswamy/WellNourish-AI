import { NextResponse } from "next/server";
import { adminDb, deleteMealPlanCascade, getServerUser, loadPlanWithDays } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("id");

    if (planId) {
      const plan = await loadPlanWithDays(planId);
      if (!plan || plan.user_id !== user.uid) {
        return new NextResponse("Plan not found", { status: 404 });
      }
      return NextResponse.json({ plan });
    }

    const activeSnap = await adminDb
      .collection("mealPlans")
      .where("user_id", "==", user.uid)
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .limit(1)
      .get();

    const activePlan = activeSnap.docs[0] ? await loadPlanWithDays(activeSnap.docs[0].id) : null;

    const recentSnap = await adminDb
      .collection("mealPlans")
      .where("user_id", "==", user.uid)
      .orderBy("created_at", "desc")
      .limit(10)
      .get();

    const recentPlans = recentSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        status: data.status,
        start_date: data.start_date,
        created_at: data.created_at?.toDate?.().toISOString() ?? null,
      };
    });

    return NextResponse.json({ activePlan, recentPlans });
  } catch (err) {
    console.error("Plans API GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

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
