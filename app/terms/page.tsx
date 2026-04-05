import { Metadata } from 'next';
import { TermsClient } from './TermsClient';

export const metadata: Metadata = {
  title: "Terms of Service | WellNourish AI",
  description: "Read the terms and conditions for using WellNourish AI's personalized nutrition and meal planning services.",
  alternates: {
    canonical: "https://wellnourishai.in/terms",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
