"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
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
  ChevronRight,
  ShieldCheck,
  Heart,
  Globe,
  Stethoscope,
  Leaf,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SelectionCard } from "@/components/onboarding/SelectionCard";

const onboardingSchema = z.object({
  age: z.number().int().min(1, "Must be at least 1"),
  gender: z.enum(["Male", "Female", "Other"]),
  weight_kg: z.number().positive("Must be greater than 0"),
  height_cm: z.number().positive("Must be greater than 0"),
  target_weight: z.number().positive().nullish(), // matches both null and undefined
  activity_level: z.enum(["Sedentary", "Light", "Moderate", "Active", "Very Active"]),
  health_goal: z.enum(["Lose Weight", "Maintain", "Gain Muscle"]),
  weekly_goal: z.enum(["0.25kg", "0.5kg", "1kg", "Maintain"]),
  cuisine_preferences: z.string().nullish(),
  diet_preferences: z.string().nullish(),
  allergies: z.string().nullish(),
  injuries: z.string().nullish(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const steps = [
  { id: "step1", title: "Body Metrics", icon: Scale, num: "01" },
  { id: "step2", title: "Lifestyle", icon: Activity, num: "02" },
  { id: "step3", title: "Preferences", icon: Leaf, num: "03" }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  useUser();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gender: "Male",
      activity_level: "Moderate",
      health_goal: "Maintain",
      weekly_goal: "Maintain",
      diet_preferences: "Standard",
    }
  });

  const { watch, setValue } = form;
  const currentGender = watch("gender");
  const currentActivityLevel = watch("activity_level");
  const currentHealthGoal = watch("health_goal");
  const currentWeeklyGoal = watch("weekly_goal");

  const processForm = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Clean data: convert NaN to null and ensure all fields are ready for JSON
    const formattedData = {
      ...data,
      target_weight: typeof data.target_weight === 'number' && !isNaN(data.target_weight) ? data.target_weight : null,
      age: Number(data.age),
      weight_kg: Number(data.weight_kg),
      height_cm: Number(data.height_cm),
    };

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "Failed to save metrics";
        setSubmitError(errorMessage);
      }
    } catch {
      setSubmitError("A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    type FieldName = keyof OnboardingFormValues;
    let fieldsToValidate: FieldName[] = [];
    if (currentStep === 0) fieldsToValidate = ['age', 'gender', 'weight_kg', 'height_cm', 'target_weight'];
    if (currentStep === 1) fieldsToValidate = ['activity_level', 'health_goal', 'weekly_goal'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setSubmitError(null);
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col pt-8 pb-24 px-5 w-full max-w-4xl mx-auto">

      {/* Step Progress */}
      <nav className="mb-12">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <button
                type="button"
                disabled={idx > currentStep}
                onClick={() => idx < currentStep && setCurrentStep(idx)}
                className={`flex items-center gap-2.5 w-full py-2.5 px-3.5 rounded-xl transition-all duration-300 ${
                  idx === currentStep
                    ? "bg-lime-400/10 border border-lime-400/25"
                    : idx < currentStep
                      ? "text-lime-400/60 hover:bg-white/[0.03] cursor-pointer"
                      : "text-white/15 cursor-default"
                }`}
              >
                <span className={`text-[0.65rem] font-semibold tabular-nums ${
                  idx === currentStep ? "text-lime-400" : idx < currentStep ? "text-lime-400/50" : "text-white/15"
                }`}>{step.num}</span>
                <span className={`text-xs font-medium tracking-wide ${
                  idx === currentStep ? "text-white/90" : idx < currentStep ? "text-white/35" : "text-white/15"
                }`}>{step.title}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-6 h-px mx-1 flex-shrink-0 ${idx < currentStep ? "bg-lime-400/30" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Header */}
      <header className="mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/[0.06] border border-lime-400/15 mb-5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-breathe" />
          <span className="text-[0.7rem] font-medium text-lime-400/80 tracking-wide">Step {currentStep + 1} of {steps.length}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-tight"
        >
          Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">Profile</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-white/35 max-w-lg mx-auto leading-relaxed"
        >
          We&apos;ll use these details to craft a personalized nutrition plan tailored to your body and goals.
        </motion.p>
      </header>

      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-red-400 text-sm flex items-center gap-3"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{submitError}</span>
        </motion.div>
      )}

      <form onSubmit={form.handleSubmit(processForm)} className="relative min-h-[480px]">
        <AnimatePresence mode="wait">

          {/* ============ STEP 1: Body Metrics ============ */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="space-y-10"
            >
              {/* Gender Selection */}
              <section>
                <SectionLabel icon={User} label="Gender" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <SelectionCard
                    icon={Mars}
                    title="Male"
                    selected={currentGender === "Male"}
                    onClick={() => setValue("gender", "Male")}
                    compact
                  />
                  <SelectionCard
                    icon={Venus}
                    title="Female"
                    selected={currentGender === "Female"}
                    onClick={() => setValue("gender", "Female")}
                    compact
                  />
                  <SelectionCard
                    icon={User}
                    title="Other"
                    selected={currentGender === "Other"}
                    onClick={() => setValue("gender", "Other")}
                    compact
                  />
                </div>
              </section>

              {/* Biological Metrics */}
              <section>
                <SectionLabel icon={Activity} label="Your measurements" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {[
                    { id: "age", label: "Age", icon: Calendar, placeholder: "28", suffix: "yrs" },
                    { id: "weight_kg", label: "Weight", icon: Scale, placeholder: "75.0", suffix: "kg" },
                    { id: "height_cm", label: "Height", icon: Ruler, placeholder: "180", suffix: "cm" },
                    { id: "target_weight", label: "Goal Weight", icon: Target, placeholder: "70.0", suffix: "kg" },
                  ].map((field, i) => (
                    <div
                      key={field.id}
                      className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                        field.id === "target_weight"
                          ? "bg-lime-400/[0.03] border-lime-400/15 hover:border-lime-400/25"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <field.icon className={`w-3.5 h-3.5 ${field.id === "target_weight" ? "text-lime-400/60" : "text-white/25"}`} strokeWidth={1.5} />
                        <label className="text-[0.65rem] font-medium text-white/30 tracking-wider uppercase">{field.label}</label>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <input
                          type="number"
                          step={field.id.includes('weight') ? "0.1" : "1"}
                          {...form.register(field.id as keyof OnboardingFormValues, { valueAsNumber: true })}
                          className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none transition-all placeholder:text-white/[0.06] input-glow rounded-lg"
                          placeholder={field.placeholder}
                        />
                        <span className="text-xs font-medium text-white/15 uppercase shrink-0">{field.suffix}</span>
                      </div>
                      {form.formState.errors[field.id as keyof OnboardingFormValues] && (
                        <div className="absolute -bottom-1.5 left-5 px-2 py-0.5 rounded-md bg-red-500/90 text-[0.6rem] font-semibold text-white tracking-tight">
                          Required
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Optional label hint */}
                <p className="mt-3 text-[0.65rem] text-white/15 flex items-center gap-1.5 ml-1">
                  <Target className="w-3 h-3 text-lime-400/30" />
                  Goal weight is optional — leave blank to skip
                </p>
              </section>
            </motion.div>
          )}

          {/* ============ STEP 2: Lifestyle ============ */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="space-y-10"
            >
              {/* Activity Level */}
              <section>
                <SectionLabel icon={Zap} label="Activity level" />
                <p className="text-xs text-white/25 mt-1 mb-4">How often do you exercise in a typical week?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { val: "Sedentary", label: "Sedentary", desc: "Desk job, no exercise", icon: User },
                    { val: "Light", label: "Light", desc: "1-3 days/wk", icon: Activity },
                    { val: "Moderate", label: "Moderate", desc: "3-5 days/wk", icon: Zap },
                    { val: "Active", label: "Active", desc: "6-7 days/wk", icon: Flame },
                    { val: "Very Active", label: "Intense", desc: "Athlete-level", icon: Sparkles },
                  ].map((item) => (
                    <SelectionCard
                      key={item.val}
                      icon={item.icon}
                      title={item.label}
                      description={item.desc}
                      selected={currentActivityLevel === item.val}
                      onClick={() => setValue("activity_level", item.val as OnboardingFormValues["activity_level"])}
                    />
                  ))}
                </div>
              </section>

              {/* Health Goal */}
              <section>
                <SectionLabel icon={Target} label="Primary goal" />
                <p className="text-xs text-white/25 mt-1 mb-4">What are you working toward?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <SelectionCard
                    icon={TrendingDown}
                    title="Lose Weight"
                    description="Burn fat and get lean"
                    selected={currentHealthGoal === "Lose Weight"}
                    onClick={() => setValue("health_goal", "Lose Weight")}
                  />
                  <SelectionCard
                    icon={Heart}
                    title="Maintain"
                    description="Stay at current weight"
                    selected={currentHealthGoal === "Maintain"}
                    onClick={() => setValue("health_goal", "Maintain")}
                  />
                  <SelectionCard
                    icon={Zap}
                    title="Build Muscle"
                    description="Gain strength and size"
                    selected={currentHealthGoal === "Gain Muscle"}
                    onClick={() => setValue("health_goal", "Gain Muscle")}
                  />
                </div>
              </section>

              {/* Weekly Pace */}
              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-1">Weekly pace</h3>
                    <p className="text-xs text-white/25">How quickly do you want to progress?</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { val: "Maintain", label: "Maintain" },
                      { val: "0.25kg", label: "0.25 kg" },
                      { val: "0.5kg", label: "0.5 kg" },
                      { val: "1kg", label: "1 kg" },
                    ].map((wp) => (
                      <button
                        key={wp.val}
                        type="button"
                        onClick={() => setValue("weekly_goal", wp.val as OnboardingFormValues["weekly_goal"])}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border ${
                          currentWeeklyGoal === wp.val
                            ? "bg-lime-400/15 border-lime-400/30 text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.08)]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:border-white/[0.12] hover:text-white/50"
                        }`}
                      >
                        {wp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* ============ STEP 3: Preferences ============ */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-5">
                  <FormField
                    icon={<Leaf className="w-4 h-4 text-lime-400/70" />}
                    label="Diet preference"
                  >
                    <select
                      {...form.register('diet_preferences')}
                      className="select-clean w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-lime-400/30 transition-all appearance-none cursor-pointer [&>option]:bg-[#0a0f0a]"
                    >
                      <option value="Standard">Standard (No restrictions)</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Pescatarian">Pescatarian</option>
                      <option value="Keto">Ketogenic</option>
                      <option value="Paleo">Paleo</option>
                    </select>
                  </FormField>

                  <FormField
                    icon={<ShieldCheck className="w-4 h-4 text-red-400/70" />}
                    label="Allergies"
                    hint="Leave blank if none"
                  >
                    <textarea
                      {...form.register('allergies')}
                      rows={3}
                      className="custom-scroll w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/[0.08] focus:outline-none focus:border-red-400/25 transition-all font-medium resize-none"
                      placeholder="Peanuts, Shellfish, Dairy..."
                    />
                  </FormField>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <FormField
                    icon={<Globe className="w-4 h-4 text-lime-400/70" />}
                    label="Cuisine preferences"
                    hint="Your favorite food styles"
                  >
                    <textarea
                      {...form.register('cuisine_preferences')}
                      rows={3}
                      className="custom-scroll w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/[0.08] focus:outline-none focus:border-lime-400/25 transition-all font-medium resize-none"
                      placeholder="Mediterranean, Asian, Indian..."
                    />
                  </FormField>

                  <FormField
                    icon={<Stethoscope className="w-4 h-4 text-orange-400/70" />}
                    label="Injuries or limitations"
                    hint="Physical conditions to consider"
                  >
                    <textarea
                      {...form.register('injuries')}
                      rows={3}
                      className="custom-scroll w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/[0.08] focus:outline-none focus:border-orange-400/25 transition-all font-medium resize-none"
                      placeholder="Lower back pain, knee issues..."
                    />
                  </FormField>
                </div>
              </div>

              {/* Ready Banner */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lime-400/10 via-lime-400/[0.04] to-transparent" />
                <div className="relative p-6 flex items-center gap-5 border border-lime-400/15 rounded-2xl">
                  <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center shrink-0">
                    <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                      <Sparkles className="w-5 h-5 text-black" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">Almost there!</h3>
                    <p className="text-xs text-white/30">
                      Hit the button below to generate your personalized 7-day nutrition plan.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Footer */}
        <footer className="mt-16 pt-8 border-t border-white/[0.04] flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] text-white/35 hover:bg-white/[0.06] hover:text-white/60 transition-all text-xs font-medium tracking-wide"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
          ) : <div />}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-xl bg-white text-black hover:bg-lime-400 transition-all font-semibold text-sm tracking-wide shadow-lg hover:shadow-lime-400/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              type="submit"
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-lime-400 text-black hover:bg-lime-300 transition-all font-semibold text-sm tracking-wide shadow-lg shadow-lime-400/15 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate My Plan
                  <Zap className="w-4 h-4 fill-current" />
                </>
              )}
            </button>
          )}
        </footer>
      </form>
    </div>
  );
}

/* ── Shared Sub-components ── */

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded-lg bg-lime-400/[0.06]">
        <Icon className="w-3.5 h-3.5 text-lime-400/70" strokeWidth={1.8} />
      </div>
      <h2 className="text-sm font-semibold text-white/70 tracking-tight">{label}</h2>
    </div>
  );
}

function FormField({
  icon, label, hint, children
}: {
  icon: React.ReactNode; label: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-xs font-medium text-white/40 tracking-wide">{label}</label>
      </div>
      {hint && <p className="text-[0.65rem] text-white/15 -mt-1">{hint}</p>}
      {children}
    </div>
  );
}
