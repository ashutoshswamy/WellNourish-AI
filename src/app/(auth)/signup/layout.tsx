import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('signup');

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
