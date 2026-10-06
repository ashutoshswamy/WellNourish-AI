import { redirect } from "next/navigation";
import { adminDb, getServerUser, loadPlanWithDays } from "@/lib/firebase-admin";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ShoppingBasket } from "lucide-react";
import { PlanClient } from "@/components/plan/PlanClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Plan Details",
  description:
    "View the detailed recipes, nutrition information, and portions for your 7-day meal plan.",
};

export const dynamic = "force-dynamic";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await getServerUser();
  if (!user) redirect("/");

  const selectedId = (await searchParams).id;

  let planId = selectedId;
  if (!planId) {
    const activeSnap = await adminDb
      .collection("mealPlans")
      .where("user_id", "==", user.uid)
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .limit(1)
      .get();
    planId = activeSnap.docs[0]?.id;
  }

  const activePlan = planId ? await loadPlanWithDays(planId) : null;

  if (!activePlan || activePlan.user_id !== user.uid) {
    redirect("/dashboard");
  }

  return (
    <div className="py-10 md:py-14">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> Dashboard
      </Link>
      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,3rem)]">Your weekly menu</h1>
          <p className="mt-2 text-ink-2">
            Generated{" "}
            {new Date(activePlan.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/shopping-list" className="btn btn-secondary">
            <ShoppingBasket className="size-4" /> Grocery list
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            <RefreshCw className="size-4" /> New plan
          </Link>
        </div>
      </header>

      <PlanClient plan={activePlan} />
    </div>
  );
}
