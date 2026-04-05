import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/profile',
          '/api/',
          '/sign-in',
          '/sign-up',
          '/plan',
          '/history',
        ],
      },
    ],
    sitemap: 'https://wellnourishai.in/sitemap.xml',
  };
}
