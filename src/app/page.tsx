"use client";

import Link from "next/link";
import {
  Leaf,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Script from "next/script";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WellNourish AI",
    url: "https://wellnourishai.in",
    description:
      "Get personalized diet and fitness plans powered by advanced AI. Transform your health journey with science-backed recommendations tailored to your goals, preferences, and lifestyle.",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    featureList: [
      "AI-powered personalized diet plans",
      "Custom fitness recommendations",
      "Health goal tracking",
      "Nutrition planning",
      "Workout plans",
    ],
    provider: {
      "@type": "Organization",
      name: "WellNourish AI",
      url: "https://wellnourishai.in",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-slate-950 dark:to-black">
        {/* Navigation */}
        <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 fixed w-full z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                  WellNourish AI
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {!loading && (
                  <>
                    {user ? (
                      <Link
                        href="/dashboard"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                      >
                        <span className="hidden sm:inline">
                          Go to Dashboard
                        </span>
                        <span className="sm:hidden">Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors px-2 sm:px-4 py-2 text-sm sm:text-base"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/signup"
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                        >
                          <span className="hidden sm:inline">Get Started</span>
                          <span className="sm:hidden">Start</span>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-bold">
                AI-Powered Wellness Platform • 100% Free
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-zinc-900 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight px-4">
              Transform Your Body,
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mt-2 animate-gradient">
                Elevate Your Life
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Get personalized{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                diet
              </span>{" "}
              and{" "}
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                fitness plans
              </span>{" "}
              powered by advanced AI. Achieve your wellness goals faster with
              science-backed recommendations.
            </p>

            {/* CTA Buttons */}
            {!loading && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                        Start Free Today
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Link>
                    <Link
                      href="/login"
                      className="group inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-2 border-zinc-300 dark:border-zinc-700 hover:border-emerald-600 dark:hover:border-emerald-600 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all hover:shadow-xl"
                    >
                      <span className="hidden sm:inline">
                        Already a Member? Sign In
                      </span>
                      <span className="sm:hidden">Sign In</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Trust Badge */}
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2 px-4">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
              No credit card required • 100% Free • Cancel anytime
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 sm:mt-20 md:mt-24 mb-20 sm:mb-24 md:mb-32">
            <div className="text-center mb-12 sm:mb-16 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4">
                Why Choose WellNourish AI?
              </h2>
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                Everything you need to succeed on your wellness journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {/* Benefit Cards */}
              <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-105 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Personalized Plans
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Every plan is tailored to your body metrics, dietary
                  preferences, and fitness goals.
                </p>
              </div>

              <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-105 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Instant Results
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Get your complete wellness plan in just 30 seconds. No
                  waiting, no complexity.
                </p>
              </div>

              <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-105 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  AI-Powered Intelligence
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Powered by advanced AI for accurate, science-backed
                  recommendations.
                </p>
              </div>

              <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-105 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Dietary Flexibility
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Support for all diets: vegan, keto, paleo, vegetarian, and
                  more.
                </p>
              </div>

              <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-105 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Track Your Progress
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Save plans, review history, and monitor your wellness journey
                  over time.
                </p>
              </div>

              <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-105 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  100% Free Forever
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  No hidden fees, no subscriptions. All features completely
                  free.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-20 sm:mb-24 md:mb-32 px-4">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
                Your personalized wellness plan is just minutes away
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 shadow-xl">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Create Account
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed px-4">
                  Sign up for free in less than 30 seconds. No credit card
                  required.
                </p>
              </div>

              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 shadow-xl">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Answer Questions
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed px-4">
                  Tell us about your body metrics, goals, and dietary
                  preferences.
                </p>
              </div>

              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 shadow-xl">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Get Your Plan
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed px-4">
                  Receive your personalized diet and workout plan instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="mt-20 sm:mt-24 md:mt-32 mx-4 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00ek00NiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
                Ready to Start Your Wellness Journey?
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 leading-relaxed px-4">
                Join thousands of users transforming their lives with AI-powered
                wellness plans. Get started for free today!
              </p>

              {/* Feature list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 text-left">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold mb-1 text-sm sm:text-base">
                      Personalized Plans
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm">
                      Tailored to your unique needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold mb-1 text-sm sm:text-base">
                      Instant Results
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm">
                      Get your plan in 30 seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold mb-1 text-sm sm:text-base">
                      100% Free
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm">
                      No credit card required
                    </p>
                  </div>
                </div>
              </div>

              {!loading && !user && (
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-emerald-600 px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl hover:bg-zinc-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 transform"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  Create Your Free Plan Now
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <p className="text-white/80 text-xs sm:text-sm mt-4 sm:mt-6 flex items-center justify-center gap-2 px-4">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                Takes less than 2 minutes to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
