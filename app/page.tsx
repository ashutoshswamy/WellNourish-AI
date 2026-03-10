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
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-background to-background"></div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <AnimatedSection>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary mb-8">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                <span>AI-Powered Precision Health</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                Your body,{" "}
                <span className="text-gradient-warm">
                  intelligently fueled
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Stop guessing. Start thriving. Get a hyper-personalized
                nutrition and workout plan tailored to your unique biology,
                powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <Link href={planLink}>
                  <Button
                    size="lg"
                    className="group text-base px-8 py-4"
                  >
                    {user ? "Go to Dashboard" : "Get Your Custom Plan"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 py-4"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-14 flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>100% Private Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>Instant Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Expert Vetted</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="scroll-mt-24 py-24 bg-background relative"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-3">
                Why WellNourish AI?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Science meets simplicity
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                We don&apos;t just give you a generic PDF. We build a dynamic,
                living plan that adapts to your needs.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Brain className="h-5 w-5" />}
                title="Cognitive Analysis"
                description="Our AI interprets your activity patterns, metabolic rate, and health history to formulate the perfect caloric intake."
                delay={0.1}
                accent="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30"
              />
              <FeatureCard
                icon={<Utensils className="h-5 w-5" />}
                title="Culinary Matched"
                description="Hate broccoli? Love spicy food? Our meal generation respects your palate while hitting your exact macro needs."
                delay={0.15}
                accent="text-primary bg-primary/10"
              />
              <FeatureCard
                icon={<Activity className="h-5 w-5" />}
                title="Adaptive Fitness"
                description="Whether you have a full gym or just a yoga mat, we generate routines that maximize results with your equipment."
                delay={0.2}
                accent="text-accent bg-accent/10"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 py-24 bg-secondary/30 dark:bg-secondary/20"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                How it works
              </h2>
              <p className="text-lg text-muted-foreground">
                Three simple steps to your new lifestyle.
              </p>
            </AnimatedSection>

            <div className="space-y-0">
              <Step
                number="01"
                title="Profile & Goals"
                description="Tell us about yourself — age, weight, dietary restrictions, and what you want to achieve."
                icon={<ClipboardList className="h-5 w-5 text-primary" />}
                isLast={false}
              />
              <Step
                number="02"
                title="AI Generation"
                description="Our Gemini-powered engine processes your data against thousands of nutritional and fitness datapoints."
                icon={<Sparkles className="h-5 w-5 text-primary" />}
                isLast={false}
              />
              <Step
                number="03"
                title="Track & Thrive"
                description="Access your dashboard for daily meals and workouts. Download your plan and see the results."
                icon={<Rocket className="h-5 w-5 text-primary" />}
                isLast={true}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </AnimatedSection>

            <div className="space-y-3">
              <FAQItem
                question="Is the generated plan really unique?"
                answer="Yes. We use a Large Language Model that analyzes every specific detail you provide. No two plans are exactly the same because no two people are."
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

        {/* CTA */}
        <section className="py-20 bg-secondary/30 dark:bg-secondary/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(130,18%,42%)] to-[hsl(130,20%,28%)] p-12 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Let&apos;s build your perfect health plan.
                </h2>
                <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto">
                  Join thousands who have already transformed their lives with
                  intelligent, data-driven planning.
                </p>

                <Link href={planLink}>
                  <Button
                    size="lg"
                    className="bg-white text-[hsl(130,18%,30%)] hover:bg-white/90 border-none px-10 py-4 text-base font-semibold shadow-md"
                  >
                    Generate My Plan Now
                  </Button>
                </Link>
                <p className="mt-4 text-xs text-white/40">
                  No credit card required.
                </p>
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
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  accent: string;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="group p-7 bg-background rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 h-full">
        <div
          className={`mb-5 p-2.5 rounded-lg w-fit ${accent}`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </AnimatedSection>
  );
}

function Step({
  number,
  title,
  description,
  icon,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast: boolean;
}) {
  return (
    <AnimatedSection>
      <div className="flex gap-5">
        {/* Timeline */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          {!isLast && (
            <div className="w-px flex-1 bg-border my-2"></div>
          )}
        </div>

        {/* Content */}
        <div className={`pb-10 ${isLast ? "pb-0" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step {number}</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-background overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
