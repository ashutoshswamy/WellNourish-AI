import { redirect } from "next/navigation";
import { adminDb, getServerUser, loadPlanWithDays } from "@/lib/firebase-admin";
import Link from "next/link";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { NutritionLabel } from "@/components/global/NutritionLabel";

interface MealPlan {
  id: string;
  created_at: string;
  status: string;
  start_date: string;
  title?: string;
  [key: string]: unknown;
}

interface Meal {
  meal_type: string;
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  [key: string]: unknown;
}

interface PlanDay {
  day_number: number;
  total_calories: number;
  meals: Meal[];
  [key: string]: unknown;
}

import { GenerateButton } from "@/components/dashboard/GenerateButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
  title: "Dashboard",
  description: "View and manage your AI-generated meal plans and health metrics.",
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getServerUser();
  if (!user) redirect("/");
  const userId = user.uid;

  const [metricsSnap, activeSnap, recentSnap] = await Promise.all([
    adminDb.collection("userMetrics").doc(userId).get(),
    adminDb
      .collection("mealPlans")
      .where("user_id", "==", userId)
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .limit(1)
      .get(),
    adminDb
      .collection("mealPlans")
      .where("user_id", "==", userId)
      .orderBy("created_at", "desc")
      .limit(3)
      .get(),
  ]);
  const metrics = metricsSnap.data();

  if (!metrics) redirect("/profile");

  const activePlan = activeSnap.docs[0] ? await loadPlanWithDays(activeSnap.docs[0].id) : null;

  const recentPlans: MealPlan[] = recentSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() ?? new Date().toISOString(),
      status: data.status,
      start_date: data.start_date,
      title: data.title,
    };
  });

  const hasPlan = !!activePlan;
  const planDays = activePlan?.plan_days || [];
  const todayPlan = planDays.find((d: PlanDay) => d.day_number === 1);
  const todayMeals = todayPlan?.meals || [];

  const heightM = metrics.height_cm / 100;
  const bmi = (metrics.weight_kg / (heightM * heightM)).toFixed(1);

  const firstName = (user.name as string | undefined)?.split(" ")[0];
  const mealOrder = ["breakfast", "lunch", "dinner", "snacks"];

  return (
    <div className="py-10 md:py-14">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,3rem)]">Hello{firstName ? `, ${firstName}` : ""}.</h1>
          <p className="mt-2 text-ink-2">
            {hasPlan ? `Your current plan started ${fmtDate(activePlan.start_date)}.` : "No active plan yet. Generate one to fill your week."}
          </p>
        </div>
        <Link href="/profile" className="btn btn-secondary">
          Edit profile
        </Link>
      </header>

      {/* Targets strip */}
      <dl className="rise card mt-8 grid grid-cols-3 divide-line md:grid-cols-4 md:divide-x [&>div]:p-4 sm:[&>div]:p-5">
        <div className="col-span-3 border-b border-line md:col-span-1 md:border-b-0">
          <dt className="text-sm text-ink-2">Daily target</dt>
          <dd className="mt-1 font-mono text-3xl font-semibold tabular-nums">
            {metrics.daily_calorie_target ? Number(metrics.daily_calorie_target).toLocaleString("en-US") : "-"}
            <span className="ml-1 text-base font-normal text-ink-3">kcal</span>
          </dd>
        </div>
        <Stat label="Weight" value={`${metrics.weight_kg} kg`} />
        <Stat label="Goal" value={metrics.health_goal} />
        <Stat label="Weekly pace" value={metrics.weekly_goal} />
      </dl>

      <div className="rise mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-6">
          {/* Day 1 menu */}
          <section className="card p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">{hasPlan ? "Day 1 menu" : "Your week starts here"}</h2>
              {hasPlan && (
                <Link href="/plan" className="group inline-flex items-center gap-1.5 text-sm font-semibold">
                  Full plan
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>

            {hasPlan && todayPlan ? (
              <ul className="mt-4 divide-y divide-line">
                {mealOrder.map((type) => {
                  const meal = todayMeals.find((m: Meal) => m.meal_type === type);
                  if (!meal) return null;
                  return (
                    <li key={type} className="grid grid-cols-[5.5rem_1fr_auto] items-baseline gap-3 py-3.5">
                      <span className="text-sm capitalize text-ink-3">{type}</span>
                      <span className="min-w-0 font-medium leading-snug">{meal.name}</span>
                      <span className="font-mono text-sm tabular-nums text-ink-2">{meal.calories} kcal</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-6 rounded-xl bg-sunken p-6 md:p-8">
                <p className="max-w-sm text-ink-2">
                  We&apos;ll turn your targets into seven days of meals, recipes and a grocery list. Takes under a minute.
                </p>
                <GenerateButton className="mt-5 max-w-xs" />
              </div>
            )}
          </section>

          {recentPlans.length > 0 && (
            <section className="card p-6 md:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent plans</h2>
                <Link href="/history" className="text-sm font-semibold">
                  View all
                </Link>
              </div>
              <ul className="mt-3 divide-y divide-line">
                {recentPlans.map((plan: MealPlan) => (
                  <li key={plan.id}>
                    <Link href={`/plan?id=${plan.id}`} className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="min-w-0">
                        <span className="block truncate font-medium group-hover:underline">{plan.title || "Weekly meal plan"}</span>
                        <span className="text-sm text-ink-3">{fmtDate(plan.created_at)}</span>
                      </span>
                      {plan.status === "active" && (
                        <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">Active</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          {hasPlan && todayPlan && (
            <NutritionLabel
              serving="Day 1"
              calories={todayPlan.total_calories}
              rows={[
                { label: "Protein", value: sumMacro(todayMeals, "protein") },
                { label: "Carbohydrate", value: sumMacro(todayMeals, "carbs") },
                { label: "Total fat", value: sumMacro(todayMeals, "fat") },
              ]}
            />
          )}

          <section className="card p-6">
            <h2 className="text-lg font-semibold">Body</h2>
            <dl className="mt-3 divide-y divide-line text-sm">
              <Row label="BMI" value={bmi} />
              <Row label="Height" value={`${metrics.height_cm} cm`} />
              <Row label="Activity" value={metrics.activity_level} />
            </dl>
            {metrics.allergies && (
              <div className="mt-4 rounded-xl bg-danger-soft p-3.5 text-sm">
                <p className="font-semibold text-danger">Allergies</p>
                <p className="mt-0.5 text-ink">{metrics.allergies}</p>
              </div>
            )}
          </section>

          {hasPlan && (
            <section className="flex flex-col gap-3">
              <Link href="/shopping-list" className="btn btn-secondary w-full">
                <ShoppingBasket className="size-4" /> Grocery list
              </Link>
              <GenerateButton />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="mt-1 text-base font-semibold leading-snug wrap-anywhere sm:text-lg">{value}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-ink-2">{label}</dt>
      <dd className="min-w-0 text-right font-medium wrap-anywhere">{value}</dd>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function sumMacro(meals: Meal[], key: "protein" | "carbs" | "fat"): string {
  let total = 0;
  meals.forEach((m) => {
    const val = m[key];
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) total += num;
    }
  });
  return total > 0 ? `${total} g` : "-";
}
