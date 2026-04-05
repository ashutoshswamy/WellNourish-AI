import { Metadata } from 'next';
import { PrivacyClient } from './PrivacyClient';

export const metadata: Metadata = {
  title: "Privacy Policy | WellNourish AI",
  description: "Learn how WellNourish AI collects, uses, and protects your personal health and nutrition data.",
  alternates: {
    canonical: "https://wellnourishai.in/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
