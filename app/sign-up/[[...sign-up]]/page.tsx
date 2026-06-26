import { Metadata } from "next";
import { SignUpClient } from "./SignUpClient";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account on WellNourish AI to get your first hyper-personalized 7-day meal plan and automatic grocery shopping list.",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
