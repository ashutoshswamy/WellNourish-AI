import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('terms');

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
