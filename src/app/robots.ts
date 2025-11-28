import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/signup', '/terms', '/privacy', '/cookies'],
        disallow: [
          '/api/',
          '/auth/',
          '/dashboard/',
          '/onboarding/',
          '/plan/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/login', '/signup', '/terms', '/privacy', '/cookies'],
        disallow: ['/api/', '/auth/', '/dashboard/', '/onboarding/', '/plan/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
