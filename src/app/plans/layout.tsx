import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Your Health Plans - Personalized Diet & Workout Routines",
  description:
    "View and manage your personalized AI-generated diet plans and workout routines. Track your progress and optimize your health journey with WellNourish AI.",
  path: "/plans",
  keywords: [
    "personalized diet plans",
    "workout routines",
    "health tracking",
    "AI fitness plans",
    "nutrition dashboard",
    "health progress",
    "meal planning",
    "exercise plans",
  ],
});

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
