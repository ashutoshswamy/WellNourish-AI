import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important health and medical disclaimer for WellNourish AI. Understand the limitations and proper use of our AI-powered wellness recommendations.",
  openGraph: {
    title: "Disclaimer | WellNourish AI",
    description:
      "Important health and medical disclaimer for WellNourish AI. Understand the limitations and proper use of our AI-powered wellness recommendations.",
    url: "https://wellnourishai.in/disclaimer",
  },
  alternates: {
    canonical: "https://wellnourishai.in/disclaimer",
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
