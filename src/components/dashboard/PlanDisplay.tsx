"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Apple, Dumbbell, Sparkles, Info } from "lucide-react";
import type { Plan } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlanDisplay({
  plan,
  isNew = false,
}: {
  plan: Plan;
  isNew?: boolean;
}) {
  const { toast } = useToast();

  useEffect(() => {
    if (isNew) {
      toast({
        title: "Plan Saved!",
        description:
          "Your new plan has been successfully saved to your history.",
      });
    }
  }, [isNew, toast]);

  const DetailItem = ({
    label,
    value,
    className,
  }: {
    label: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div className={className}>
      <p className="font-semibold text-muted-foreground">{label}</p>
      <p className="break-words">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Apple className="h-6 w-6 text-accent" />
            Diet Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {plan.diet_plan}
          </ReactMarkdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Dumbbell className="h-6 w-6 text-accent" />
            Workout Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {plan.workout_plan}
          </ReactMarkdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="h-6 w-6 text-accent" />
            Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          {plan.health_tips ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {plan.health_tips}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              No specific health tips were generated for this plan.
            </p>
          )}
        </CardContent>
      </Card>

      {plan.generation_details && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Info className="h-6 w-6 text-accent" />
              Generation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-sm">
              <DetailItem label="Age" value={plan.generation_details.age} />
              <DetailItem
                label="Height"
                value={`${plan.generation_details.height} cm`}
              />
              <DetailItem
                label="Weight"
                value={`${plan.generation_details.weight} kg`}
              />

              <DetailItem
                label="Gender"
                value={
                  <span className="capitalize">
                    {plan.generation_details.gender}
                  </span>
                }
              />
              <DetailItem
                label="Activity Level"
                value={
                  <span className="capitalize">
                    {plan.generation_details.activityLevel.replace(/_/g, " ")}
                  </span>
                }
              />
              <DetailItem
                label="Fitness Goals"
                value={plan.generation_details.fitnessGoals}
              />

              <DetailItem
                label="Dietary Preferences"
                value={plan.generation_details.dietaryPreferences}
              />
              <DetailItem
                label="Preferred Cuisine"
                value={plan.generation_details.preferredCuisine}
              />

              {plan.generation_details.medicalConditions && (
                <DetailItem
                  label="Medical Conditions"
                  value={plan.generation_details.medicalConditions}
                />
              )}
              {plan.generation_details.allergies && (
                <DetailItem
                  label="Allergies"
                  value={plan.generation_details.allergies}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
