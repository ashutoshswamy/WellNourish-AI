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
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-green-600 rounded-full mb-6">
          <Star className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-foreground mb-4">
          Your Personalized Wellness Plan is Ready!
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Based on your profile, we've created a comprehensive plan tailored
          specifically for you. Start your journey today!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            Generated in seconds
          </Badge>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Full View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Your Personalized Wellness Plan
                  </DialogTitle>
                </DialogHeader>
                <PlanFullView
                  title="Your Personalized Wellness Plan"
                  dietPlan={dietPlan}
                  workoutRegimen={workoutRegimen}
                  showGradients={true}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Content */}
      <Tabs defaultValue="diet" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted/50">
          <TabsTrigger
            value="diet"
            className="h-12 text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Utensils className="mr-2 h-5 w-5" />
            Diet Plan
          </TabsTrigger>
          <TabsTrigger
            value="workout"
            className="h-12 text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Dumbbell className="mr-2 h-5 w-5" />
            Workout Regimen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="mt-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <CardTitle className="text-2xl font-headline">
                    Your Personalized Diet Plan
                  </CardTitle>
                </div>
                <Badge variant="secondary">Nutrition Optimized</Badge>
              </div>
              <p className="text-muted-foreground">
                A comprehensive nutrition plan designed to help you reach your
                goals while maintaining optimal health.
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-gradient-to-br from-secondary/30 to-secondary/10 p-8 backdrop-blur">
                {dietPlan ? (
                  <MarkdownRenderer content={dietPlan} size="lg" />
                ) : (
                  <div className="text-muted-foreground">
                    No diet plan content available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout" className="mt-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <CardTitle className="text-2xl font-headline">
                    Your Personalized Workout Regimen
                  </CardTitle>
                </div>
                <Badge variant="secondary">Fitness Focused</Badge>
              </div>
              <p className="text-muted-foreground">
                A structured exercise program tailored to your fitness level and
                goals for maximum effectiveness.
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-gradient-to-br from-secondary/30 to-secondary/10 p-8 backdrop-blur">
                <MarkdownRenderer content={workoutRegimen} size="lg" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 backdrop-blur">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold font-headline mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Your personalized plans are just the beginning. Track your progress,
            stay consistent, and achieve your wellness goals with your new plan.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="font-semibold">
              Start Today
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
