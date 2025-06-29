import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  HeartPulse,
  History,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personalized AI Diet & Workout Plans",
  description:
    "WellNourish AI creates customized diet and workout plans using advanced AI. Enter your profile and goals to receive a free, personalized health plan instantly.",
};

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-grow">
        <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-background to-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              {user ? (
                <>
                  <h1
                    className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    Welcome back,{" "}
                    {user.user_metadata.display_name || user.email}!
                  </h1>
                  <p
                    className="text-lg md:text-xl text-muted-foreground mb-8 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Ready to check on your progress or generate a new plan?
                  </p>
                  <div
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <Button size="lg" asChild>
                      <Link href="/dashboard">
                        Go to Your Dashboard{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h1
                    className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    Unlock Your Health Potential with AI
                  </h1>
                  <p
                    className="text-lg md:text-xl text-muted-foreground mb-8 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    WellNourish AI creates personalized diet and workout plans
                    tailored just for you. Start your journey to a healthier
                    lifestyle today.
                  </p>
                  <div
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <Button size="lg" asChild>
                      <Link href="/signup">
                        Get Your Free Plan{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted/40 py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline opacity-0 animate-fade-in-up">
                Features Designed For You
              </h2>
              <p
                className="text-muted-foreground mt-2 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                Discover how our intelligent features help you achieve your
                wellness goals faster and more effectively.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div
                className="bg-card p-6 rounded-lg shadow-md text-center flex flex-col items-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex-shrink-0 mb-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">
                  AI Personalization
                </h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes your unique profile to craft plans
                  that fit your life perfectly.
                </p>
              </div>
              <div
                className="bg-card p-6 rounded-lg shadow-md text-center flex flex-col items-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex-shrink-0 mb-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <HeartPulse className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">
                  Holistic Health Approach
                </h3>
                <p className="text-muted-foreground">
                  Receive comprehensive diet, workout, and health tips for your
                  overall well-being.
                </p>
              </div>
              <div
                className="bg-card p-6 rounded-lg shadow-md text-center flex flex-col items-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex-shrink-0 mb-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <History className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">
                  Track Your Progress
                </h3>
                <p className="text-muted-foreground">
                  Keep a history of your generated plans to see how far
                  you&apos;ve come on your health journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="why-us" className="py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline opacity-0 animate-fade-in-up">
                What Makes Us Different?
              </h2>
              <p
                className="text-muted-foreground mt-2 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                We&apos;re not just another fitness app. Here&apos;s how we
                stand out from the crowd.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ul className="space-y-8">
                <li
                  className="flex items-start gap-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline mb-1">
                      Truly Personalized Plans
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI goes beyond templates, considering your unique
                      body, lifestyle, and health data to create a plan
                      that&apos;s genuinely yours.
                    </p>
                  </div>
                </li>
                <li
                  className="flex items-start gap-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline mb-1">
                      Holistic Wellness Strategy
                    </h3>
                    <p className="text-muted-foreground">
                      We combine diet, workouts, and actionable health tips into
                      a comprehensive approach for your overall well-being.
                    </p>
                  </div>
                </li>
                <li
                  className="flex items-start gap-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline mb-1">
                      Safe and Considerate
                    </h3>
                    <p className="text-muted-foreground">
                      Your safety is paramount. We meticulously factor in your
                      medical conditions and allergies to ensure your plan is
                      both effective and safe.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground max-w-md">
                Personalized wellness, powered by AI. Achieve your health goals
                with custom diet and workout plans.
              </p>
              <Link
                href="/disclaimer"
                className="mt-4 inline-block text-sm text-muted-foreground underline hover:text-primary"
              >
                Disclaimer
              </Link>
            </div>
            <div className="md:text-right">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Connect with Us
              </h3>
              <div className="flex md:justify-end gap-4">
                <a
                  href="https://github.com/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com/ashutoshswamy_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Developer: Ashutosh Swamy
              </p>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Theme
                </h3>
                <div className="flex md:justify-end">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} WellNourish AI. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
