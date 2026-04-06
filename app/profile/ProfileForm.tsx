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
    <div className="max-w-3xl w-full mx-auto">
      {/* Back navigation */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-white/25 hover:text-white/50 transition-colors mb-8 text-sm font-medium group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Dashboard
      </Link>

      {/* Page title */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-[0.2em] mb-2">Profile</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Your Body & Goals</h1>
        <p className="text-sm text-white/25 mt-1">Fine-tune your metrics. Changes apply to your next plan.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Section 1: Body Metrics ── */}
        <Section title="Body Metrics" icon={Scale}>
          {/* Gender */}
          <div className="mb-5">
            <Label>Gender</Label>
            <div className="grid grid-cols-3 gap-2">
              <Chip icon={Mars} label="Male" active={currentGender === "Male"} onClick={() => form.setValue("gender", "Male")} />
              <Chip icon={Venus} label="Female" active={currentGender === "Female"} onClick={() => form.setValue("gender", "Female")} />
              <Chip icon={User} label="Other" active={currentGender === "Other"} onClick={() => form.setValue("gender", "Other")} />
            </div>
          </div>

          {/* Metric inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              { id: "age", label: "Age", icon: Calendar, suffix: "yrs" },
              { id: "weight_kg", label: "Weight", icon: Scale, suffix: "kg" },
              { id: "height_cm", label: "Height", icon: Ruler, suffix: "cm" },
              { id: "target_weight", label: "Goal Weight", icon: Target, suffix: "kg" },
            ].map((field) => (
              <div key={field.id} className={`p-3.5 rounded-xl border transition-all ${
                field.id === "target_weight"
                  ? "bg-lime-400/[0.02] border-lime-400/[0.08]"
                  : "bg-white/[0.02] border-white/[0.05]"
              }`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <field.icon className="w-3 h-3 text-white/15" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium text-white/20 tracking-wider uppercase">{field.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step={field.id.includes('weight') ? "0.1" : "1"}
                    {...form.register(field.id as keyof ProfileFormValues, { valueAsNumber: true })}
                    className="w-full bg-transparent text-lg font-bold text-white focus:outline-none placeholder:text-white/[0.05] rounded"
                  />
                  <span className="text-[9px] font-medium text-white/12 uppercase shrink-0">{field.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 2: Activity & Goals ── */}
        <Section title="Activity & Goals" icon={Activity}>
          {/* Activity Level */}
          <div className="mb-5">
            <Label>Activity level</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { val: "Sedentary", label: "Sedentary", icon: User },
                { val: "Light", label: "Light", icon: Activity },
                { val: "Moderate", label: "Moderate", icon: Zap },
                { val: "Active", label: "Active", icon: Flame },
                { val: "Very Active", label: "Intense", icon: Sparkles },
              ].map((item) => (
                <Chip
                  key={item.val}
                  icon={item.icon}
                  label={item.label}
                  active={currentActivityLevel === item.val}
                  onClick={() => form.setValue("activity_level", item.val as ProfileFormValues["activity_level"])}
                />
              ))}
            </div>
          </div>

          {/* Health Goal */}
          <div className="mb-5">
            <Label>Primary goal</Label>
            <div className="grid grid-cols-3 gap-2">
              <Chip icon={TrendingDown} label="Lose Weight" active={currentHealthGoal === "Lose Weight"} onClick={() => form.setValue("health_goal", "Lose Weight")} />
              <Chip icon={Heart} label="Maintain" active={currentHealthGoal === "Maintain"} onClick={() => form.setValue("health_goal", "Maintain")} />
              <Chip icon={Zap} label="Gain Muscle" active={currentHealthGoal === "Gain Muscle"} onClick={() => form.setValue("health_goal", "Gain Muscle")} />
            </div>
          </div>

          {/* Weekly Pace */}
          <div>
            <Label>Weekly pace</Label>
            <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all border ${
                    currentWeeklyGoal === wp.val
                      ? "bg-lime-400/10 border-lime-400/25 text-lime-400"
                      : "bg-white/[0.02] border-white/[0.05] text-white/25 hover:border-white/[0.1] hover:text-white/40"
                  }`}
                >
                  {wp.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Section 3: Diet & Preferences ── */}
        <Section title="Preferences" icon={Leaf}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={<Leaf className="w-3.5 h-3.5" />} label="Diet">
              <select
                {...form.register('diet_preferences')}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-lime-400/20 transition-all appearance-none cursor-pointer [&>option]:bg-[#0a0f0a]"
              >
                <option value="Standard">Standard</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Keto">Ketogenic</option>
                <option value="Paleo">Paleo</option>
              </select>
            </InputField>

            <InputField icon={<Globe className="w-3.5 h-3.5" />} label="Cuisine">
              <input
                type="text"
                {...form.register('cuisine_preferences')}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-lime-400/20 transition-all font-medium"
                placeholder="Italian, Mexican, Asian..."
              />
            </InputField>

            <InputField icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Allergies" accent="red">
              <input
                type="text"
                {...form.register('allergies')}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-red-400/20 transition-all font-medium"
                placeholder="Peanuts, Gluten..."
              />
            </InputField>

            <InputField icon={<Stethoscope className="w-3.5 h-3.5" />} label="Injuries" accent="orange">
              <input
                type="text"
                {...form.register('injuries')}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-orange-400/20 transition-all font-medium"
                placeholder="Bad knee, lower back..."
              />
            </InputField>
          </div>
        </Section>

        {/* ── Save Footer ── */}
        <div className="flex items-center justify-between gap-4 pt-2 pb-4">
          <AnimatePresence mode="wait">
            {saveSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-400 flex-1 min-w-0"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium truncate">Saved</span>
              </motion.div>
            ) : (
              <motion.span
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/15"
              >
                Applies to next generated plan.
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-black font-semibold text-sm transition-all hover:bg-lime-300 active:scale-[0.98] disabled:opacity-50"
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

function Section({
  title, icon: Icon, children
}: {
  title: string; icon: React.ElementType; children: React.ReactNode
}) {
  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4 text-white/20" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold text-white/60 tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium text-white/25 tracking-wider uppercase mb-2.5">{children}</p>
  );
}

function Chip({
  icon: Icon, label, active, onClick
}: {
  icon: React.ElementType; label: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all w-full cursor-pointer ${
        active
          ? "bg-lime-400/[0.07] border-lime-400/30 text-white"
          : "bg-white/[0.02] border-white/[0.05] text-white/30 hover:border-white/[0.1] hover:text-white/50"
      }`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-lime-400" : "text-white/20"}`} strokeWidth={1.8} />
      <span className="text-xs font-medium truncate">{label}</span>
    </button>
  );
}

function InputField({
  icon, label, children, accent = "lime"
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode; accent?: string
}) {
  const colorMap: Record<string, string> = {
    lime: "text-white/25",
    red: "text-red-400/40",
    orange: "text-orange-400/40",
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className={colorMap[accent] || colorMap.lime}>{icon}</span>
        <span className="text-[10px] font-medium text-white/25 tracking-wider uppercase">{label}</span>
      </div>
      {children}
    </div>
  );
}
