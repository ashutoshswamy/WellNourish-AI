import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('login');

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
