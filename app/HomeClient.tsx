"use client";

import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Activity,
  ChevronRight,
  ClipboardList,
  Brain,
  ShoppingBasket,
  Clock,
  Flame,
  Droplets,
  Wheat,
  Quote,
  Shield,
  Zap,
  Heart,
} from "lucide-react";
import { useRef } from "react";

export function HomeClient() {
  const { isSignedIn } = useUser();
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="flex flex-col items-center w-full pb-10">
      <div className="flex-1 flex flex-col items-center relative px-6 overflow-hidden w-full">
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto text-center pt-16 md:pt-28"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(2.5rem,6vw,5rem)] font-bold text-white leading-[1.08] tracking-[-0.03em] mb-6"
          >
            Nutrition that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400">
                understands
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-[0.12em] bg-gradient-to-r from-lime-400/40 to-emerald-400/40 rounded-full" />
            </span>
            <br />
            your body.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#7a8a7a] mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Share your goals, allergies, and lifestyle. Our AI analyzes your
            unique profile and generates a hyper-personalized 7-day meal plan —
            down to the grocery list.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="group relative flex items-center gap-3 px-8 py-4 text-base font-semibold text-[#060b06] bg-lime-400 rounded-full hover:bg-lime-300 transition-all hover:shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="group relative flex items-center gap-3 px-8 py-4 text-base font-semibold text-[#060b06] bg-lime-400 rounded-full hover:bg-lime-300 transition-all hover:shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Create Your Plan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              href="#features"
              className="group flex items-center gap-2 px-7 py-4 text-base font-medium text-[#8a9a8a] hover:text-white rounded-full border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all backdrop-blur-sm"
            >
              How it works
              <ChevronRight className="w-4 h-4 text-[#5a6a5a] group-hover:text-lime-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>

          {/* Stats ribbon */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-8 md:gap-14 mt-16 pt-10 border-t border-white/[0.04]"
          >
            {[
              { value: "7-Day", label: "Meal Plans" },
              { value: "100%", label: "Personalized" },
              { value: "AI", label: "Precision" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-[#5a6a5a] mt-1 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Feature Cards ── */}
        <motion.div
          id="features"
          className="relative z-10 w-full max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-5 pb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-lime-400/[0.12] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-lime-400/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-lime-400/[0.08] border border-lime-400/[0.12] flex items-center justify-center mb-6 text-lime-400 group-hover:bg-lime-400/[0.12] group-hover:border-lime-400/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6a7a6a] leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION: How It Works — vertical timeline
        ═══════════════════════════════════════════════ */}
        <div
          ref={howItWorksRef}
          className="relative z-10 w-full max-w-5xl mx-auto pt-8 pb-32"
        >
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-medium text-lime-400/80 uppercase tracking-[0.2em] mb-4"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              Three steps to your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400">
                perfect plan
              </span>
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Animated vertical line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/[0.04]">
              <motion.div
                className="w-full bg-gradient-to-b from-lime-400/60 via-lime-400/30 to-transparent"
                style={{ height: lineHeight }}
              />
            </div>

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                className={`relative flex items-start gap-8 md:gap-16 mb-20 last:mb-0 ${
                  idx % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: { opacity: 0, x: idx % 2 === 0 ? -30 : 30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.7,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  },
                }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#060b06] border-2 border-lime-400/50 z-10 mt-2">
                  <div className="absolute inset-0 rounded-full bg-lime-400/20 animate-ping" />
                </div>

                {/* Content */}
                <div
                  className={`pl-16 md:pl-0 md:w-1/2 ${
                    idx % 2 === 0 ? "md:pr-16" : "md:pl-16"
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-2 mb-4 ${
                      idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-xs font-bold text-lime-400/70 tracking-wider">
                      0{idx + 1}
                    </span>
                    <div className="w-8 h-px bg-lime-400/20" />
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-lime-400/[0.06] border border-lime-400/10 flex items-center justify-center mb-5 text-lime-400 ${
                      idx % 2 !== 0 ? "md:ml-auto" : ""
                    }`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6a7a6a] leading-relaxed font-light max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION: Sample Meal Plan Preview
        ═══════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-6xl mx-auto pb-32">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-medium text-lime-400/80 uppercase tracking-[0.2em] mb-4"
            >
              Preview
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5"
            >
              A day in your plan
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[#6a7a6a] max-w-lg mx-auto font-light"
            >
              Every meal is calculated, balanced, and tailored. Here&apos;s what
              a single day looks like.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {sampleMeals.map((meal, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.05] hover:border-lime-400/[0.1] transition-all duration-300"
              >
                {/* Colored top bar */}
                <div
                  className="h-1"
                  style={{
                    background: `linear-gradient(90deg, ${meal.color}40, ${meal.color}15)`,
                  }}
                />

                <div className="p-6 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border"
                      style={{
                        color: meal.color,
                        borderColor: `${meal.color}25`,
                        backgroundColor: `${meal.color}08`,
                      }}
                    >
                      {meal.label}
                    </span>
                    <div className="flex items-center gap-1 text-[#4a5a4a]">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-medium">
                        {meal.time}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">
                    {meal.name}
                  </h4>
                  <p className="text-xs text-[#5a6a5a] leading-relaxed mb-5 font-light">
                    {meal.description}
                  </p>

                  {/* Macro bar */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400/70" />
                      <span className="text-[10px] font-medium text-[#7a8a7a]">
                        {meal.macros.cal}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400/70" />
                      <span className="text-[10px] font-medium text-[#7a8a7a]">
                        {meal.macros.protein}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wheat className="w-3 h-3 text-amber-400/70" />
                      <span className="text-[10px] font-medium text-[#7a8a7a]">
                        {meal.macros.carbs}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Total macros summary */}
          <motion.div
            className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-sm font-medium text-white">
                Daily Total
              </span>
            </div>
            <div className="flex items-center gap-6 md:gap-10">
              {[
                { label: "Calories", value: "2,150 kcal", color: "text-orange-400/80" },
                { label: "Protein", value: "142g", color: "text-blue-400/80" },
                { label: "Carbs", value: "245g", color: "text-amber-400/80" },
                { label: "Fat", value: "78g", color: "text-lime-400/80" },
              ].map((macro) => (
                <div key={macro.label} className="text-center">
                  <p className={`text-sm font-semibold ${macro.color}`}>
                    {macro.value}
                  </p>
                  <p className="text-[10px] text-[#4a5a4a] mt-0.5">
                    {macro.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION: Testimonials
        ═══════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-6xl mx-auto pb-32">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-medium text-lime-400/80 uppercase tracking-[0.2em] mb-4"
            >
              Testimonials
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              Loved by people who
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400">
                take health seriously
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-all duration-300"
              >
                <Quote className="w-5 h-5 text-lime-400/20 mb-5" />
                <p className="text-sm text-[#8a9a8a] leading-relaxed mb-6 font-light">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.04]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold tracking-tight"
                    style={{
                      background: `linear-gradient(135deg, ${t.avatarColor}30, ${t.avatarColor}10)`,
                      color: t.avatarColor,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-[11px] text-[#4a5a4a]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION: Why Trust Us — horizontal features
        ═══════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-6xl mx-auto pb-32">
          <motion.div
            className="rounded-3xl border border-white/[0.05] overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-10 md:p-14 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
                {trustItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-lime-400/[0.06] border border-lime-400/10 flex items-center justify-center mb-5 text-lime-400">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5a6a5a] leading-relaxed font-light flex-1">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION: Final CTA
        ═══════════════════════════════════════════════ */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto pb-32 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-lime-400/[0.04] rounded-full blur-[120px] pointer-events-none" />

          <motion.p
            variants={itemVariants}
            className="text-xs font-medium text-lime-400/80 uppercase tracking-[0.2em] mb-6"
          >
            Get Started
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5"
          >
            Ready to eat smarter?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-[#6a7a6a] max-w-lg mx-auto mb-10 font-light"
          >
            Join thousands who stopped guessing and started fueling their bodies
            with precision. Your first plan is free.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="group relative flex items-center gap-3 px-9 py-4 text-base font-semibold text-[#060b06] bg-lime-400 rounded-full hover:bg-lime-300 transition-all hover:shadow-[0_0_50px_rgba(163,230,53,0.25)] hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {isSignedIn ? "Go to Dashboard" : "Start for Free"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-xs text-[#4a5a4a]">
              No credit card required
            </span>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

/* ── Static Data ── */

const features = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Metrics Driven",
    desc: "We analyze your age, weight, and activity level to calculate the exact macros your body needs — no guesswork involved.",
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    title: "Allergy Conscious",
    desc: "Every ingredient is strict-filtered against your allergies and dislikes. Your plan is safe by default, always.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI Precision",
    desc: "Powered by advanced AI, you get hyper-specific recipes and grocery lists tailored to your preferred cuisine.",
  },
];

const steps = [
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Tell us about yourself",
    desc: "Enter your age, weight, height, activity level, health goals, allergies, and cuisine preferences. It takes less than two minutes.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI builds your plan",
    desc: "Our AI analyzes your profile, calculates exact macros, and generates a complete 7-day meal plan with recipes and portions tailored to you.",
  },
  {
    icon: <ShoppingBasket className="w-5 h-5" />,
    title: "Cook, eat, repeat",
    desc: "Follow your day-by-day plan with detailed recipes and auto-generated grocery lists. Regenerate anytime your goals change.",
  },
];

const sampleMeals = [
  {
    label: "Breakfast",
    time: "8:00 AM",
    name: "Spinach & Feta Egg Wrap",
    description:
      "Whole-wheat wrap with scrambled eggs, fresh spinach, crumbled feta, and a drizzle of hot sauce.",
    color: "#facc15",
    macros: { cal: "420 kcal", protein: "28g", carbs: "38g" },
  },
  {
    label: "Lunch",
    time: "12:30 PM",
    name: "Grilled Chicken Bowl",
    description:
      "Brown rice, grilled chicken thigh, roasted sweet potato, avocado, and a lime-tahini dressing.",
    color: "#a3e635",
    macros: { cal: "680 kcal", protein: "48g", carbs: "62g" },
  },
  {
    label: "Snack",
    time: "4:00 PM",
    name: "Greek Yogurt & Berries",
    description:
      "Full-fat Greek yogurt topped with mixed berries, a handful of walnuts, and raw honey.",
    color: "#38bdf8",
    macros: { cal: "280 kcal", protein: "18g", carbs: "30g" },
  },
  {
    label: "Dinner",
    time: "7:30 PM",
    name: "Salmon with Roasted Veg",
    description:
      "Pan-seared salmon fillet over a bed of roasted broccoli, bell pepper, and quinoa.",
    color: "#f472b6",
    macros: { cal: "770 kcal", protein: "48g", carbs: "55g" },
  },
];

const testimonials = [
  {
    quote:
      "I've tried five different meal planning apps. This is the first one that actually accounts for my dairy allergy AND gives me meals I want to eat.",
    name: "Priya Sharma",
    role: "Software Engineer",
    initials: "PS",
    avatarColor: "#a3e635",
  },
  {
    quote:
      "The macro precision is insane. I hit my protein target every single day last week without even thinking about it. The grocery list feature is a game-changer.",
    name: "Marcus Chen",
    role: "Fitness Coach",
    initials: "MC",
    avatarColor: "#38bdf8",
  },
  {
    quote:
      "As a busy mom of two, I don't have time to plan meals. WellNourish AI gave me a full week of family-friendly dinners in under 30 seconds.",
    name: "Aisha Patel",
    role: "Product Designer",
    initials: "AP",
    avatarColor: "#f472b6",
  },
];

const trustItems = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Privacy First",
    desc: "Your health data stays yours. We never sell personal information and all metrics are encrypted at rest.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Instant Generation",
    desc: "Plans are generated in seconds, not minutes. Regenerate as many times as you need — there are no limits.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Science Backed",
    desc: "Macro calculations follow established nutritional science guidelines adapted to your specific body composition and goals.",
  },
];
