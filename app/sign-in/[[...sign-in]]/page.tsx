import { Metadata } from "next";
import { AuthForm } from "@/components/global/AuthForm";

export const metadata: Metadata = {
  robots: { index: false },
  title: "Sign In",
  description: "Sign in to WellNourish AI to access your personalized meal plans, recipes, and grocery list.",
};

export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
