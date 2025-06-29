"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import { generateAndSavePlan } from "@/lib/actions/plan";
import { profileSchema } from "@/lib/zod-schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/SubmitButton";
import type { Profile } from "@/lib/types";
import { Loader2 } from "lucide-react";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: profile?.age ?? undefined,
      height: profile?.height ?? undefined,
      weight: profile?.weight ?? undefined,
      gender: profile?.gender ?? undefined,
      activityLevel: profile?.activity_level ?? undefined,
      fitnessGoals: profile?.fitness_goals ?? "",
      dietaryPreferences: profile?.dietary_preferences ?? "",
      preferredCuisine: profile?.preferred_cuisine ?? "",
      medicalConditions: profile?.medical_conditions ?? "",
      allergies: profile?.allergies ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    const result = await generateAndSavePlan(values);

    // On success, the action redirects. If we get here, there was an error.
    setIsLoading(false);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: result.error,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-lg shadow-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold">
          Generating and saving your personalized plan...
        </p>
        <p className="text-muted-foreground">
          This may take a moment. You will be redirected shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Create Your Personalized Plan
        </h1>
        <p className="text-balance text-muted-foreground">
          Fill in your details below, and our AI will generate a custom diet and
          workout plan for you.
        </p>
      </div>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select
                        onValuecha
                        nge={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="lightly_active">
                            Lightly Active
                          </SelectItem>
                          <SelectItem value="moderately_active">
                            Moderately Active
                          </SelectItem>
                          <SelectItem value="very_active">
                            Very Active
                          </SelectItem>
                          <SelectItem value="extra_active">
                            Extra Active
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Lose 10kg, build muscle, run a 5k"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are you trying to achieve?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Vegetarian, low-carb, no nuts"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any dietary restrictions or preferences.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredCuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Cuisine</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Italian, Mexican, Asian"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are your favorite types of food?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Diabetes, high blood pressure."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any relevant medical conditions. If none, you can
                      leave this blank.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Peanuts, shellfish, dairy"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any food allergies. If none, you can leave this
                      blank.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton>Generate My Plan</SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
