"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─────────────────────────────────────────────
   HERO INTERACTIVE CARD
───────────────────────────────────────────── */
function HeroCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [activeGoal, setActiveGoal] = useState(0);

  const goals = [
    { label: "Fat Loss", cal: "1,800", protein: "160g", carbs: "160g", fat: "60g", color: "#b4f55a" },
    { label: "Muscle Gain", cal: "2,800", protein: "210g", carbs: "280g", fat: "85g", color: "#34d399" },
    { label: "Maintenance", cal: "2,200", protein: "140g", carbs: "240g", fat: "75g", color: "#0ea5e9" },
  ];

  const goal = goals[activeGoal];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 6;
    const rotX = -((y - cy) / cy) * 5;

    gsap.to(cardRef.current, {
      rotateY: rotY,
      rotateX: rotX,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
    gsap.to(glowRef.current, {
      left: x,
      top: y,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGoal((g) => (g + 1) % goals.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const macros = [
    { label: "Calories", val: goal.cal, icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, color: "#fb923c" },
    { label: "Protein", val: goal.protein, icon: <Droplets className="w-3.5 h-3.5 text-blue-400" />, color: "#60a5fa" },
    { label: "Carbs", val: goal.carbs, icon: <Wheat className="w-3.5 h-3.5 text-amber-400" />, color: "#fbbf24" },
    { label: "Fat", val: goal.fat, icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />, color: "#34d399" },
  ];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm mx-auto cursor-pointer select-none"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="relative rounded-3xl overflow-hidden border"
        style={{
          background:
            "linear-gradient(135deg, rgba(180,245,90,0.07) 0%, rgba(5,10,5,0.8) 60%)",
          borderColor: "rgba(180,245,90,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Spotlight glow */}
        <div
          ref={glowRef}
          className="absolute w-40 h-40 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(180,245,90,0.12) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
          }}
        />

        {/* Card header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${goal.color}18`, border: `1px solid ${goal.color}30` }}
              >
                <Sparkles className="w-4 h-4" style={{ color: goal.color }} />
              </div>
              <span className="text-xs font-medium text-[#6a7a6a] uppercase tracking-widest">
                Daily Target
              </span>
            </div>
            <div className="flex gap-1.5">
              {goals.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGoal(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    background: i === activeGoal ? goal.color : "rgba(255,255,255,0.15)",
                    width: i === activeGoal ? "16px" : "6px",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-5xl font-bold tracking-tighter transition-all duration-500"
              style={{ color: goal.color }}
            >
              {goal.cal}
            </span>
            <span className="text-sm text-[#4a5a4a] font-medium">kcal</span>
          </div>
          <div
            className="text-xs font-semibold uppercase tracking-widest transition-all duration-500"
            style={{ color: `${goal.color}80` }}
          >
            {goal.label} Plan
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-6 h-px"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* Macro breakdown */}
        <div className="p-6 pt-4 grid grid-cols-3 gap-3">
          {macros.slice(1).map((m) => (
            <div
              key={m.label}
              className="rounded-2xl p-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="mb-2">{m.icon}</div>
              <div
                className="text-lg font-bold tracking-tight transition-all duration-500"
                style={{ color: m.color }}
              >
                {m.val}
              </div>
              <div className="text-[10px] text-[#4a5a4a] mt-0.5 uppercase tracking-wider">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Meal tags */}
        <div className="px-6 pb-6 flex flex-wrap gap-2">
          {["Breakfast", "Lunch", "Snack", "Dinner"].map((meal) => (
            <span
              key={meal}
              className="text-[10px] px-3 py-1 rounded-full font-medium"
              style={{
                background: "rgba(180,245,90,0.06)",
                color: "rgba(180,245,90,0.6)",
                border: "1px solid rgba(180,245,90,0.1)",
              }}
            >
              {meal}
            </span>
          ))}
        </div>

        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${goal.color}40, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    gsap.to(glowRef.current, {
      left: e.clientX - rect.left,
      top: e.clientY - rect.top,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="feature-card group relative rounded-2xl p-7 overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        ref={glowRef}
        className="absolute w-64 h-64 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(180,245,90,0.06) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
        }}
      />

      <div className="relative z-10">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
          style={{
            background: "rgba(180,245,90,0.07)",
            border: "1px solid rgba(180,245,90,0.12)",
            color: "#b4f55a",
          }}
        >
          {feature.icon}
        </div>

        <div
          className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
          style={{ color: "rgba(180,245,90,0.5)" }}
        >
          0{index + 1}
        </div>

        <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed font-light" style={{ color: "#5a6a5a" }}>
          {feature.desc}
        </p>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(180,245,90,0.3), transparent)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MEAL CARD
───────────────────────────────────────────── */
function MealCard({ meal }: { meal: (typeof sampleMeals)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="meal-card relative rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Top bar */}
      <div
        className="h-0.5"
        style={{
          background: `linear-gradient(90deg, ${meal.color}60, ${meal.color}20)`,
        }}
      />
      <div
        className="p-6"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
            style={{
              color: meal.color,
              background: `${meal.color}10`,
              border: `1px solid ${meal.color}25`,
            }}
          >
            {meal.label}
          </span>
          <div className="flex items-center gap-1.5" style={{ color: "#3a4a3a" }}>
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium">{meal.time}</span>
          </div>
        </div>

        <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">
          {meal.name}
        </h4>
        <p className="text-xs leading-relaxed mb-5 font-light" style={{ color: "#4a5a4a" }}>
          {meal.description}
        </p>

        <div
          className="flex items-center gap-3 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400/70" />
            <span className="text-[10px] font-medium" style={{ color: "#6a7a6a" }}>
              {meal.macros.cal}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400/70" />
            <span className="text-[10px] font-medium" style={{ color: "#6a7a6a" }}>
              {meal.macros.protein}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Wheat className="w-3 h-3 text-amber-400/70" />
            <span className="text-[10px] font-medium" style={{ color: "#6a7a6a" }}>
              {meal.macros.carbs}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HOME CLIENT
───────────────────────────────────────────── */
export function HomeClient() {
  const { isSignedIn } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const mealsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heroTextRef.current?.querySelectorAll(".hero-line") ?? [],
        { opacity: 0, y: 60, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, duration: 0.9 }
      )
        .fromTo(
          heroCtaRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          heroCardRef.current,
          { opacity: 0, x: 50, rotateY: -15 },
          { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          statsRef.current?.querySelectorAll(".stat-item") ?? [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
          "-=0.5"
        );

      // ── Features scroll-trigger
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            featuresRef.current?.querySelectorAll(".feature-card") ?? [],
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.7,
              ease: "power2.out",
            }
          );
        },
      });

      // ── How It Works — step reveal
      howItWorksRef.current?.querySelectorAll(".step-item").forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 82%",
          onEnter: () => {
            gsap.fromTo(
              step,
              { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
              { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
          },
        });
      });

      // ── Timeline line draw
      ScrollTrigger.create({
        trigger: howItWorksRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          const line = document.getElementById("timeline-line-fill");
          if (line) line.style.height = `${self.progress * 100}%`;
        },
      });

      // ── Meal cards
      ScrollTrigger.create({
        trigger: mealsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            mealsRef.current?.querySelectorAll(".meal-card") ?? [],
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.1,
              duration: 0.6,
              ease: "power2.out",
            }
          );
        },
      });

      // ── Testimonials
      ScrollTrigger.create({
        trigger: testimonialsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            testimonialsRef.current?.querySelectorAll(".testimonial-card") ?? [],
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.7,
              ease: "power2.out",
            }
          );
        },
      });

      // ── Trust section
      ScrollTrigger.create({
        trigger: trustRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            trustRef.current?.querySelectorAll(".trust-item") ?? [],
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.6,
              ease: "power2.out",
            }
          );
        },
      });

      // ── Final CTA
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, y: 40, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
          );
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full pb-10">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div ref={heroTextRef} className="flex flex-col">
            {/* Eyebrow */}
            <div
              className="hero-line inline-flex items-center gap-2.5 self-start mb-8 px-4 py-2 rounded-full"
              style={{
                background: "rgba(180,245,90,0.06)",
                border: "1px solid rgba(180,245,90,0.14)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#b4f55a", boxShadow: "0 0 8px #b4f55a" }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#b4f55a" }}
              >
                AI Nutrition Intelligence
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-[clamp(2.8rem,6vw,5.2rem)] font-bold text-white leading-[1.02] tracking-[-0.03em] mb-6">
              <span className="hero-line block">Eat for the</span>
              <span className="hero-line block">
                body you{" "}
                <span
                  className="relative"
                  style={{
                    background: "linear-gradient(135deg, #b4f55a 0%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  actually have.
                </span>
              </span>
            </h1>

            {/* Sub */}
            <p
              className="hero-line text-lg md:text-xl leading-relaxed font-light mb-10 max-w-xl"
              style={{ color: "#6a7a6a" }}
            >
              Share your goals, allergies, and lifestyle. WellNourish AI
              calculates your exact macros and builds a complete 7-day meal
              plan — down to the grocery list.
            </p>

            {/* CTAs */}
            <div
              ref={heroCtaRef}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="group relative flex items-center gap-3 px-8 py-4 text-sm font-bold rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    background: "#b4f55a",
                    color: "#050a05",
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      boxShadow: "0 0 40px rgba(180,245,90,0.45)",
                      duration: 0.3,
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      boxShadow: "0 0 0px rgba(180,245,90,0)",
                      duration: 0.3,
                    });
                  }}
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className="group relative flex items-center gap-3 px-8 py-4 text-sm font-bold rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    background: "#b4f55a",
                    color: "#050a05",
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      boxShadow: "0 0 40px rgba(180,245,90,0.45)",
                      duration: 0.3,
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      boxShadow: "0 0 0px rgba(180,245,90,0)",
                      duration: 0.3,
                    });
                  }}
                >
                  Build My Plan
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <a
                href="#features"
                className="group flex items-center gap-2 px-7 py-4 text-sm font-medium rounded-full transition-all"
                style={{
                  color: "#7a8a7a",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    color: "#ffffff",
                    borderColor: "rgba(180,245,90,0.2)",
                    duration: 0.2,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    borderColor: "rgba(255,255,255,0.07)",
                    duration: 0.2,
                  });
                }}
              >
                How it works
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Stats ribbon */}
            <div
              ref={statsRef}
              className="flex items-center gap-8 mt-12 pt-10"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              {[
                { value: "7-Day", label: "Meal Plans" },
                { value: "100%", label: "Personalized" },
                { value: "<30s", label: "Generation" },
              ].map((stat) => (
                <div key={stat.label} className="stat-item text-left">
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p
                    className="text-[10px] font-medium uppercase tracking-widest mt-0.5"
                    style={{ color: "#3a4a3a" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive card */}
          <div ref={heroCardRef} className="relative flex justify-center lg:justify-end">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(180,245,90,0.08) 0%, transparent 70%)",
              }}
            />
            <HeroCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section
        id="features"
        ref={featuresRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-32"
      >
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "rgba(180,245,90,0.7)" }}
          >
            Built Different
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Precision at every layer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section
        ref={howItWorksRef}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-32"
      >
        <div className="text-center mb-20">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "rgba(180,245,90,0.7)" }}
          >
            The Process
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Three steps.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #b4f55a, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              One perfect week.
            </span>
          </h2>
        </div>

        <div className="relative">
          {/* Animated vertical line */}
          <div
            className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              id="timeline-line-fill"
              className="w-full"
              style={{
                height: "0%",
                background:
                  "linear-gradient(to bottom, #b4f55a80, #34d39940, transparent)",
              }}
            />
          </div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`step-item relative flex items-start gap-8 md:gap-16 mb-20 last:mb-0 ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse md:text-right"
              }`}
              style={{ opacity: 0 }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10 mt-2"
                style={{
                  background: "#050a05",
                  border: "2px solid rgba(180,245,90,0.5)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: "rgba(180,245,90,0.2)" }}
                />
              </div>

              {/* Content */}
              <div
                className={`pl-12 sm:pl-16 md:pl-0 md:w-1/2 ${
                  idx % 2 === 0 ? "md:pr-16" : "md:pl-16"
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 mb-4 ${
                    idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "rgba(180,245,90,0.6)" }}
                  >
                    0{idx + 1}
                  </span>
                  <div
                    className="w-8 h-px"
                    style={{ background: "rgba(180,245,90,0.2)" }}
                  />
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                    idx % 2 !== 0 ? "md:ml-auto" : ""
                  }`}
                  style={{
                    background: "rgba(180,245,90,0.05)",
                    border: "1px solid rgba(180,245,90,0.1)",
                    color: "#b4f55a",
                  }}
                >
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed font-light max-w-sm"
                  style={{ color: "#5a6a5a" }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          MEAL PLAN PREVIEW
      ══════════════════════════════════════ */}
      <section
        ref={mealsRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-32"
      >
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "rgba(180,245,90,0.7)" }}
          >
            Preview
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5">
            A single day. Fully mapped.
          </h2>
          <p className="font-light max-w-lg mx-auto" style={{ color: "#5a6a5a" }}>
            Every meal calculated, balanced, and tailored. Here&apos;s what one
            day looks like inside your plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleMeals.map((meal, idx) => (
            <MealCard key={idx} meal={meal} />
          ))}
        </div>

        {/* Daily total summary */}
        <div
          className="mt-5 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#b4f55a", boxShadow: "0 0 6px #b4f55a" }}
            />
            <span className="text-sm font-semibold text-white">Daily Total</span>
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-6 md:gap-10 w-full sm:w-auto">
            {[
              { label: "Calories", value: "2,150 kcal", color: "#fb923c" },
              { label: "Protein", value: "142g", color: "#60a5fa" },
              { label: "Carbs", value: "245g", color: "#fbbf24" },
              { label: "Fat", value: "78g", color: "#b4f55a" },
            ].map((macro) => (
              <div key={macro.label} className="text-center sm:text-left">
                <p className="text-sm font-semibold" style={{ color: macro.color }}>
                  {macro.value}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#3a4a3a" }}>
                  {macro.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section
        ref={testimonialsRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-32"
      >
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: "rgba(180,245,90,0.7)" }}
          >
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            People who{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #b4f55a, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              take health seriously.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="testimonial-card group relative p-7 rounded-2xl transition-all duration-300"
              style={{
                opacity: 0,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: "rgba(255,255,255,0.09)",
                  y: -4,
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: "rgba(255,255,255,0.05)",
                  y: 0,
                  duration: 0.4,
                  ease: "elastic.out(1, 0.5)",
                });
              }}
            >
              <Quote
                className="w-5 h-5 mb-5"
                style={{ color: "rgba(180,245,90,0.15)" }}
              />
              <p
                className="text-sm leading-relaxed mb-6 font-light"
                style={{ color: "#8a9a8a" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                className="flex items-center gap-3 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold tracking-tight"
                  style={{
                    background: `${t.avatarColor}20`,
                    color: t.avatarColor,
                    border: `1px solid ${t.avatarColor}30`,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-[11px]" style={{ color: "#3a4a3a" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY TRUST US
      ══════════════════════════════════════ */}
      <section
        ref={trustRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-32"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(180,245,90,0.04) 0%, rgba(5,10,5,0.6) 100%)",
            border: "1px solid rgba(180,245,90,0.08)",
          }}
        >
          <div className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {trustItems.map((item, idx) => (
              <div
                key={idx}
                className="trust-item flex flex-col"
                style={{ opacity: 0 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(180,245,90,0.06)",
                    border: "1px solid rgba(180,245,90,0.1)",
                    color: "#b4f55a",
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed font-light flex-1"
                  style={{ color: "#4a5a4a" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-32 text-center"
        style={{ opacity: 0 }}
      >
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "rgba(180,245,90,0.05)" }}
        />

        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] mb-6"
          style={{ color: "rgba(180,245,90,0.7)" }}
        >
          Get Started
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5">
          Stop guessing.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #b4f55a, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Start fueling.
          </span>
        </h2>
        <p
          className="max-w-lg mx-auto mb-10 font-light"
          style={{ color: "#5a6a5a" }}
        >
          Join people who stopped guessing and started feeding their bodies with
          precision. Your first plan is free — no credit card needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="group relative flex items-center gap-3 px-9 py-4 text-sm font-bold rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97]"
            style={{ background: "#b4f55a", color: "#050a05" }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                boxShadow: "0 0 50px rgba(180,245,90,0.35)",
                duration: 0.3,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                boxShadow: "0 0 0px rgba(180,245,90,0)",
                duration: 0.3,
              });
            }}
          >
            {isSignedIn ? "Go to Dashboard" : "Start for Free"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-xs" style={{ color: "#3a4a3a" }}>
            No credit card required
          </span>
        </div>
      </section>
    </div>
  );
}

/* ── Static Data ── */

const features = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Metrics Driven",
    desc: "Age, weight, and activity level feed our macro engine — which calculates exactly what your body needs, not a round-number approximation.",
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    title: "Allergy Conscious",
    desc: "Every ingredient is filtered against your allergies and dislikes before a plan is generated. Your plan is safe by default.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI Precision",
    desc: "Powered by advanced AI, your plan includes hyper-specific recipes and a complete grocery list tailored to your preferred cuisine.",
  },
];

const steps = [
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Tell us about yourself",
    desc: "Enter your age, weight, height, activity level, health goals, allergies, and cuisine preferences. Under two minutes.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI builds your plan",
    desc: "Our AI analyzes your profile, calculates exact macros, and generates a complete 7-day meal plan with recipes and portions.",
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
      "Brown rice, grilled chicken thigh, roasted sweet potato, avocado, and lime-tahini dressing.",
    color: "#b4f55a",
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
      "Pan-seared salmon fillet over roasted broccoli, bell pepper, and quinoa.",
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
    avatarColor: "#b4f55a",
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
    desc: "Plans are generated in seconds. Regenerate as many times as you need — there are no limits.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Science Backed",
    desc: "Macro calculations follow established nutritional guidelines adapted to your specific body composition and goals.",
  },
];
