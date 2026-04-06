import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowLeft, History as HistoryIcon, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import DeletePlanButton from "@/components/history/DeletePlanButton";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  const supabaseAccessToken = await getToken({ template: "supabase" });
  if (!supabaseAccessToken) {
    return redirect("/");
  }

  const supabase = await createAuthenticatedClient(supabaseAccessToken);

  const { data: plans, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("History fetch error:", error);
  }

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm font-medium group mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-400/[0.06]">
              <HistoryIcon className="w-5 h-5 text-emerald-400/70" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Plan History</h1>
              <p className="text-sm text-white/30 mt-0.5">Your previous nutritional plans.</p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plans?.map((plan) => (
            <Link
              key={plan.id}
              href={`/plan?id=${plan.id}`}
              className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-400/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                      {format(new Date(plan.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {plan.title || "Weekly Meal Plan"}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <StatusBadge status={plan.status} />
                      <span className="text-white/15 text-xs">7 days</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <div className="p-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] text-white/30 group-hover:bg-emerald-400 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <DeletePlanButton planId={plan.id} />
                </div>
              </div>
            </Link>
          ))}

          {(!plans || plans.length === 0) && (
            <div className="col-span-full py-24 text-center bg-white/[0.01] border border-dashed border-white/[0.05] rounded-2xl">
              <HistoryIcon className="w-10 h-10 text-white/10 mx-auto mb-4" />
              <h3 className="text-base font-medium text-white/40 mb-1">No plans yet</h3>
              <p className="text-sm text-white/20 max-w-xs mx-auto">Generate your first plan to start building your history.</p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-emerald-400 text-black font-semibold text-sm tracking-wide hover:bg-emerald-300 transition-all"
              >
                Create New Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
      isActive
        ? "bg-emerald-400/10 text-emerald-400"
        : "bg-white/5 text-white/25"
    }`}>
      {status}
    </span>
  );
}
