import { Metadata } from "next";
import { AuthForm } from "@/components/global/AuthForm";

export const metadata: Metadata = {
  robots: { index: false },
  title: "Sign Up",
  description: "Create an account on WellNourish AI to get your first hyper-personalized 7-day meal plan and automatic grocery shopping list.",
};

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}
