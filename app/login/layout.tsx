import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | WellNourish AI",
  description: "Access your personalized dashboard to view your AI-generated diet and workout plans. Secure login for your health journey.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
