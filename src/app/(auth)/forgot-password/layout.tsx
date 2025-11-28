import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('forgotPassword');

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
