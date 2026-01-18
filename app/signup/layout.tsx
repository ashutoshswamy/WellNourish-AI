import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | WellNourish AI",
  description: "Start your journey to better health. Create an account to generate personalized AI diet and workout plans tailored to your body.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
