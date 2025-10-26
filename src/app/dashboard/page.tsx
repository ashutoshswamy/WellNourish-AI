"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import UserInputForm from "@/components/UserInputForm";
import PlanDisplay from "@/components/PlanDisplay";
import { UserInputForm as UserInputFormType } from "@/lib/validation";
import type { User } from "@supabase/supabase-js";
import { checkDatabaseSetup } from "@/lib/db-utils";
import {
  Leaf,
  History,
  Plus,
  Calendar,
  Activity,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dbSetupError, setDbSetupError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Check database setup
        const dbCheck = await checkDatabaseSetup();
        if (!dbCheck.success) {
          setDbSetupError(
            dbCheck.hint || dbCheck.error || "Database setup issue"
          );
        } else {
          loadSavedPlans(user.id);
        }
      }
    };
    getUser();
  }, []);

  const loadSavedPlans = async (userId: string) => {
    const { data, error } = await supabase
      .from("saved_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setSavedPlans(data);
    } else if (error) {
      console.error("Error loading saved plans:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleSubmit = async (data: UserInputFormType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const result = await response.json();
      setPlan(result);

      // Save plan to database
      if (user) {
        const { error: insertError } = await supabase
          .from("saved_plans")
          .insert([
            {
              user_id: user.id,
              plan_data: result,
              user_inputs: data,
            },
          ]);

        if (insertError) {
          console.error("Error saving plan:", insertError);
        } else {
          console.log("Plan saved successfully!");
          loadSavedPlans(user.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  const loadPlan = (planData: any) => {
    setPlan(planData.plan_data);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-slate-950 dark:to-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-50 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                WellNourish AI
              </h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setShowHistory(false)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  !showHistory
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Create Plan</span>
                <span className="xs:hidden">Create</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  showHistory
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">My Plans</span>
                <span className="xs:hidden">Plans</span>
              </button>
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-zinc-300 dark:border-zinc-700">
                <div className="text-right hidden lg:block">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[150px]">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-105 transform"
                >
                  Sign Out
                </button>
              </div>
              <button
                onClick={handleSignOut}
                className="sm:hidden bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Database Setup Error */}
        {dbSetupError && (
          <div className="max-w-4xl mx-auto mb-8 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                  Database Setup Required
                </h3>
                <p className="text-amber-800 dark:text-amber-300 mb-3">
                  {dbSetupError}
                </p>
                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    To fix this:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-800 dark:text-amber-300">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to SQL Editor</li>
                    <li>
                      Copy and paste the contents of{" "}
                      <code className="bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded">
                        schema.sql
                      </code>
                    </li>
                    <li>Run the SQL commands</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHistory ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                  Saved Plans
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 font-light">
                  View and manage your wellness plans
                </p>
              </div>
              {savedPlans.length > 0 && (
                <div className="bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-xl">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {savedPlans.length}{" "}
                    {savedPlans.length === 1 ? "Plan" : "Plans"}
                  </span>
                </div>
              )}
            </div>
            {savedPlans.length === 0 ? (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-16 text-center border border-zinc-200 dark:border-zinc-800">
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                  No Plans Yet
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg font-light mb-6">
                  Create your first wellness plan to get started on your journey
                </p>
                <button
                  onClick={() => setShowHistory(false)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {savedPlans.map((savedPlan) => (
                  <div
                    key={savedPlan.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all overflow-hidden group"
                  >
                    <div className="p-6 sm:p-8">
                      {/* Header with Date/Time */}
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg">
                          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                            {new Date(savedPlan.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(savedPlan.created_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* BMI Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            Body Mass Index
                          </h3>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                              {savedPlan.plan_data.bmi}
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                              {savedPlan.plan_data.bmiCategory}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Goal Section */}
                      {savedPlan.user_inputs.goals && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                              Fitness Goal
                            </h3>
                          </div>
                          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-100 dark:border-violet-900/30">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {savedPlan.user_inputs.goals}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* View Button */}
                      <button
                        onClick={() => loadPlan(savedPlan)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:scale-[1.02] transform group"
                      >
                        <FileText className="w-5 h-5" />
                        View Complete Plan
                        <span className="ml-auto group-hover:translate-x-1 transition-transform text-lg">
                          →
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            {!plan && (
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
                  Welcome back, {user?.user_metadata?.full_name || "there"}
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light">
                  Your Personal AI-Powered Diet & Fitness Planner
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 shadow-lg">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col items-center">
              {plan ? (
                <PlanDisplay plan={plan} onReset={handleReset} />
              ) : (
                <UserInputForm onSubmit={handleSubmit} isLoading={loading} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
