import { Metadata } from "next";
import { SignInClient } from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to WellNourish AI to access your personalized meal plans, recipes, and grocery list.",
};

export default function SignInPage() {
  return <SignInClient />;
}
