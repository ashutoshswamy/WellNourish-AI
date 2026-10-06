import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wellnourishai.ashutoshswamy.in';

  // ponytail: no lastModified, a fake "now" on every crawl teaches Google to ignore it
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    ...['/privacy', '/terms', '/cookies'].map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
