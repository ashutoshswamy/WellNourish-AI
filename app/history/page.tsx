import { redirect } from "next/navigation";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import DeletePlanButton from "@/components/history/DeletePlanButton";
import SortFilter from "@/components/history/SortFilter";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
  title: "Meal Plan History",
  description: "Browse and review your past personalized 7-day meal plans.",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const user = await getServerUser();
  if (!user) redirect("/");

  const ascending = (await searchParams).sort === "asc";

  let plans: { id: string; created_at: string; status: string; title?: string }[] = [];
  try {
    const snap = await adminDb
      .collection("mealPlans")
      .where("user_id", "==", user.uid)
      .orderBy("created_at", ascending ? "asc" : "desc")
      .get();

    plans = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        created_at: data.created_at?.toDate?.().toISOString() ?? new Date().toISOString(),
        status: data.status,
        title: data.title,
      };
    });
  } catch (err) {
    console.error("History fetch error:", err);
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-10 md:py-14">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,3rem)]">Plan history</h1>
          <p className="mt-2 text-ink-2">
            {plans.length ? `${plans.length} plan${plans.length === 1 ? "" : "s"} so far.` : "Every plan you generate is kept here."}
          </p>
        </div>
        {plans.length > 1 && (
          <Suspense>
            <SortFilter />
          </Suspense>
        )}
      </header>

      {plans.length > 0 ? (
        <ul className="rise card mt-8 divide-y divide-line">
          {plans.map((plan) => (
            <li key={plan.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-sunken/60 sm:px-6">
              <Link href={`/plan?id=${plan.id}`} className="group flex min-w-0 flex-1 items-center gap-4">
                <span className="hidden w-24 shrink-0 font-mono text-sm tabular-nums text-ink-3 sm:block">
                  {format(new Date(plan.created_at), "d MMM yyyy")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium group-hover:underline">{plan.title || "Weekly meal plan"}</span>
                  <span className="block font-mono text-xs tabular-nums text-ink-3 sm:hidden">
                    {format(new Date(plan.created_at), "d MMM yyyy")}
                  </span>
                </span>
                {plan.status === "active" && (
                  <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">Active</span>
                )}
                <ArrowRight className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
              <DeletePlanButton planId={plan.id} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rise mt-8 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">No plans yet</h2>
          <p className="mx-auto mt-2 max-w-xs text-ink-2">Generate your first plan from the dashboard and it will show up here.</p>
          <Link href="/dashboard" className="btn btn-primary mt-6">
            Go to dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
