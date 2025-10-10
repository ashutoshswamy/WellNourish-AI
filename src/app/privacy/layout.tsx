import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Privacy Policy - How We Protect Your Health Data",
  description:
    "Learn how WellNourish AI protects your personal health information and privacy. Comprehensive privacy policy covering data collection, usage, and security practices.",
  path: "/privacy",
  keywords: [
    "privacy policy",
    "data protection",
    "health data privacy",
    "GDPR compliance",
    "data security",
    "personal information",
    "health information privacy",
  ],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
