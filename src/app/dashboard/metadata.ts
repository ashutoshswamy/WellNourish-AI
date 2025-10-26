import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Access your personalized AI-powered diet and fitness plans. Track your wellness journey, view your health plans, and manage your goals.",
  openGraph: {
    title: "Dashboard | WellNourish AI",
    description:
      "Access your personalized AI-powered diet and fitness plans. Track your wellness journey, view your health plans, and manage your goals.",
    url: "https://wellnourishai.in/dashboard",
  },
  robots: {
    index: false, // Private page
    follow: false,
  },
  alternates: {
    canonical: "https://wellnourishai.in/dashboard",
  },
};
