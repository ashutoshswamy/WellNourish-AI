import { Metadata } from 'next';
import { LegalDoc } from "@/components/global/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service",
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
      updated="October 2026"
      contactPrompt="Questions about these terms? Email"
      sections={[
      { title: "Eligibility", content: "You must be at least 18 years old to create an account. By using WellNourish AI, you agree to provide accurate information and follow applicable laws." },
      { title: "What the service provides", content: "WellNourish AI generates meal plans, recipes, nutrition information, and grocery lists from the profile information you provide. Content is generated with Google Gemini and may contain errors, omissions, or unsuitable recommendations. Review every ingredient, portion, and allergy risk before use." },
      { title: "Health and safety", content: "WellNourish AI is not a doctor, dietitian, medical device, or emergency service. Its content is for general information only and is not diagnosis, treatment, or medical advice. Ask a qualified healthcare professional before changing your diet, especially if you have a medical condition, allergy, injury, are pregnant, or take medication. Never rely on the service for an emergency." },
      { title: "Accounts and acceptable use", content: "Keep your login details secure and do not share your account or use the service to abuse, disrupt, reverse engineer, or gain unauthorized access to the service or another person's data. You may delete your meal plans from history. Contact us to request account or other personal-data deletion." },
      { title: "Privacy and cookies", content: "Your use is also governed by our Privacy Policy and Cookie Policy. We process profile and health-related information to provide the service, and optional analytics only after consent." },
      { title: "Service changes and availability", content: "The service is currently provided free of charge. We may change, suspend, or discontinue features, including AI models and plan limits, with or without notice where permitted by law. We do not promise uninterrupted availability or that generated content will meet a particular health or dietary outcome." },
      { title: "Disclaimer and liability", content: "To the extent permitted by law, the service and generated content are provided as-is without warranties. Nothing in these terms excludes rights or liability that cannot legally be excluded. Contact us with questions or concerns about a plan." },
    ]}
    />
  );
}
