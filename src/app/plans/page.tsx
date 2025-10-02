"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/contexts/auth-context";
import { DatabaseService } from "@/lib/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Dumbbell,
  Utensils,
  Trash2,
  Eye,
  Loader2,
  Search,
  LayoutDashboard,
  Plus,
  Maximize2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { PlanFullView } from "@/components/plan-full-view";

interface Plan {
  id: string;
  created_at: string;
  title: string;
  diet_plan: string;
  workout_regimen: string;
}

function PlansContent() {
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewPlanId = searchParams.get("view");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadPlans();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Auto-select plan if view parameter is provided
    if (viewPlanId && plans.length > 0) {
      const plan = plans.find((p) => p.id === viewPlanId);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [viewPlanId, plans]);

  useEffect(() => {
    // Filter plans based on search term
    const filtered = plans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.diet_plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.workout_regimen.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [plans, searchTerm]);

  const loadPlans = async () => {
    if (!user) return;

    try {
      const db = new DatabaseService();
      const userPlans = await db.getUserPlans(user.id);
      setPlans(userPlans);
    } catch (err) {
      setError("Failed to load your plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!user || !confirm("Are you sure you want to delete this plan?")) return;

    setDeleting(planId);
    try {
      const db = new DatabaseService();
      const success = await db.deletePlan(planId, user.id);
      if (success) {
        setPlans(plans.filter((plan) => plan.id !== planId));
        if (selectedPlan?.id === planId) {
          setSelectedPlan(null);
        }
      } else {
        setError("Failed to delete plan");
      }
    } catch (err) {
      setError("Failed to delete plan");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center safe-area-top safe-area-bottom">
        <div className="flex items-center gap-2 px-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm xs:text-base">Loading your plans...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 safe-area-top safe-area-bottom">
      <div className="container-fluid py-section max-w-7xl mx-auto px-3">
        {/* Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 xs:mb-8 gap-4 xs:gap-6">
          <div className="flex-grow">
            <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold font-sans text-balance">
              Plan History
            </h1>
            <p className="text-muted-foreground text-sm xs:text-base mt-1 xs:mt-2">
              Browse and manage all your wellness plans ({plans.length} total)
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto">
            <Button variant="outline" asChild className="w-full xs:w-auto">
              <Link href="/" className="gap-2 touch-target-large a11y-focus">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </Button>
            <Button asChild className="w-full xs:w-auto">
              <Link
                href="/?create=true"
                className="gap-2 touch-target-large a11y-focus"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Plan</span>
                <span className="sm:hidden">New Plan</span>
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg xs:text-xl">
              <Search className="h-5 w-5" />
              Search Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by title, diet plan, or workout..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Plans List */}
          <div className="space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Your Plans {searchTerm && `(${filteredPlans.length} found)`}
              </h2>
              {plans.length > 0 && (
                <Badge variant="secondary">{plans.length} total</Badge>
              )}
            </div>

            {filteredPlans.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  {plans.length === 0 ? (
                    <>
                      <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No plans yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first wellness plan to get started
                      </p>
                      <Button asChild>
                        <Link href="/?create=true">Create Plan</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No results found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search terms
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[600px] pr-2">
                <div className="space-y-4">
                  {filteredPlans.map((plan) => (
                    <div key={plan.id} className="pr-2">
                      <Card
                        className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/40"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-lg truncate">
                                  {plan.title}
                                </CardTitle>
                                {selectedPlan?.id === plan.id && (
                                  <span className="text-sm text-primary font-medium">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {formatDate(plan.created_at)}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPlan(plan);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePlan(plan.id);
                                }}
                                disabled={deleting === plan.id}
                              >
                                {deleting === plan.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline" className="text-xs">
                              <Utensils className="h-3 w-3 mr-1" />
                              Diet Plan
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Dumbbell className="h-3 w-3 mr-1" />
                              Workout
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Plan Details */}
          <div>
            {selectedPlan ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Plan Details</h2>
                  <div className="flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Maximize2 className="h-4 w-4 mr-2" />
                          Full View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 w-[95vw]">
                        <DialogHeader className="px-6 py-4 border-b shrink-0">
                          <DialogTitle className="text-2xl font-bold">
                            {selectedPlan.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-hidden flex-1">
                          <PlanFullView
                            title={selectedPlan.title}
                            dietPlan={selectedPlan.diet_plan}
                            workoutRegimen={selectedPlan.workout_regimen}
                            showGradients={false}
                            createdAt={selectedPlan.created_at}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Badge variant="secondary">
                      {formatDateShort(selectedPlan.created_at)}
                    </Badge>
                  </div>
                </div>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50/50 via-background to-green-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Utensils className="h-5 w-5 text-green-600" />
                      Diet Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-green-800 dark:prose-headings:text-green-200">
                        <MarkdownRenderer
                          content={selectedPlan.diet_plan}
                          size="sm"
                        />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 via-background to-blue-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                      Workout Regimen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-blue-800 dark:prose-headings:text-blue-200">
                        <MarkdownRenderer
                          content={selectedPlan.workout_regimen}
                          size="sm"
                        />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-[600px] flex items-center justify-center border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/5 to-muted/10">
                <CardContent className="text-center">
                  <div className="animate-pulse">
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Select a plan to view details
                  </h3>
                  <p className="text-muted-foreground">
                    Click on any plan from the list to see its comprehensive
                    details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading plans...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <PlansContent />
    </Suspense>
  );
}
