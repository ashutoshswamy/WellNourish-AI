"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { HomePage } from "@/components/home-page";
import { Header } from "@/components/header";
import { UserDashboard } from "@/components/user-dashboard";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"home" | "dashboard">("home");

  // If user is authenticated, show dashboard
  useEffect(() => {
    if (!loading && user) {
      setCurrentView("dashboard");
    } else if (!loading && !user) {
      setCurrentView("home");
    }
  }, [user, loading]);

  const handleGetStarted = () => {
    if (user) {
      setCurrentView("dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading - WellNourish AI</title>
        </Head>
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (currentView === "home") {
    return (
      <>
        <Head>
          <title>
            WellNourish AI - Personal AI-Powered Diet & Workout Planner
          </title>
          <meta
            name="description"
            content="Transform your health with WellNourish AI - the smartest personal diet and workout planner. Get customized nutrition plans and fitness routines powered by artificial intelligence."
          />
          {/* FAQ Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is WellNourish AI and how does it work?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "WellNourish AI is an intelligent health platform that uses artificial intelligence to create personalized diet and workout plans. Our AI analyzes your goals, preferences, dietary restrictions, and fitness level to generate customized nutrition and exercise recommendations tailored specifically for you.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is WellNourish AI free to use?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, WellNourish AI offers free access to our core features including personalized diet planning and workout routines. Users can create an account and start their health journey at no cost.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How accurate are the AI-generated diet and workout plans?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Our AI algorithms are trained on extensive nutritional and fitness data, following established health guidelines. However, our recommendations are for informational purposes only and should not replace professional medical advice.",
                    },
                  },
                ],
              }),
            }}
          />
        </Head>
        <main className="min-h-screen bg-background text-foreground">
          <HomePage onGetStarted={handleGetStarted} />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - WellNourish AI</title>
        <meta
          name="description"
          content="Your personal WellNourish AI dashboard - create and manage your customized diet and workout plans."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <main className="min-h-screen bg-background text-foreground">
        <Header onBackToHome={handleBackToHome} />
        <UserDashboard />
      </main>
    </>
  );
}
