import { Metadata } from 'next';
import { LegalDoc } from "@/components/global/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy | WellNourish AI",
  description: "Learn how WellNourish AI collects, uses, and protects your personal health and nutrition data.",
  alternates: {
    canonical: "https://wellnourishai.ashutoshswamy.in/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      intro="At WellNourish AI, we take your privacy seriously. This policy explains how we collect, use, and protect your personal health information."
      updated="April 2026"
      contactPrompt="Questions about our privacy practices? Email"
      sections={[
      { title: "Data We Collect", content: "We collect information you provide directly to us, such as your age, weight, height, activity level, dietary preferences, and allergies. This data is essential for generating your personalized meal plans." },
      { title: "How We Use Your Data", content: "Your data is primarily used to power our AI systems to create nutritional recommendations tailored specifically to you. We also use it to improve our service and provide customer support." },
      { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. Your health metrics are encrypted at rest and we never sell your personal data to third parties." },
      { title: "Your Rights", content: "You have the right to access, correct, or delete your personal information at any time through your profile settings or by contacting our support team." },
    ]}
    />
  );
}
