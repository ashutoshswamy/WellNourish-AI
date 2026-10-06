"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const profileSchema = z.object({
  age: z.number().int().min(1, "Must be at least 1").max(120),
  gender: z.enum(["Male", "Female", "Other"]),
  weight_kg: z.number().positive("Must be greater than 0"),
  height_cm: z.number().positive("Must be greater than 0"),
  target_weight: z.number().positive().nullish(),
  activity_level: z.enum(["Sedentary", "Light", "Moderate", "Active", "Very Active"]),
  health_goal: z.enum(["Lose Weight", "Maintain", "Gain Muscle"]),
  weekly_goal: z.enum(["0.25kg", "0.5kg", "1kg", "Maintain"]),
  cuisine_preferences: z.string().nullish(),
  diet_preferences: z.string().nullish(),
  allergies: z.string().nullish(),
  injuries: z.string().nullish(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInitialData {
  age?: number;
  gender?: "Male" | "Female" | "Other";
  weight_kg?: number;
  height_cm?: number;
  target_weight?: number | null;
  activity_level?: "Sedentary" | "Light" | "Moderate" | "Active" | "Very Active";
  health_goal?: "Lose Weight" | "Maintain" | "Gain Muscle";
  weekly_goal?: "0.25kg" | "0.5kg" | "1kg" | "Maintain";
  cuisine_preferences?: string;
  diet_preferences?: string;
  allergies?: string;
  injuries?: string;
}

export function ProfileForm({ initialData }: { initialData: ProfileInitialData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: initialData.age || 25,
      gender: initialData.gender || "Male",
      weight_kg: initialData.weight_kg || 70,
      height_cm: initialData.height_cm || 170,
      target_weight: initialData.target_weight || null,
      activity_level: initialData.activity_level || "Moderate",
      health_goal: initialData.health_goal || "Maintain",
      weekly_goal: initialData.weekly_goal || "Maintain",
      cuisine_preferences: initialData.cuisine_preferences || "",
      diet_preferences: initialData.diet_preferences || "Standard",
      allergies: initialData.allergies || "",
      injuries: initialData.injuries || "",
    },
  });

  const currentGender = form.watch("gender");
  const currentActivityLevel = form.watch("activity_level");
  const currentHealthGoal = form.watch("health_goal");
  const currentWeeklyGoal = form.watch("weekly_goal");

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setSaveSuccess(false);
    setSaveError(null);

    const formattedData = {
      ...data,
      target_weight:
        typeof data.target_weight === "number" && !isNaN(data.target_weight)
          ? data.target_weight
          : null,
      age: Number(data.age),
      weight_kg: Number(data.weight_kg),
      height_cm: Number(data.height_cm),
    };

    try {
      const res = await fetch("/api/user-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save profile");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setSaveError("Couldn't save your profile. Check the fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { errors } = form.formState;

  return (
    <div className="mx-auto w-full max-w-4xl py-10 md:py-14">
      <header>
        <h1 className="display text-[clamp(2rem,4vw,3rem)]">Your body &amp; goals</h1>
        <p className="mt-2 text-ink-2">Changes apply to the next plan you generate.</p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 divide-y divide-line border-y border-line">
        <Section title="Body" hint="Used to calculate your daily calorie target.">
          <fieldset>
            <legend className="field-label">Sex</legend>
            <div className="flex flex-wrap gap-2">
              {(["Male", "Female", "Other"] as const).map((g) => (
                <Choice key={g} active={currentGender === g} onClick={() => form.setValue("gender", g)}>
                  {g}
                </Choice>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(
              [
                { id: "age", label: "Age", suffix: "yrs" },
                { id: "weight_kg", label: "Weight", suffix: "kg" },
                { id: "height_cm", label: "Height", suffix: "cm" },
                { id: "target_weight", label: "Goal weight", suffix: "kg" },
              ] as const
            ).map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="field-label">
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    id={f.id}
                    type="number"
                    inputMode="decimal"
                    step={f.id.includes("weight") ? "0.1" : "1"}
                    {...form.register(f.id, { valueAsNumber: true })}
                    aria-invalid={!!errors[f.id]}
                    className="field pr-12 font-mono tabular-nums"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-3">{f.suffix}</span>
                </div>
                {errors[f.id] && <p className="mt-1.5 text-sm text-danger">{errors[f.id]?.message || "Enter a valid number"}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Activity & goal" hint="Sets how far above or below maintenance your target sits.">
          <fieldset>
            <legend className="field-label">Activity level</legend>
            <div className="flex flex-wrap gap-2">
              {[
                { val: "Sedentary", label: "Sedentary" },
                { val: "Light", label: "Light" },
                { val: "Moderate", label: "Moderate" },
                { val: "Active", label: "Active" },
                { val: "Very Active", label: "Very active" },
              ].map((item) => (
                <Choice
                  key={item.val}
                  active={currentActivityLevel === item.val}
                  onClick={() => form.setValue("activity_level", item.val as ProfileFormValues["activity_level"])}
                >
                  {item.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">Primary goal</legend>
            <div className="flex flex-wrap gap-2">
              {(["Lose Weight", "Maintain", "Gain Muscle"] as const).map((g) => (
                <Choice key={g} active={currentHealthGoal === g} onClick={() => form.setValue("health_goal", g)}>
                  {g.charAt(0) + g.slice(1).toLowerCase()}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">Weekly pace</legend>
            <div className="flex flex-wrap gap-2">
              {[
                { val: "Maintain", label: "Hold steady" },
                { val: "0.25kg", label: "0.25 kg / week" },
                { val: "0.5kg", label: "0.5 kg / week" },
                { val: "1kg", label: "1 kg / week" },
              ].map((wp) => (
                <Choice
                  key={wp.val}
                  active={currentWeeklyGoal === wp.val}
                  onClick={() => form.setValue("weekly_goal", wp.val as ProfileFormValues["weekly_goal"])}
                >
                  {wp.label}
                </Choice>
              ))}
            </div>
          </fieldset>
        </Section>

        <Section title="Food preferences" hint="Allergies are filtered out of every recipe.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="diet" className="field-label">
                Diet
              </label>
              <select id="diet" {...form.register("diet_preferences")} className="field cursor-pointer">
                <option value="Standard">Standard</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Keto">Ketogenic</option>
                <option value="Paleo">Paleo</option>
              </select>
            </div>
            <div>
              <label htmlFor="cuisine" className="field-label">
                Cuisines you like
              </label>
              <input id="cuisine" type="text" {...form.register("cuisine_preferences")} placeholder="Indian, Italian, Mexican" className="field" />
            </div>
            <div>
              <label htmlFor="allergies" className="field-label">
                Allergies
              </label>
              <input id="allergies" type="text" {...form.register("allergies")} placeholder="Peanuts, gluten" className="field" />
            </div>
            <div>
              <label htmlFor="injuries" className="field-label">
                Injuries or limitations
              </label>
              <input id="injuries" type="text" {...form.register("injuries")} placeholder="Bad knee, lower back" className="field" />
            </div>
          </div>
        </Section>

        <div className="flex flex-wrap items-center justify-end gap-4 py-6">
          {saveError && (
            <p role="alert" className="mr-auto text-sm text-danger">
              {saveError}
            </p>
          )}
          {saveSuccess && (
            <p role="status" className="mr-auto inline-flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4" /> Profile saved
            </p>
          )}
          <Link href="/dashboard" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary min-w-36">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-ink-2">{hint}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="choice" aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}
