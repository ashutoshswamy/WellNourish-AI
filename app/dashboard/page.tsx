import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import Link from "next/link";
import {
  Activity,
  Calendar,
  ArrowRight,
  Flame,
  Droplets,
  Wheat,
  Scale,
  Target,
  Clock,
  TrendingDown,
} from "lucide-react";

interface MealPlan {
  id: string;
  created_at: string;
  status: string;
  start_date: string;
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

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { userId, getToken } = await auth();
  const user = await currentUser();
  if (!userId) redirect("/");

  const supabaseAccessToken = await getToken({ template: "supabase" });
  if (!supabaseAccessToken) redirect("/");

  const supabase = await createAuthenticatedClient(supabaseAccessToken);

  const { data: metrics } = await supabase
    .from("user_metrics")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!metrics) {
    redirect("/profile");
  }

  // Fetch the current active plan
  const { data: activePlan } = await supabase
    .from("meal_plans")
    .select("*, plan_days(*, meals(*))")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch recent plan history
  const { data: recentPlans } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  const hasPlan = !!activePlan;
  const planDays = activePlan?.plan_days || [];
  const todayPlan = planDays.find((d: PlanDay) => d.day_number === 1);
  const todayMeals = todayPlan?.meals || [];

  // BMI calculation
  const heightM = metrics.height_cm / 100;
  const bmi = (metrics.weight_kg / (heightM * heightM)).toFixed(1);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-[0.2em] mb-2">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Hello, {user?.firstName || "WellNourished User"}
            </h1>
          </div>
          <Link
            href="/profile"
            className="self-start sm:self-auto text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Update Physical Profile
          </Link>
        </div>

        {/* ── Top Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Activity className="w-4 h-4" />}
            label="Daily Target"
            value={`${metrics.daily_calorie_target || '—'} kcal`}
          />
          <StatCard
            icon={<Scale className="w-4 h-4" />}
            label="Current Weight"
            value={`${metrics.weight_kg} kg`}
          />
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Goal"
            value={metrics.health_goal}
          />
          <StatCard
            icon={<TrendingDown className="w-4 h-4" />}
            label="Rate"
            value={`${metrics.weekly_goal}`}
          />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column — spans 2 on lg */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Meal Plan Card */}
            <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/[0.12] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Current Meal Plan
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {hasPlan
                        ? `Started ${new Date(activePlan.start_date).toLocaleDateString()}`
                        : "No active plan"}
                    </p>
                  </div>
                </div>
                {hasPlan && (
                  <Link
                    href="/plan"
                    className="group flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Manage Plan
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>

              {hasPlan && todayPlan ? (
                <>
                  {/* Today's summary */}
                  <div className="flex items-center gap-5 mb-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-medium text-white">
                        Day 1 Preview
                      </span>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <MiniStat
                        icon={<Flame className="w-3 h-3 text-orange-400/70" />}
                        value={`${todayPlan.total_calories} kcal`}
                      />
                      <MiniStat
                        icon={<Droplets className="w-3 h-3 text-blue-400/70" />}
                        value={sumMacro(todayMeals, "protein")}
                      />
                      <MiniStat
                        icon={<Wheat className="w-3 h-3 text-amber-400/70" />}
                        value={sumMacro(todayMeals, "carbs")}
                      />
                    </div>
                  </div>

                  {/* Meal preview grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["breakfast", "lunch", "dinner", "snacks"].map((type) => {
                      const meal = todayMeals.find((m: Meal) => m.meal_type === type);
                      if (!meal) return null;
                      return (
                        <div
                          key={type}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                        >
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2 block text-slate-500">
                            {type}
                          </span>
                          <p className="text-sm font-medium text-white leading-snug mb-1 line-clamp-2">
                            {meal.name}
                          </p>
                          <p className="text-[11px] text-emerald-400/80">
                            {meal.calories} kcal
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-sm mb-5 font-light">
                    Transform your goals into a actionable eating blueprint.
                  </p>
                  <GenerateButton />
                </div>
              )}
            </div>

            {/* Recent Plans */}
            {recentPlans && recentPlans.length > 0 && (
              <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <h2 className="text-base font-semibold text-white mb-5">History</h2>
                <div className="space-y-2">
                  {recentPlans.map((plan: MealPlan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-sm text-slate-400">
                          {new Date(plan.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/5 ${plan.status === 'active' ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {plan.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="flex flex-col gap-5">
            {/* Stats Overview */}
            <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <h2 className="text-base font-semibold text-white mb-5">Body Specs</h2>
              <div className="space-y-4">
                <ProfileRow label="BMI" value={bmi} />
                <ProfileRow label="Weight" value={`${metrics.weight_kg} kg`} />
                <ProfileRow label="Height" value={`${metrics.height_cm} cm`} />
                <ProfileRow label="Activity" value={metrics.activity_level} />
                
                {metrics.allergies && (
                  <div className="pt-3 border-t border-white/[0.04]">
                     <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400/60 block mb-2">
                        Allergies
                      </span>
                    <p className="text-xs text-red-200/50">{metrics.allergies}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <h2 className="text-base font-semibold text-white mb-4">Actions</h2>
              <div className="space-y-2">
                <QuickAction
                  href="/profile"
                  icon={<Activity className="w-4 h-4" />}
                  label="Rebuild Avatar"
                />
                 {hasPlan && (
                  <QuickAction
                    href="/shopping-list"
                    icon={<Wheat className="w-4 h-4" />}
                    label="Grocery List"
                  />
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <GenerateButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="flex items-center gap-2 mb-2 text-slate-500">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-base font-semibold text-white truncate">{value}</p>
    </div>
  );
}

function MiniStat({ icon, value }: { icon: React.ReactNode; value: string; }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[11px] font-medium text-slate-400">{value}</span>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string; }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-300">{value}</span>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string; }) {
  return (
    <Link href={href} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
      <span className="text-slate-500 group-hover:text-emerald-400 transition-colors">{icon}</span>
      <span className="text-sm text-slate-400 group-hover:text-white transition-colors flex-1">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function sumMacro(meals: Meal[], key: "protein" | "carbs" | "fat"): string {
  let total = 0;
  meals.forEach(m => {
    const val = m[key];
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) total += num;
    }
  });
  return total > 0 ? `${total}g` : "—";
}
