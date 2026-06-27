import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/lib/supabase-server";
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
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  const supabaseAccessToken = await getToken({ template: "supabase" });
  if (!supabaseAccessToken) redirect("/");

  const supabase = await createAuthenticatedClient(supabaseAccessToken);

  const selectedId = searchParams?.id;

  let query = supabase
    .from("meal_plans")
    .select("*, plan_days(*, meals(*))")
    .eq("user_id", userId);

  if (selectedId) {
    query = query.eq("id", selectedId);
  } else {
    query = query
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
  }

  const { data: plans, error } = await query;

  if (error || !plans || plans.length === 0) {
    redirect("/dashboard");
  }

  const activePlan = plans[0];

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
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold self-start sm:self-auto transition-all"
            style={{ background: "#b4f55a", color: "#050a05" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 28px rgba(180,245,90,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
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
