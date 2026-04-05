import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { PlanClient } from "@/components/plan/PlanClient";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function PlanPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const selectedId = searchParams?.id;

  // Fetch the plan with its days and meals in a single query (using Supabase join syntax)
  let query = supabase
    .from("meal_plans")
    .select("*, plan_days(*, meals(*))")
    .eq("user_id", userId);

  if (selectedId) {
    query = query.eq("id", selectedId);
  } else {
    query = query.eq("status", "active").order("created_at", { ascending: false }).limit(1);
  }

  const { data: plans, error } = await query;

  if (error || !plans || plans.length === 0) {
    // If no active plan found, redirect to dashboard to generate one
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
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-400 transition-colors text-sm mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Detailed Weekly Menu
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Generated on {new Date(activePlan.created_at).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all text-sm font-semibold shadow-lg shadow-emerald-500/20"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh Plan
          </Link>
        </div>

        {/* Interactive day selector + meal cards */}
        <PlanClient plan={activePlan} />
      </div>
    </div>
  );
}
