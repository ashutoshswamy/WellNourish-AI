import { Metadata } from 'next';
import { LegalDoc } from "@/components/global/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy",
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
      updated="October 2026"
      contactPrompt="Questions about our privacy practices? Email"
      sections={[
      { title: "Information we collect", content: "We collect your email address, name and authentication details from Firebase Authentication, plus the profile information you submit: age, gender, weight, height, target weight, activity level, health goal, weekly goal, diet and cuisine preferences, allergies, and injuries. We also store generated meal plans, recipes, grocery-list items, weight logs, and your signup legal-acceptance record. If you accept analytics, Google Analytics receives usage information from your browser." },
      { title: "How we use information", content: "We use this information to authenticate you, save and display your profile and plans, generate personalized meal plans and grocery lists, protect the service from abuse, provide support, maintain security, and improve the product. Profile attributes and preferences are sent to Google Gemini to generate a plan." },
      { title: "Service providers and sharing", content: "We use Firebase Authentication and Cloud Firestore to provide authentication and storage, Google Gemini to generate meal-plan content, and Google Analytics only when you accept optional analytics cookies. We do not sell personal information. These providers may process information under their own terms and privacy policies." },
      { title: "Cookies and local storage", content: "We use an HTTP-only session cookie and a small readable session marker to keep you signed in. Optional Google Analytics cookies load only after you accept them. We also use local storage for theme preference and your analytics consent choice. See the Cookie Policy for details." },
      { title: "Retention and deletion", content: "Meal plans remain in your account until you delete them. We do not currently provide a self-serve account-deletion control; email us to request deletion of your account and personal information. We may retain information where needed for security, fraud prevention, legal obligations, or legitimate records." },
      { title: "Security", content: "We use Firebase server-side authentication checks, access controls, encrypted transport, and provider security controls. No online service is completely secure, so do not submit information you are not comfortable storing or sending to the listed providers." },
      { title: "Your choices and rights", content: "You can update profile data in Profile Settings, delete meal plans from History, decline analytics, or contact us to request access, correction, or deletion. Depending on where you live, additional privacy rights may apply. We may need to verify your identity before fulfilling a request." },
      { title: "Children and policy changes", content: "The service is intended for people 18 and older and is not directed to children. We may update this policy when the service or law changes; the Last updated date identifies the current version." },
    ]}
    />
  );
}
