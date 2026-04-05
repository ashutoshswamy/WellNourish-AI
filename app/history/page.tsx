import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowLeft, History as HistoryIcon, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

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
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <HistoryIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Plan History</h1>
              <p className="text-slate-500 text-sm">Review your previous 7-day nutritional journeys.</p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans?.map((plan) => (
            <Link 
              key={plan.id}
              href={`/plan?id=${plan.id}`}
              className="group relative bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/10 transition-colors" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      {format(new Date(plan.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {plan.title || "Weekly Meal Plan"}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={plan.status} />
                      <span className="text-slate-500 text-xs">• 7 Days Included</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 bg-white/5 group-hover:bg-indigo-500 group-hover:text-black group-hover:scale-110 transition-all duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}

          {(!plans || plans.length === 0) && (
            <div className="col-span-full py-32 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[40px]">
              <HistoryIcon className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
              <h3 className="text-xl font-medium text-slate-600 mb-2">No plans found</h3>
              <p className="text-slate-700 max-w-sm mx-auto">Generate your first plan to start your nutritional history.</p>
              <Link 
                href="/profile" 
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl bg-indigo-500 text-black font-bold text-sm tracking-tight hover:bg-indigo-400 transition-all shadow-lg hover:shadow-indigo-500/25"
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
    <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border ${
      isActive 
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
        : "bg-slate-500/10 border-slate-500/20 text-slate-500"
    }`}>
      {status}
    </span>
  );
}
