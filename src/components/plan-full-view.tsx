"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils, Dumbbell } from "lucide-react";

interface PlanFullViewProps {
  title: string;
  dietPlan: string;
  workoutRegimen: string;
  showGradients?: boolean;
}

export function PlanFullView({
  title,
  dietPlan,
  workoutRegimen,
  showGradients = false,
}: PlanFullViewProps) {
  const cardClassName = showGradients
    ? "h-full border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur"
    : "h-full";

  const contentClassName = showGradients
    ? "rounded-xl border bg-gradient-to-br from-secondary/30 to-secondary/10 p-8 backdrop-blur pr-4"
    : "pr-4";

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs defaultValue="diet" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="diet" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Diet Plan
          </TabsTrigger>
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Workout Regimen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="flex-1 overflow-hidden">
          <Card className={cardClassName}>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showGradients && (
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  )}
                  <CardTitle className="text-2xl font-headline">
                    {showGradients
                      ? "Your Personalized Diet Plan"
                      : "Diet Plan"}
                  </CardTitle>
                </div>
                {showGradients && (
                  <Badge variant="secondary">Nutrition Optimized</Badge>
                )}
              </div>
              {showGradients && (
                <p className="text-muted-foreground">
                  A comprehensive nutrition plan designed to help you reach your
                  goals while maintaining optimal health.
                </p>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[60vh]">
                <div className={contentClassName}>
                  {dietPlan ? (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <MarkdownRenderer content={dietPlan} size="lg" />
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No diet plan content available
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout" className="flex-1 overflow-hidden">
          <Card className={cardClassName}>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showGradients && (
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  )}
                  <CardTitle className="text-2xl font-headline">
                    {showGradients
                      ? "Your Personalized Workout Regimen"
                      : "Workout Regimen"}
                  </CardTitle>
                </div>
                {showGradients && (
                  <Badge variant="secondary">Fitness Focused</Badge>
                )}
              </div>
              {showGradients && (
                <p className="text-muted-foreground">
                  A structured exercise program tailored to your fitness level
                  and goals for maximum effectiveness.
                </p>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[60vh]">
                <div className={contentClassName}>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <MarkdownRenderer content={workoutRegimen} size="lg" />
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
