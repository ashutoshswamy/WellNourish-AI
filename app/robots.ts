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
          '/shopping-list',
        ],
      },
    ],
    sitemap: 'https://wellnourishai.in/sitemap.xml',
  };
}
