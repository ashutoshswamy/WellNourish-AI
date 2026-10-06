import { Metadata } from 'next';
import { LegalDoc } from "@/components/global/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service | WellNourish AI",
  description: "Read the terms and conditions for using WellNourish AI's personalized nutrition and meal planning services.",
  alternates: {
    canonical: "https://wellnourishai.ashutoshswamy.in/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      intro="The fine print made simple. These terms govern your use of our platform and all content generated through our AI engine."
      updated="April 2026"
      contactPrompt="Questions about these terms? Email"
      sections={[
      { title: "Service Use", content: "WellNourish AI provides personalized nutritional recommendations and meal plans. By using our service, you agree to provide accurate information and use the service in compliance with all applicable laws." },
      { title: "Nutritional Advice Disclaimer", content: "The content provided by WellNourish AI is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional before starting any new diet or exercise program." },
      { title: "Accounts & Subscription", content: "You are responsible for maintaining the confidentiality of your account and password. We reserve the right to modify or terminate the service at any time for any reason without notice." },
      { title: "Refund Policy", content: "While we strive for excellence, nutritional needs vary. If you are unsatisfied with your plan, please contact our support team within 30 days for a full refund on your last purchase." },
    ]}
    />
  );
}
