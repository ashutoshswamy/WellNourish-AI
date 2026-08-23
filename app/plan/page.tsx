import { redirect } from "next/navigation";
import { adminDb, getServerUser, loadPlanWithDays } from "@/lib/firebase-admin";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
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
  searchParams: { id?: string };
}) {
  const user = await getServerUser();
  if (!user) redirect("/");

  const selectedId = searchParams?.id;

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
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-7xl w-full mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm mb-4 group transition-colors"
              style={{ color: "#2a3a2a" }}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="group-hover:text-white transition-colors">
                Return to Dashboard
              </span>
            </Link>
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-2"
              style={{ color: "rgba(180,245,90,0.7)" }}
            >
              Active Plan
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Your Weekly Menu
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#3a4a3a" }}>
              Generated on{" "}
              {new Date(activePlan.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold self-start sm:self-auto transition-all hover:shadow-[0_0_28px_rgba(180,245,90,0.4)]"
            style={{ background: "#b4f55a", color: "#050a05" }}
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Regenerate Plan
          </Link>
        </div>

        {/* Plan content */}
        <PlanClient plan={activePlan} />
      </div>
    </div>
  );
}
