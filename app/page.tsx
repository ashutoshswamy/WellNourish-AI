"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  ArrowRight,
  Brain,
  Utensils,
  Activity,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
  ClipboardList,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();
  const planLink = user ? "/dashboard" : "/login";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WellNourish AI",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: "https://wellnourishai.in",
    description:
      "Generate hyper-personalized diet and workout plans tailored to your unique biology using advanced AI.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "WellNourish AI",
      url: "https://wellnourishai.in",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-emerald-500/30 selection:text-emerald-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Enhanced background gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/80 via-white to-white dark:from-emerald-950/30 dark:via-black dark:to-black opacity-100"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/10 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-teal-300/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-300/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <AnimatedSection>
              <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-8 backdrop-blur-sm shadow-sm hover:bg-emerald-500/10 transition-colors">
                <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
                <span>AI-Powered Precision Health Logic</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05] drop-shadow-sm">
                Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 animate-gradient-x">
                  Intelligently Fueled.
                </span>
              </h1>

              <p className="mt-8 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                Stop guessing. Start thriving. Get a hyper-personalized
                nutrition and workout plan tailored to your unique biology,
                completely powered by advanced AI.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                <Link href={planLink}>
                  <Button
                    size="lg"
                    className="group text-lg px-10 py-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl shadow-slate-900/10 dark:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
                  >
                    {user ? "Go to Dashboard" : "Get Your Custom Plan"}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-10 py-7 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="mt-16 pt-10 flex flex-col items-center">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
                  Backed by Data, Powered by Intelligence
                </p>
                <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
                  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-3 text-slate-600 dark:text-slate-300 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">100% Private Data</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-3 text-slate-600 dark:text-slate-300 shadow-sm">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">Instant Generation</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-3 text-slate-600 dark:text-slate-300 shadow-sm">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Expert Vetted</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="scroll-mt-28 py-32 bg-white dark:bg-slate-950 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 dark:bg-slate-900/20 -skew-x-12 z-0 hidden lg:block pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center mb-24">
              <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase mb-3">
                Why WellNourish AI?
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Science meets simplicity.
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                We don&apos;t just give you a generic PDF. We build a dynamic,
                living plan that adapts to your needs.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-white" />}
                title="Cognitive Analysis"
                description="Our AI engine doesn't just look at weight. It interprets your activity patterns, metabolic rate, and health history to formulate the perfect caloric intake."
                delay={0.1}
                color="from-purple-500 to-indigo-600"
              />
              <FeatureCard
                icon={<Utensils className="h-8 w-8 text-white" />}
                title="Culinary Matched"
                description="Hate broccoli? Love spicy food? Our meal generation respects your palette while strictly adhering to your macro needs. Healthy food actually tastes good here."
                delay={0.2}
                color="from-emerald-500 to-teal-600"
              />
              <FeatureCard
                icon={<Activity className="h-8 w-8 text-white" />}
                title="Adaptive Fitness"
                description="Whether you have a full gym or just a yoga mat, we generate routines that maximize hypertrophy and cardiovascular health based on your equipment."
                delay={0.3}
                color="from-orange-500 to-red-600"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="scroll-mt-28 py-32 bg-slate-50 dark:bg-slate-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-20 text-center">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                How it works
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Three simple steps to your new lifestyle.
              </p>
            </AnimatedSection>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block"></div>

              <Step
                number="01"
                title="Profile & Goals"
                description="Tell us about yourself. Age, weight, dietary restrictions, and what you want to achieve. The more we know, the better the plan."
                side="left"
                icon={<ClipboardList className="h-7 w-7 text-emerald-600" />}
              />
              <Step
                number="02"
                title="AI Generation"
                description="Our Gemini-powered engine processes your data against thousands of nutritional and fitness datapoints to construct your unique regimen."
                side="right"
                icon={<Sparkles className="h-7 w-7 text-emerald-600" />}
              />
              <Step
                number="03"
                title="Track & Thrive"
                description="Access your dashboard to view your daily meals and workouts. Download your plan, stick to it, and see the results."
                side="left"
                icon={<Rocket className="h-7 w-7 text-emerald-600" />}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 bg-white dark:bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </AnimatedSection>

            <div className="space-y-4">
              <FAQItem
                question="Is the generated plan really unique?"
                answer="Yes. We use a Large Language Model (LLM) that analyzes every specific detail you provide. No two plans are exactly the same because no two people are."
              />
              <FAQItem
                question="Can I change my preferences later?"
                answer="Absolutely. You can update your weight, goals, or dietary preferences in your profile at any time and regenerate a new plan."
              />
              <FAQItem
                question="Is this suitable for medical conditions?"
                answer="We take allergies and medical conditions into account to suggest safe meals. However, we always recommend consulting with your doctor before starting any new diet or exercise program."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="group relative rounded-[3rem] overflow-hidden bg-emerald-900 shadow-2xl">
                {/* Background Image/Gradient */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543362906-ac1b782b38f8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-black/80"></div>

                <div className="relative z-10 px-8 py-20 md:p-24 text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Let&apos;s build your perfect health plan.
                  </h2>
                  <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                    Join thousands who have already transformed their lives with
                    intelligent, data-driven planning.
                  </p>

                  <Link href={planLink}>
                    <Button
                      size="lg"
                      className="bg-white text-emerald-900 hover:bg-emerald-50 border-none px-12 py-8 text-xl rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      Generate My Plan Now
                    </Button>
                  </Link>
                  <p className="mt-6 text-sm text-emerald-200/60">
                    No credit card required for initial generation.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  color: string;
}) {
  return (
    <AnimatedSection delay={delay} className="group">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="p-10 bg-white dark:bg-slate-900 rounded-[2rem] hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 relative overflow-hidden"
      >
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-[100px] transition-opacity group-hover:opacity-10`}
        ></div>

        <div
          className={`mb-8 bg-gradient-to-br ${color} p-4 rounded-2xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-500`}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </motion.div>
    </AnimatedSection>
  );
}

function Step({
  number,
  title,
  description,
  side,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between mb-16 md:mb-0 relative ${side === "right" ? "md:flex-row-reverse" : ""}`}
    >
      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 z-10 shadow-md"></div>

      <div
        className={`w-full md:w-[45%] ${side === "left" ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} mb-8 md:mb-0`}
      >
        <AnimatedSection>
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 mb-4 md:hidden">
            {icon}
            <span className="font-bold text-emerald-600">{number}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </AnimatedSection>
      </div>

      <div
        className={`w-full md:w-[45%] ${side === "left" ? "md:pl-12" : "md:pr-12"}`}
      >
        <div className="h-64 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-5xl font-black text-slate-300 dark:text-slate-600">
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <span className="font-bold text-lg text-slate-900 dark:text-white">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
