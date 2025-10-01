"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Brain,
  Target,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Smartphone,
  Star,
  Check,
  ArrowRight,
  Dumbbell,
  Apple,
} from "lucide-react";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Advanced algorithms analyze your profile to create the perfect wellness plan tailored just for you.",
      color: "text-blue-500",
    },
    {
      icon: Target,
      title: "Personalized Goals",
      description:
        "Whether it's weight loss, muscle gain, or maintenance - we adapt to your unique objectives.",
      color: "text-green-500",
    },
    {
      icon: Clock,
      title: "Time-Efficient",
      description:
        "Get your complete wellness plan in minutes, not hours. Start your journey immediately.",
      color: "text-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description:
        "Science-backed recommendations that deliver real, measurable improvements to your health.",
      color: "text-orange-500",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "Your personal data is protected with enterprise-grade security and privacy measures.",
      color: "text-red-500",
    },
    {
      icon: Smartphone,
      title: "Always Accessible",
      description:
        "Access your plans anywhere, anytime. Your wellness journey fits your lifestyle.",
      color: "text-indigo-500",
    },
  ];

  const benefits = [
    "Personalized diet plans based on your goals",
    "Custom workout routines for all fitness levels",
    "Science-backed nutritional recommendations",
    "Flexible scheduling that fits your lifestyle",
    "Progress tracking and adjustments",
    "24/7 access to your wellness plan",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-section py-section">
        <div className="container-fluid">
          <div className="text-center">
            <Badge
              variant="outline"
              className="mb-4 xs:mb-6 md:mb-8 text-xs xs:text-sm font-medium border-primary/20 text-primary"
            >
              <Leaf className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4" />
              AI-Powered Wellness Platform
            </Badge>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-gray-900 font-headline">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                WellNourish AI
              </span>
              <span className="block xs:inline xs:ml-2 lg:ml-4">
                <span className="hidden xs:inline">- </span>
                <span className="text-gray-900 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Personal AI-Powered Diet & Workout Planner
                </span>
              </span>
            </h1>

            <p className="container-narrow mt-4 xs:mt-6 md:mt-8 text-base xs:text-lg sm:text-xl text-gray-600 leading-relaxed font-light px-2 xs:px-4">
              Experience the future of personalized wellness with our AI-powered
              platform. Get scientifically-backed nutrition and fitness plans
              designed specifically for your unique goals, lifestyle, and
              preferences.
            </p>

            <div className="mt-6 xs:mt-8 md:mt-12 flex justify-center px-3">
              <Button
                size="lg"
                className="btn-hero font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg touch-target-large focus-ring w-full xs:w-auto max-w-sm xs:max-w-none"
                onClick={onGetStarted}
              >
                <span className="hidden xs:inline">Start Your Journey</span>
                <span className="xs:hidden">Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced background decoration with better mobile performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 xs:-top-40 -right-20 xs:-right-40 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 bg-emerald-100/30 rounded-full blur-2xl xs:blur-3xl"></div>
          <div className="absolute -bottom-20 xs:-bottom-40 -left-20 xs:-left-40 w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 bg-teal-100/30 rounded-full blur-2xl xs:blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-section py-section-small mobile:py-8 bg-gray-50">
        <div className="container-fluid">
          <div className="text-center mb-section">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-headline">
              Why Choose WellNourish AI?
            </h2>
            <p className="container-narrow mt-3 xs:mt-4 md:mt-6 text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 font-light leading-relaxed px-2 xs:px-4">
              Experience cutting-edge technology that transforms how you
              approach wellness, backed by science and tailored to your unique
              needs.
            </p>
          </div>

          <div className="grid-mobile-stack xs:grid-tablet-responsive lg:grid-features xl:grid-cols-3 2xl:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 desktop:hover-only-desktop cursor-pointer border-0 bg-white shadow-lg p-4 xs:p-6 lg:p-8 ${
                  hoveredFeature === index ? "ring-2 ring-emerald-500/20" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="pb-2 xs:pb-3 md:pb-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 md:w-16 md:h-16 rounded-xl xs:rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-3 xs:mb-4 md:mb-6">
                    <feature.icon
                      className={`h-5 w-5 xs:h-6 xs:w-6 md:h-8 md:w-8 ${feature.color}`}
                    />
                  </div>
                  <CardTitle className="text-lg xs:text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 text-left">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed text-sm xs:text-base lg:text-lg text-left">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-section py-section-small mobile:py-8 bg-white">
        <div className="container-fluid">
          <div className="text-center mb-6 xs:mb-8 md:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-headline">
              Everything You Need for Success
            </h2>
            <p className="container-narrow mt-3 xs:mt-4 md:mt-6 text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 font-light leading-relaxed px-2 xs:px-4">
              Our comprehensive platform combines cutting-edge AI technology
              with proven wellness science to deliver personalized solutions
              that adapt to your lifestyle and goals.
            </p>
          </div>

          <div className="container-narrow">
            <div className="grid-mobile-stack sm:grid-cols-2 gap-3 xs:gap-4 md:gap-6 lg:gap-8 mb-8 xs:mb-12 md:mb-16">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 xs:gap-3 md:gap-4 p-3 xs:p-4 md:p-6 rounded-xl xs:rounded-2xl bg-gray-50/50 hover:bg-emerald-50/50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 xs:mt-1">
                    <Check className="h-3 w-3 xs:h-4 xs:w-4 md:h-6 md:w-6 text-emerald-600" />
                  </div>
                  <p className="text-gray-900 font-medium text-sm xs:text-base lg:text-lg leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center px-3">
              <Button
                size="lg"
                className="btn-hero font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg touch-target-large focus-ring w-full xs:w-auto max-w-sm xs:max-w-none"
                onClick={onGetStarted}
              >
                <span className="hidden sm:inline">Get Started Today</span>
                <span className="sm:hidden">Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-section py-section-small mobile:py-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
        <div className="container-narrow text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-headline">
            Ready to Transform Your Health?
          </h2>
          <p className="mt-4 xs:mt-6 md:mt-8 text-sm xs:text-base sm:text-lg md:text-xl text-emerald-50 leading-relaxed font-light px-2 xs:px-4">
            Join the revolution in personalized wellness. Start your AI-powered
            health journey today and discover what optimal wellness feels like
            for you.
          </p>

          <div className="mt-6 xs:mt-8 md:mt-12 flex justify-center px-3">
            <Button
              size="lg"
              variant="secondary"
              className="btn-hero font-semibold bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg touch-target-large focus-ring w-full xs:w-auto max-w-sm xs:max-w-none"
              onClick={onGetStarted}
            >
              <span className="hidden sm:inline">Get Started Now - Free</span>
              <span className="sm:hidden">Start Free</span>
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          <p className="mt-4 xs:mt-6 md:mt-8 text-emerald-100 text-xs xs:text-sm leading-relaxed">
            No credit card required • Free forever plan available • Start in
            under 2 minutes
          </p>
        </div>
      </section>
    </div>
  );
}
