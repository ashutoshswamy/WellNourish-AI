"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { DatabaseService } from "@/lib/database";
import { EnhancedProfileForm } from "@/components/enhanced-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Utensils,
  Plus,
  Eye,
  History,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { PlanState } from "@/app/actions";

interface Plan {
  id: string;
  created_at: string;
  title: string;
  diet_plan: string;
  workout_regimen: string;
}

export function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [totalPlansCount, setTotalPlansCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPlans, setCurrentPlans] = useState<PlanState | null>(null);

  useEffect(() => {
    if (user) {
      loadRecentPlans();
      loadTotalPlansCount();
      checkProfile();
    }
  }, [user]);

  useEffect(() => {
    // Check if the create parameter is present
    const shouldCreate = searchParams.get("create");
    if (shouldCreate === "true") {
      setShowCreateForm(true);
      // Clear the parameter from URL
      router.replace("/");
    }
  }, [searchParams, router]);

  const loadRecentPlans = async () => {
    if (!user) return;

    try {
      const dbService = new DatabaseService();
      const recentPlans = await dbService.getRecentUserPlans(user.id, 3);
      setPlans(recentPlans);
    } catch (error) {
      console.error("Error loading recent plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTotalPlansCount = async () => {
    if (!user) return;

    try {
      const dbService = new DatabaseService();
      const count = await dbService.getTotalUserPlansCount(user.id);
      setTotalPlansCount(count);
    } catch (error) {
      console.error("Error loading total plans count:", error);
    }
  };

  const checkProfile = async () => {
    if (!user) return;

    try {
      const dbService = new DatabaseService();
      const profile = await dbService.getProfile(user.id);
      setHasProfile(!!profile);
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const handlePlanGenerated = (generatedPlans: PlanState) => {
    setCurrentPlans(generatedPlans);
    setShowCreateForm(false);
    // Reload recent plans to include the new one
    loadRecentPlans();
    loadTotalPlansCount();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container-fluid py-section safe-area-top safe-area-bottom">
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="container-fluid py-section safe-area-top safe-area-bottom min-h-screen">
        <div className="mb-6 max-w-6xl mx-auto px-3">
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
            className="mb-4 touch-target-large a11y-focus"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <EnhancedProfileForm onPlanGenerated={handlePlanGenerated} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-section safe-area-top safe-area-bottom min-h-screen">
      <div className="space-y-8 max-w-6xl mx-auto px-3">
        {/* Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 xs:gap-6">
          <div className="flex-grow">
            <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Welcome back, {user?.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground text-sm xs:text-base mt-1 xs:mt-2">
              Here's your wellness dashboard
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="gap-2 touch-target-large a11y-focus w-full xs:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New Plan</span>
              <span className="sm:hidden">New Plan</span>
            </Button>
            <Button variant="outline" asChild className="w-full xs:w-auto">
              <Link
                href="/plans"
                className="gap-2 touch-target-large a11y-focus"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">View All Plans</span>
                <span className="sm:hidden">All Plans</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200 touch-target">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 xs:px-6 pt-4 xs:pt-6">
              <CardTitle className="text-xs xs:text-sm md:text-base font-medium">
                Profile Status
              </CardTitle>
              <Utensils className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 xs:px-6 pb-4 xs:pb-6">
              <div className="text-xl xs:text-2xl md:text-3xl font-bold">
                {hasProfile ? "Complete" : "Incomplete"}
              </div>
              <p className="text-xs xs:text-sm text-muted-foreground">
                {hasProfile
                  ? "Ready to generate plans"
                  : "Complete your profile first"}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-200 touch-target">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 xs:px-6 pt-4 xs:pt-6">
              <CardTitle className="text-xs xs:text-sm md:text-base font-medium">
                Total Plans Generated
              </CardTitle>
              <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 xs:px-6 pb-4 xs:pb-6">
              <div className="text-xl xs:text-2xl md:text-3xl font-bold">
                {totalPlansCount}
              </div>
              <p className="text-xs xs:text-sm text-muted-foreground">
                {totalPlansCount === 0
                  ? "No plans created yet"
                  : totalPlansCount === 1
                  ? "Plan created"
                  : "Plans created"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Your Plans */}
        <div>
          <h2 className="text-lg xs:text-xl md:text-2xl font-semibold mb-4 xs:mb-6">
            Your Plans
          </h2>
          {plans.length === 0 ? (
            <Card className="text-center py-8 xs:py-10 md:py-12">
              <CardContent className="px-4 xs:px-6">
                <div className="mx-auto w-16 h-16 xs:w-20 xs:h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-3 xs:mb-4">
                  <Plus className="h-8 w-8 xs:h-10 xs:w-10 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-base xs:text-lg md:text-xl font-semibold mb-2">
                  No plans yet
                </h3>
                <p className="text-xs xs:text-sm md:text-base text-muted-foreground mb-4 xs:mb-6 max-w-md mx-auto">
                  Create your first personalized diet and workout plan to get
                  started.
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="gap-2 touch-target-large"
                >
                  <Plus className="h-4 w-4 xs:h-5 xs:w-5" />
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 md:gap-6">
              {plans.map((plan, index) => {
                // Extract goal from title (e.g., "Weight Loss Plan - 12/1/2024" -> "Weight Loss")
                const goalMatch = plan.title.match(/^(.+?)\s+Plan\s*-/);
                const goal = goalMatch ? goalMatch[1] : plan.title;

                return (
                  <Card
                    key={plan.id}
                    className="hover:shadow-lg transition-shadow touch-target"
                  >
                    <CardHeader className="px-4 xs:px-6 pt-4 xs:pt-6">
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                        <CardTitle className="text-base xs:text-lg md:text-xl">
                          {goal}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(plan.created_at)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 xs:px-6 pb-4 xs:pb-6">
                      <div className="space-y-2 xs:space-y-3">
                        <div className="flex items-center gap-2 text-xs xs:text-sm text-muted-foreground">
                          <Utensils className="h-3 w-3 xs:h-4 xs:w-4" />
                          <span>Diet Plan Included</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs xs:text-sm text-muted-foreground">
                          <Dumbbell className="h-3 w-3 xs:h-4 xs:w-4" />
                          <span>Workout Regimen Included</span>
                        </div>
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full touch-target text-xs xs:text-sm"
                          >
                            <Link
                              href={`/plans?view=${plan.id}`}
                              className="gap-2"
                            >
                              <Eye className="h-3 w-3 xs:h-4 xs:w-4" />
                              View Plan
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {plans.length > 0 && (
          <div>
            <h2 className="text-lg xs:text-xl md:text-2xl font-semibold mb-4 xs:mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 md:gap-6">
              <Card className="touch-target">
                <CardHeader className="px-4 xs:px-6 pt-4 xs:pt-6">
                  <CardTitle className="flex items-center gap-2 text-base xs:text-lg md:text-xl">
                    <Plus className="h-4 w-4 xs:h-5 xs:w-5" />
                    Create New Plan
                  </CardTitle>
                  <CardDescription className="text-xs xs:text-sm">
                    Generate a new personalized diet and workout plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 xs:px-6 pb-4 xs:pb-6">
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full touch-target-large text-sm xs:text-base"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              <Card className="touch-target">
                <CardHeader className="px-4 xs:px-6 pt-4 xs:pt-6">
                  <CardTitle className="flex items-center gap-2 text-base xs:text-lg md:text-xl">
                    <History className="h-4 w-4 xs:h-5 xs:w-5" />
                    View All Plans
                  </CardTitle>
                  <CardDescription className="text-xs xs:text-sm">
                    Browse through all your previous plans and manage them
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 xs:px-6 pb-4 xs:pb-6">
                  <Button
                    variant="outline"
                    className="w-full touch-target-large text-sm xs:text-base"
                    asChild
                  >
                    <Link href="/plans">View History</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
