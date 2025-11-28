import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('onboarding');

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
