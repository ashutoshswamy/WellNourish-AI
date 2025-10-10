import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Terms of Service - WellNourish AI Usage Agreement",
  description:
    "Read the terms of service for WellNourish AI. Understand your rights and responsibilities when using our AI-powered health and fitness platform.",
  path: "/terms",
  keywords: [
    "terms of service",
    "user agreement",
    "terms and conditions",
    "service agreement",
    "legal terms",
    "usage policy",
    "health app terms",
  ],
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
