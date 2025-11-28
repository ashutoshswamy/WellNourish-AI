import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('resetPassword');

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
