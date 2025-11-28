import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('plan');

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
