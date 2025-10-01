"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Utensils,
  Dumbbell,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useState } from "react";

interface PlanFullViewProps {
  title: string;
  dietPlan: string;
  workoutRegimen: string;
  showGradients?: boolean;
  createdAt?: string;
}

export function PlanFullView({
  title,
  dietPlan,
  workoutRegimen,
  showGradients = false,
  createdAt,
}: PlanFullViewProps) {
  const [activeTab, setActiveTab] = useState("diet");

  const cardClassName = showGradients
    ? "h-full border-0 shadow-xl bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm"
    : "h-full border shadow-lg";

  const headerGradientClass = showGradients
    ? "bg-gradient-to-r from-background/80 via-background/90 to-background/80 backdrop-blur-sm"
    : "bg-background/95";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] overflow-hidden">
      {/* Enhanced Header */}
      <div className={`p-4 lg:p-6 border-b shrink-0 ${headerGradientClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-8 bg-gradient-to-b from-primary via-green-500 to-blue-500 rounded-full shrink-0"></div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl lg:text-2xl font-bold font-sans text-foreground truncate">
                  {showGradients ? "Your Personalized Wellness Plan" : title}
                </h2>
                {createdAt && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      Created on {formatDate(createdAt)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {showGradients && (
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600 shrink-0" />
              <span>Personalized for your goals</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Science-backed approach</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Expert validated</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Tab System */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden min-h-0"
      >
        <div className="px-4 lg:px-6 pt-4 shrink-0">
          <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/30">
            <TabsTrigger
              value="diet"
              className="h-10 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Utensils className="h-4 w-4 mr-2 shrink-0" />
              <span className="hidden sm:inline">Diet Plan</span>
              <span className="sm:hidden">Diet</span>
              <Badge
                variant="secondary"
                className="ml-2 text-xs hidden lg:inline-flex"
              >
                Nutrition
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="workout"
              className="h-10 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Dumbbell className="h-4 w-4 mr-2 shrink-0" />
              <span className="hidden sm:inline">Workout Regimen</span>
              <span className="sm:hidden">Workout</span>
              <Badge
                variant="secondary"
                className="ml-2 text-xs hidden lg:inline-flex"
              >
                Fitness
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="diet"
          className="flex-1 overflow-hidden px-4 lg:px-6 pb-4 lg:pb-6 min-h-0"
        >
          <Card
            className={`${cardClassName} flex flex-col h-full overflow-hidden`}
          >
            <CardHeader className="pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg lg:text-xl font-semibold truncate">
                      Personalized Diet Plan
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      Nutrition plan tailored to your goals and preferences
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 shrink-0"
                >
                  <Utensils className="h-3 w-3 mr-1" />
                  Nutrition
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="rounded-xl border bg-gradient-to-br from-green-50/50 via-background/80 to-green-50/30 p-4 lg:p-6 backdrop-blur-sm">
                  {dietPlan ? (
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-green-800 dark:prose-headings:text-green-200 prose-sm lg:prose-base">
                      <MarkdownRenderer content={dietPlan} size="lg" />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No diet plan content available
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="workout"
          className="flex-1 overflow-hidden px-4 lg:px-6 pb-4 lg:pb-6 min-h-0"
        >
          <Card
            className={`${cardClassName} flex flex-col h-full overflow-hidden`}
          >
            <CardHeader className="pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg lg:text-xl font-semibold truncate">
                      Personalized Workout Regimen
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      Exercise program designed for your fitness level and goals
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 shrink-0"
                >
                  <Dumbbell className="h-3 w-3 mr-1" />
                  Fitness
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="rounded-xl border bg-gradient-to-br from-blue-50/50 via-background/80 to-blue-50/30 p-4 lg:p-6 backdrop-blur-sm">
                  {workoutRegimen ? (
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-blue-800 dark:prose-headings:text-blue-200 prose-sm lg:prose-base">
                      <MarkdownRenderer content={workoutRegimen} size="lg" />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No workout regimen content available
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Footer */}
      {showGradients && (
        <div className="border-t bg-muted/20 px-4 lg:px-6 py-4 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                <span>AI-Generated Plan</span>
              </div>
              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />
              <span>Tailored for optimal results</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={85} className="w-20 h-2" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                85% Complete
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
