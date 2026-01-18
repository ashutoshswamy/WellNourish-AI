import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | WellNourish AI",
  description: "Read our Terms of Service regarding the use of WellNourish AI's diet and workout generation tools and medical disclaimers.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
