"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  User,
  Mars,
  Venus,
  Activity,
  Target,
  Zap,
  TrendingDown,
  Flame,
  Scale,
  Ruler,
  Calendar,
  Sparkles,
  ShieldCheck,
  Heart,
  Globe,
  Stethoscope,
  Leaf,
  Save,
} from "lucide-react";
import Link from "next/link";
import { SelectionCard } from "@/components/global/SelectionCard";

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
    }
  });

  const currentGender = form.watch("gender");
  const currentActivityLevel = form.watch("activity_level");
  const currentHealthGoal = form.watch("health_goal");
  const currentWeeklyGoal = form.watch("weekly_goal");

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setSaveSuccess(false);

    // Clean data: convert NaN to null
    const formattedData = {
      ...data,
      target_weight: typeof data.target_weight === 'number' && !isNaN(data.target_weight) ? data.target_weight : null,
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
      alert("Something went wrong saving your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto">
      {/* Back navigation */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 text-sm font-medium group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Dashboard
      </Link>

      {/* Page title */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">Your Profile</h1>
        <p className="text-sm text-white/30">Update your metrics and preferences. Changes will apply to your next generated plan.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Section 1: Body Metrics ── */}
        <ProfileSection title="Body Metrics" icon={Scale}>
          {/* Gender */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-white/30 tracking-wide mb-3">Gender</label>
            <div className="grid grid-cols-3 gap-2.5">
              <SelectionCard icon={Mars} title="Male" selected={currentGender === "Male"} onClick={() => form.setValue("gender", "Male")} compact />
              <SelectionCard icon={Venus} title="Female" selected={currentGender === "Female"} onClick={() => form.setValue("gender", "Female")} compact />
              <SelectionCard icon={User} title="Other" selected={currentGender === "Other"} onClick={() => form.setValue("gender", "Other")} compact />
            </div>
          </div>

          {/* Metric inputs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: "age", label: "Age", icon: Calendar, suffix: "yrs" },
              { id: "weight_kg", label: "Weight", icon: Scale, suffix: "kg" },
              { id: "height_cm", label: "Height", icon: Ruler, suffix: "cm" },
              { id: "target_weight", label: "Goal Weight", icon: Target, suffix: "kg" },
            ].map((field) => (
              <div key={field.id} className={`p-4 rounded-xl border transition-all ${
                field.id === "target_weight"
                  ? "bg-lime-400/[0.02] border-lime-400/10"
                  : "bg-white/[0.015] border-white/[0.05]"
              }`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <field.icon className="w-3 h-3 text-white/20" strokeWidth={1.5} />
                  <label className="text-[0.6rem] font-medium text-white/25 tracking-wider uppercase">{field.label}</label>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step={field.id.includes('weight') ? "0.1" : "1"}
                    {...form.register(field.id as keyof ProfileFormValues, { valueAsNumber: true })}
                    className="w-full bg-transparent text-xl font-bold text-white focus:outline-none placeholder:text-white/[0.05] input-glow rounded"
                  />
                  <span className="text-[0.6rem] font-medium text-white/15 uppercase shrink-0">{field.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>

        {/* ── Section 2: Activity & Goals ── */}
        <ProfileSection title="Activity & Goals" icon={Activity}>
          {/* Activity Level */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-white/30 tracking-wide mb-3">Activity level</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { val: "Sedentary", label: "Sedentary", icon: User },
                { val: "Light", label: "Light", icon: Activity },
                { val: "Moderate", label: "Moderate", icon: Zap },
                { val: "Active", label: "Active", icon: Flame },
                { val: "Very Active", label: "Intense", icon: Sparkles },
              ].map((item) => (
                <SelectionCard
                  key={item.val}
                  icon={item.icon}
                  title={item.label}
                  selected={currentActivityLevel === item.val}
                  onClick={() => form.setValue("activity_level", item.val as ProfileFormValues["activity_level"])}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Health Goal */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-white/30 tracking-wide mb-3">Primary goal</label>
            <div className="grid grid-cols-3 gap-2.5">
              <SelectionCard icon={TrendingDown} title="Lose Weight" selected={currentHealthGoal === "Lose Weight"} onClick={() => form.setValue("health_goal", "Lose Weight")} compact />
              <SelectionCard icon={Heart} title="Maintain" selected={currentHealthGoal === "Maintain"} onClick={() => form.setValue("health_goal", "Maintain")} compact />
              <SelectionCard icon={Zap} title="Gain Muscle" selected={currentHealthGoal === "Gain Muscle"} onClick={() => form.setValue("health_goal", "Gain Muscle")} compact />
            </div>
          </div>

          {/* Weekly Pace */}
          <div>
            <label className="block text-xs font-medium text-white/30 tracking-wide mb-3">Weekly pace</label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: "Maintain", label: "Maintain" },
                { val: "0.25kg", label: "0.25 kg/wk" },
                { val: "0.5kg", label: "0.5 kg/wk" },
                { val: "1kg", label: "1 kg/wk" },
              ].map((wp) => (
                <button
                  key={wp.val}
                  type="button"
                  onClick={() => form.setValue("weekly_goal", wp.val as ProfileFormValues["weekly_goal"])}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${
                    currentWeeklyGoal === wp.val
                      ? "bg-lime-400/12 border-lime-400/30 text-lime-400"
                      : "bg-white/[0.02] border-white/[0.05] text-white/25 hover:border-white/[0.1] hover:text-white/45"
                  }`}
                >
                  {wp.label}
                </button>
              ))}
            </div>
          </div>
        </ProfileSection>

        {/* ── Section 3: Diet & Preferences ── */}
        <ProfileSection title="Diet & Preferences" icon={Leaf}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <InputField
                icon={<Leaf className="w-3.5 h-3.5 text-lime-400/60" />}
                label="Diet preference"
              >
                <select
                  {...form.register('diet_preferences')}
                  className="select-clean w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-lime-400/25 transition-all appearance-none cursor-pointer [&>option]:bg-[#0a0f0a]"
                >
                  <option value="Standard">Standard</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Pescatarian">Pescatarian</option>
                  <option value="Keto">Ketogenic</option>
                  <option value="Paleo">Paleo</option>
                </select>
              </InputField>

              <InputField
                icon={<Globe className="w-3.5 h-3.5 text-lime-400/60" />}
                label="Cuisine preferences"
              >
                <input
                  type="text"
                  {...form.register('cuisine_preferences')}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/[0.08] focus:outline-none focus:border-lime-400/25 transition-all font-medium"
                  placeholder="Italian, Mexican, Asian..."
                />
              </InputField>
            </div>

            <div className="space-y-4">
              <InputField
                icon={<ShieldCheck className="w-3.5 h-3.5 text-red-400/60" />}
                label="Allergies"
              >
                <input
                  type="text"
                  {...form.register('allergies')}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/[0.08] focus:outline-none focus:border-red-400/25 transition-all font-medium"
                  placeholder="Peanuts, Gluten..."
                />
              </InputField>

              <InputField
                icon={<Stethoscope className="w-3.5 h-3.5 text-orange-400/60" />}
                label="Injuries / Limitations"
              >
                <input
                  type="text"
                  {...form.register('injuries')}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/[0.08] focus:outline-none focus:border-orange-400/25 transition-all font-medium"
                  placeholder="Bad knee, lower back..."
                />
              </InputField>
            </div>
          </div>
        </ProfileSection>

        {/* ── Save Footer ── */}
        <div className="pt-6 pb-4 flex items-center justify-between gap-4 border-t border-white/[0.04]">
          <AnimatePresence mode="wait">
            {saveSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-lime-400 flex-1 min-w-0"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium truncate">Saved successfully</span>
              </motion.div>
            ) : (
              <motion.span
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/20"
              >
                Changes apply to your next generated plan.
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold text-sm tracking-wide transition-all hover:bg-lime-300 hover:shadow-lg hover:shadow-lime-400/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Sub-components ── */

function ProfileSection({
  title, icon: Icon, children
}: {
  title: string; icon: React.ElementType; children: React.ReactNode
}) {
  return (
    <section className="p-5 sm:p-6 md:p-8 rounded-2xl bg-white/[0.015] border border-white/[0.05] relative overflow-hidden">
      {/* Subtle corner glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-lime-400/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-6 relative z-10">
        <div className="p-1.5 rounded-lg bg-lime-400/[0.06]">
          <Icon className="w-4 h-4 text-lime-400/70" strokeWidth={1.8} />
        </div>
        <h2 className="text-base font-semibold text-white/80 tracking-tight">{title}</h2>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function InputField({
  icon, label, children
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        {icon}
        <label className="text-[0.65rem] font-medium text-white/30 tracking-wide uppercase">{label}</label>
      </div>
      {children}
    </div>
  );
}
