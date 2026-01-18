import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WellNourish AI",
  description: "Learn how WellNourish AI protects your personal health data. We prioritize security and privacy in all our AI-generated services.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
