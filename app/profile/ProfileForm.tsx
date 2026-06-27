"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    },
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
        className="inline-flex items-center gap-2 mb-8 text-sm font-medium group transition-colors"
        style={{ color: "#2a3a2a" }}
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span className="group-hover:text-white transition-colors">Dashboard</span>
      </Link>

      {/* Page header */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] mb-2"
          style={{ color: "rgba(180,245,90,0.7)" }}
        >
          Profile
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Your Body &amp; Goals
        </h1>
        <p className="text-sm mt-1" style={{ color: "#3a4a3a" }}>
          Changes apply to your next generated plan.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

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
              <div
                key={field.id}
                className="p-4 rounded-xl"
                style={{
                  background:
                    field.id === "target_weight"
                      ? "rgba(180,245,90,0.025)"
                      : "rgba(255,255,255,0.025)",
                  border:
                    field.id === "target_weight"
                      ? "1px solid rgba(180,245,90,0.07)"
                      : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <field.icon className="w-3 h-3" style={{ color: "#2a3a2a" }} strokeWidth={1.5} />
                  <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#2a3a2a" }}>
                    {field.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step={field.id.includes("weight") ? "0.1" : "1"}
                    {...form.register(field.id as keyof ProfileFormValues, { valueAsNumber: true })}
                    className="w-full bg-transparent text-lg font-bold text-white focus:outline-none placeholder:text-white/5"
                    style={{ fontFamily: "inherit" }}
                  />
                  <span className="text-[9px] font-medium uppercase shrink-0" style={{ color: "#2a3a2a" }}>
                    {field.suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 2: Activity & Goals ── */}
        <Section title="Activity &amp; Goals" icon={Activity}>
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
                  onClick={() =>
                    form.setValue(
                      "activity_level",
                      item.val as ProfileFormValues["activity_level"]
                    )
                  }
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
                  onClick={() =>
                    form.setValue("weekly_goal", wp.val as ProfileFormValues["weekly_goal"])
                  }
                  className="px-3.5 py-2 text-xs font-semibold transition-all"
                  style={{
                    borderRadius: "10px",
                    ...(currentWeeklyGoal === wp.val
                      ? {
                          background: "rgba(180,245,90,0.08)",
                          border: "1px solid rgba(180,245,90,0.22)",
                          color: "#b4f55a",
                        }
                      : {
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          color: "#3a4a3a",
                        }),
                  }}
                >
                  {wp.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Section 3: Preferences ── */}
        <Section title="Preferences" icon={Leaf}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={<Leaf className="w-3.5 h-3.5" />} label="Diet">
              <select
                {...form.register("diet_preferences")}
                className="w-full text-sm font-medium text-white focus:outline-none appearance-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(180,245,90,0.25)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(180,245,90,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="Standard" style={{ background: "#0a0f0a" }}>Standard</option>
                <option value="Vegetarian" style={{ background: "#0a0f0a" }}>Vegetarian</option>
                <option value="Vegan" style={{ background: "#0a0f0a" }}>Vegan</option>
                <option value="Pescatarian" style={{ background: "#0a0f0a" }}>Pescatarian</option>
                <option value="Keto" style={{ background: "#0a0f0a" }}>Ketogenic</option>
                <option value="Paleo" style={{ background: "#0a0f0a" }}>Paleo</option>
              </select>
            </InputField>

            <InputField icon={<Globe className="w-3.5 h-3.5" />} label="Cuisine">
              <input
                type="text"
                {...form.register("cuisine_preferences")}
                placeholder="Italian, Mexican, Asian..."
                className="w-full text-sm font-medium text-white focus:outline-none placeholder:text-white/10"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(180,245,90,0.25)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(180,245,90,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </InputField>

            <InputField icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Allergies" accent="red">
              <input
                type="text"
                {...form.register("allergies")}
                placeholder="Peanuts, Gluten..."
                className="w-full text-sm font-medium text-white focus:outline-none placeholder:text-white/10"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(239,68,68,0.07)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </InputField>

            <InputField icon={<Stethoscope className="w-3.5 h-3.5" />} label="Injuries / Limitations" accent="orange">
              <input
                type="text"
                {...form.register("injuries")}
                placeholder="Bad knee, lower back..."
                className="w-full text-sm font-medium text-white focus:outline-none placeholder:text-white/10"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(251,146,60,0.25)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(251,146,60,0.07)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </InputField>
          </div>
        </Section>

        {/* ── Save Footer ── */}
        <div className="flex items-center justify-between gap-4 pt-2 pb-4">
          {/* Left: hint or success */}
          <div style={{ transition: "opacity 0.3s" }}>
            {saveSuccess ? (
              <div className="flex items-center gap-2" style={{ color: "#b4f55a" }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Saved!</span>
              </div>
            ) : (
              <span className="text-xs" style={{ color: "#2a3a2a" }}>
                Applies to next generated plan.
              </span>
            )}
          </div>

          {/* Right: Save button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 font-semibold text-sm transition-all"
            style={{
              background: "#b4f55a",
              color: "#050a05",
              borderRadius: "12px",
              padding: "10px 20px",
              opacity: isSubmitting ? 0.5 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting)
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 24px rgba(180,245,90,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
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
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
          paddingBottom: "14px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Icon style={{ width: 14, height: 14, color: "#b4f55a" }} strokeWidth={1.8} />
        <h2 style={{ fontSize: "13px", fontWeight: 600, color: "white", margin: 0 }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#2a3a2a",
        marginBottom: "10px",
      }}
    >
      {children}
    </p>
  );
}

function Chip({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "10px 12px",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.15s",
        ...(active
          ? {
              background: "rgba(180,245,90,0.08)",
              border: "1px solid rgba(180,245,90,0.25)",
              color: "white",
            }
          : {
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#4a5a4a",
            }),
      }}
    >
      <Icon
        style={{
          width: 14,
          height: 14,
          color: active ? "#b4f55a" : "#2a3a2a",
          flexShrink: 0,
        }}
        strokeWidth={1.8}
      />
      <span style={{ fontSize: "12px", fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function InputField({
  icon,
  label,
  children,
  accent = "lime",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  accent?: string;
}) {
  const iconColorMap: Record<string, string> = {
    lime: "#2a3a2a",
    red: "rgba(239,68,68,0.5)",
    orange: "rgba(251,146,60,0.5)",
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span style={{ color: iconColorMap[accent] || iconColorMap.lime }}>{icon}</span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#2a3a2a",
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
