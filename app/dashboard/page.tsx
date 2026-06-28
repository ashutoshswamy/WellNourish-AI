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
  ShoppingBasket,
  User,
} from "lucide-react";

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
  title: "Dashboard",
  description: "View and manage your AI-generated meal plans and health metrics.",
};

export const dynamic = "force-dynamic";

const MEAL_COLORS: Record<string, string> = {
  breakfast: "#facc15",
  lunch: "#b4f55a",
  dinner: "#818cf8",
  snacks: "#fb923c",
};

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

  if (!metrics) redirect("/profile");

  const { data: activePlan } = await supabase
    .from("meal_plans")
    .select("*, plan_days(*, meals(*))")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

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

  const heightM = metrics.height_cm / 100;
  const bmi = (metrics.weight_kg / (heightM * heightM)).toFixed(1);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-7xl w-full mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-2"
              style={{ color: "rgba(180,245,90,0.7)" }}
            >
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Hello, {user?.firstName || "there"} 👋
            </h1>
          </div>
          <Link
            href="/profile"
            className="self-start sm:self-auto text-sm font-medium transition-colors text-[#3a4a3a] hover:text-[#b4f55a]"
          >
            Update Profile →
          </Link>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            label="Daily Target"
            value={`${metrics.daily_calorie_target || "—"} kcal`}
            color="#fb923c"
          />
          <StatCard
            icon={<Scale className="w-4 h-4" />}
            label="Current Weight"
            value={`${metrics.weight_kg} kg`}
            color="#60a5fa"
          />
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Goal"
            value={metrics.health_goal}
            color="#b4f55a"
          />
          <StatCard
            icon={<TrendingDown className="w-4 h-4" />}
            label="Weekly Rate"
            value={`${metrics.weekly_goal}`}
            color="#34d399"
          />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Meal Plan Card */}
            <div
              className="p-7 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(180,245,90,0.07)",
                      border: "1px solid rgba(180,245,90,0.12)",
                      color: "#b4f55a",
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Current Meal Plan
                    </h2>
                    <p className="text-[11px]" style={{ color: "#3a4a3a" }}>
                      {hasPlan
                        ? `Started ${new Date(activePlan.start_date).toLocaleDateString()}`
                        : "No active plan yet"}
                    </p>
                  </div>
                </div>
                {hasPlan && (
                  <Link
                    href="/plan"
                    className="group flex items-center gap-1.5 text-sm font-medium transition-colors"
                    style={{ color: "#b4f55a" }}
                  >
                    Manage Plan
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>

              {hasPlan && todayPlan ? (
                <>
                  {/* Day 1 macro summary */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-5 p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#b4f55a", boxShadow: "0 0 6px #b4f55a" }}
                      />
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        Day 1 Preview
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:flex items-center gap-x-6 gap-y-2 sm:gap-5 sm:ml-auto">
                      <MiniStat icon={<Flame className="w-3 h-3" style={{ color: "#fb923c" }} />} value={`${todayPlan.total_calories} kcal`} />
                      <MiniStat icon={<Droplets className="w-3 h-3" style={{ color: "#60a5fa" }} />} value={sumMacro(todayMeals, "protein")} />
                      <MiniStat icon={<Wheat className="w-3 h-3" style={{ color: "#fbbf24" }} />} value={sumMacro(todayMeals, "carbs")} />
                      <MiniStat icon={<Activity className="w-3 h-3" style={{ color: "#34d399" }} />} value={sumMacro(todayMeals, "fat")} />
                    </div>
                  </div>

                  {/* Meal mini-cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["breakfast", "lunch", "dinner", "snacks"].map((type) => {
                      const meal = todayMeals.find((m: Meal) => m.meal_type === type);
                      if (!meal) return null;
                      const color = MEAL_COLORS[type] || "#b4f55a";
                      return (
                        <div
                          key={type}
                          className="p-3.5 rounded-xl transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <span
                            className="text-[9px] font-bold uppercase tracking-[0.15em] mb-2 block px-2 py-0.5 rounded-full self-start inline-block"
                            style={{
                              color,
                              background: `${color}10`,
                              border: `1px solid ${color}25`,
                            }}
                          >
                            {type}
                          </span>
                          <p className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">
                            {meal.name}
                          </p>
                          <p className="text-[11px] font-medium" style={{ color: "#b4f55a" }}>
                            {meal.calories} kcal
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-light mb-5" style={{ color: "#3a4a3a" }}>
                    Transform your goals into an actionable eating blueprint.
                  </p>
                  <GenerateButton />
                </div>
              )}
            </div>

            {/* History */}
            {recentPlans && recentPlans.length > 0 && (
              <div
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Recent Plans</h2>
                  <Link
                    href="/history"
                    className="text-xs font-medium transition-colors"
                    style={{ color: "#3a4a3a" }}
                  >
                    View all →
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentPlans.map((plan: MealPlan) => (
                    <Link
                      key={plan.id}
                      href={`/plan?id=${plan.id}`}
                      className="flex items-center justify-between p-3.5 rounded-xl transition-colors group"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-3.5 h-3.5" style={{ color: "#3a4a3a" }} />
                        <span className="text-sm" style={{ color: "#6a7a6a" }}>
                          {new Date(plan.created_at).toLocaleDateString()}
                        </span>
                        {plan.title && (
                          <span className="text-sm font-medium text-white hidden sm:block truncate max-w-[160px]">
                            {plan.title}
                          </span>
                        )}
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                        style={
                          plan.status === "active"
                            ? { background: "rgba(180,245,90,0.08)", color: "#b4f55a", border: "1px solid rgba(180,245,90,0.15)" }
                            : { background: "rgba(255,255,255,0.04)", color: "#3a4a3a" }
                        }
                      >
                        {plan.status}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5">

            {/* Body Specs */}
            <div
              className="p-7 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h2 className="text-base font-semibold text-white mb-5">Body Specs</h2>
              <div className="space-y-3">
                <ProfileRow label="BMI" value={bmi} />
                <ProfileRow label="Weight" value={`${metrics.weight_kg} kg`} />
                <ProfileRow label="Height" value={`${metrics.height_cm} cm`} />
                <ProfileRow label="Activity" value={metrics.activity_level} />
                {metrics.allergies && (
                  <div
                    className="pt-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5"
                      style={{ color: "rgba(239,68,68,0.5)" }}
                    >
                      Allergies
                    </span>
                    <p className="text-xs" style={{ color: "rgba(239,68,68,0.4)" }}>
                      {metrics.allergies}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="p-7 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-1">
                <QuickAction
                  href="/profile"
                  icon={<User className="w-4 h-4" />}
                  label="Update Profile"
                />
                {hasPlan && (
                  <QuickAction
                    href="/shopping-list"
                    icon={<ShoppingBasket className="w-4 h-4" />}
                    label="Grocery List"
                  />
                )}
                {hasPlan && (
                  <QuickAction
                    href="/plan"
                    icon={<Calendar className="w-4 h-4" />}
                    label="View Full Plan"
                  />
                )}
              </div>
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <GenerateButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: `${color}10`,
          border: `1px solid ${color}20`,
          color,
        }}
      >
        {icon}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#3a4a3a" }}>
        {label}
      </p>
      <p className="text-base font-bold text-white truncate">{value}</p>
    </div>
  );
}

function MiniStat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[11px] font-medium" style={{ color: "#6a7a6a" }}>
        {value}
      </span>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between pb-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
    >
      <span className="text-xs" style={{ color: "#3a4a3a" }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: "#c4cec4" }}>
        {value}
      </span>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-3 rounded-xl transition-colors"
      style={{ color: "#4a5a4a" }}
    >
      <span className="group-hover:text-[#b4f55a] transition-colors">{icon}</span>
      <span className="text-sm flex-1 group-hover:text-white transition-colors">
        {label}
      </span>
      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
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
  return total > 0 ? `${total}g` : "—";
}
