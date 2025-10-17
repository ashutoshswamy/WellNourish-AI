"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { PlanFullView } from "@/components/plan-full-view";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Utensils,
  Dumbbell,
  Download,
  Share2,
  Star,
  Clock,
  Maximize2,
} from "lucide-react";

interface PlanDisplayProps {
  dietPlan: string;
  workoutRegimen: string;
}

export function PlanDisplay({ dietPlan, workoutRegimen }: PlanDisplayProps) {
  // Debug logs
  console.log("Diet Plan Content:", dietPlan);
  console.log("Workout Regimen Content:", workoutRegimen);

  const handleDownload = () => {
    // Implementation for downloading plans
    console.log("Download plans");
  };

  const handleShare = () => {
    // Implementation for sharing plans
    console.log("Share plans");
  };

  return (
    <div className="space-y-6 xs:space-y-8 md:space-y-10 px-3 xs:px-4">
      {/* Success Header */}
      <div className="text-center py-6 xs:py-8 md:py-10">
        <div className="inline-flex items-center justify-center w-12 h-12 xs:w-16 xs:h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-green-600 rounded-full mb-4 xs:mb-6">
          <Star className="h-6 w-6 xs:h-8 xs:w-8 md:h-10 md:w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-foreground mb-3 xs:mb-4 px-2">
          Your Personalized Wellness Plan is Ready!
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 xs:mb-8 px-4">
          Based on your profile, we've created a comprehensive plan tailored
          specifically for you. Start your journey today!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center items-center px-2">
          <Badge
            variant="secondary"
            className="text-xs xs:text-sm px-3 xs:px-4 py-2 xs:py-2.5"
          >
            <Clock className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
            Generated in seconds
          </Badge>
          <div className="flex flex-wrap gap-2 xs:gap-3 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 xs:gap-2 text-xs xs:text-sm touch-target"
                >
                  <Maximize2 className="h-3 w-3 xs:h-4 xs:w-4" />
                  <span className="hidden xs:inline">Full View</span>
                  <span className="xs:hidden">View</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] xs:max-w-7xl max-h-[90vh] xs:max-h-[95vh] overflow-hidden p-0 w-[95vw]">
                <DialogHeader className="px-4 xs:px-6 py-3 xs:py-4 border-b shrink-0">
                  <DialogTitle className="text-lg xs:text-xl md:text-2xl font-bold">
                    Your Personalized Wellness Plan
                  </DialogTitle>
                </DialogHeader>
                <div className="overflow-hidden flex-1">
                  <PlanFullView
                    title="Your Personalized Wellness Plan"
                    dietPlan={dietPlan}
                    workoutRegimen={workoutRegimen}
                    showGradients={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1 xs:gap-2 text-xs xs:text-sm touch-target"
            >
              <Share2 className="h-3 w-3 xs:h-4 xs:w-4" />
              <span className="hidden xs:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-1 xs:gap-2 text-xs xs:text-sm touch-target"
            >
              <Download className="h-3 w-3 xs:h-4 xs:w-4" />
              <span className="hidden xs:inline">Download</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Content */}
      <Tabs defaultValue="diet" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 xs:h-16 md:h-20 p-1 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger
            value="diet"
            className="h-12 xs:h-14 md:h-18 text-sm xs:text-base md:text-lg font-semibold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 data-[state=active]:scale-[0.98] touch-target-large"
          >
            <Utensils className="mr-1 xs:mr-2 h-4 w-4 xs:h-5 xs:w-5" />
            <div className="flex flex-col items-start">
              <span>Diet Plan</span>
              <span className="text-xs xs:text-xs text-muted-foreground font-normal hidden xs:block">
                Nutrition Guide
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="workout"
            className="h-12 xs:h-14 md:h-18 text-sm xs:text-base md:text-lg font-semibold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 data-[state=active]:scale-[0.98] touch-target-large"
          >
            <Dumbbell className="mr-1 xs:mr-2 h-4 w-4 xs:h-5 xs:w-5" />
            <div className="flex flex-col items-start">
              <span>Workout Regimen</span>
              <span className="text-xs xs:text-xs text-muted-foreground font-normal hidden xs:block">
                Exercise Program
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="mt-6 xs:mt-8">
          <Card className="border-0 shadow-lg xs:shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <CardHeader className="pb-4 xs:pb-6 px-4 xs:px-6 md:px-8">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="w-1.5 xs:w-2 h-6 xs:h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <CardTitle className="text-lg xs:text-xl md:text-2xl font-sans">
                    Your Personalized Diet Plan
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs xs:text-sm">
                  Nutrition Optimized
                </Badge>
              </div>
              <p className="text-xs xs:text-sm md:text-base text-muted-foreground mt-2">
                A comprehensive nutrition plan designed to help you reach your
                goals while maintaining optimal health.
              </p>
            </CardHeader>
            <CardContent className="px-4 xs:px-6 md:px-8">
              <div className="rounded-lg xs:rounded-xl border bg-gradient-to-br from-secondary/30 to-secondary/10 p-4 xs:p-6 md:p-8 backdrop-blur">
                {dietPlan ? (
                  <MarkdownRenderer content={dietPlan} size="lg" />
                ) : (
                  <div className="text-sm xs:text-base text-muted-foreground">
                    No diet plan content available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout" className="mt-6 xs:mt-8">
          <Card className="border-0 shadow-lg xs:shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <CardHeader className="pb-4 xs:pb-6 px-4 xs:px-6 md:px-8">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="w-1.5 xs:w-2 h-6 xs:h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <CardTitle className="text-lg xs:text-xl md:text-2xl font-sans">
                    Your Personalized Workout Regimen
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs xs:text-sm">
                  Fitness Focused
                </Badge>
              </div>
              <p className="text-xs xs:text-sm md:text-base text-muted-foreground mt-2">
                A structured exercise program tailored to your fitness level and
                goals for maximum effectiveness.
              </p>
            </CardHeader>
            <CardContent className="px-4 xs:px-6 md:px-8">
              <div className="rounded-lg xs:rounded-xl border bg-gradient-to-br from-secondary/30 to-secondary/10 p-4 xs:p-6 md:p-8 backdrop-blur">
                <MarkdownRenderer content={workoutRegimen} size="lg" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 backdrop-blur">
        <CardContent className="p-4 xs:p-6 md:p-8 text-center">
          <h3 className="text-lg xs:text-xl md:text-2xl font-bold font-sans mb-3 xs:mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xs xs:text-sm md:text-base text-muted-foreground mb-4 xs:mb-6 max-w-2xl mx-auto px-2">
            Your personalized plans are just the beginning. Track your progress,
            stay consistent, and achieve your wellness goals with your new plan.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="font-semibold text-sm xs:text-base touch-target-large"
            >
              Start Today
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
