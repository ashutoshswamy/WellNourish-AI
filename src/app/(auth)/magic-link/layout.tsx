import { generatePageMetadata } from '@/lib/seo.config';

export const metadata = generatePageMetadata('magicLink');

export default function MagicLinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
