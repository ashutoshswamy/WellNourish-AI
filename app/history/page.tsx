import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowLeft, History as HistoryIcon, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import DeletePlanButton from "@/components/history/DeletePlanButton";
import SortFilter from "@/components/history/SortFilter";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Plan History",
  description: "Browse and review your past personalized 7-day meal plans.",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  const supabaseAccessToken = await getToken({ template: "supabase" });
  if (!supabaseAccessToken) return redirect("/");

  const supabase = await createAuthenticatedClient(supabaseAccessToken);

  const ascending = searchParams?.sort === "asc";

  const { data: plans, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending });

  if (error) console.error("History fetch error:", error);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-5xl w-full mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 group transition-colors"
            style={{ color: "#2a3a2a" }}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="group-hover:text-white transition-colors">Dashboard</span>
          </Link>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(180,245,90,0.07)",
                  border: "1px solid rgba(180,245,90,0.12)",
                }}
              >
                <HistoryIcon className="w-5 h-5" style={{ color: "#b4f55a" }} strokeWidth={1.8} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em] mb-1"
                  style={{ color: "rgba(180,245,90,0.7)" }}
                >
                  History
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Plan History
                </h1>
              </div>
            </div>
            <Suspense>
              <SortFilter />
            </Suspense>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plans?.map((plan) => (
            <Link
              key={plan.id}
              href={`/plan?id=${plan.id}`}
              className="group relative p-5 rounded-2xl transition-all duration-300 border border-white/[0.05] hover:border-[rgba(180,245,90,0.12)] hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#2a3a2a" }} />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "#3a4a3a" }}
                    >
                      {format(new Date(plan.created_at), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="text-base font-semibold text-white truncate transition-colors"
                      style={{}}
                    >
                      {plan.title || "Weekly Meal Plan"}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <StatusBadge status={plan.status} />
                      <span className="text-[10px]" style={{ color: "#2a3a2a" }}>
                        7 days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4 shrink-0">
                  <div
                    className="p-2.5 rounded-xl border transition-all duration-300 group-hover:bg-[#b4f55a] group-hover:text-[#050a05] group-hover:border-[#b4f55a]"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "#3a4a3a",
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <DeletePlanButton planId={plan.id} />
                </div>
              </div>
            </Link>
          ))}

          {(!plans || plans.length === 0) && (
            <div
              className="col-span-full py-24 text-center rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.01)",
                border: "1px dashed rgba(255,255,255,0.05)",
              }}
            >
              <HistoryIcon
                className="w-10 h-10 mx-auto mb-4"
                style={{ color: "rgba(255,255,255,0.06)" }}
              />
              <h3 className="text-base font-medium mb-1" style={{ color: "#3a4a3a" }}>
                No plans yet
              </h3>
              <p className="text-sm max-w-xs mx-auto mb-6" style={{ color: "#2a3a2a" }}>
                Generate your first plan to start building your nutrition history.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: "#b4f55a",
                  color: "#050a05",
                }}
              >
                Generate First Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
      style={
        isActive
          ? {
              background: "rgba(180,245,90,0.08)",
              color: "#b4f55a",
              border: "1px solid rgba(180,245,90,0.15)",
            }
          : {
              background: "rgba(255,255,255,0.04)",
              color: "#2a3a2a",
            }
      }
    >
      {status}
    </span>
  );
}
