import { MetadataRoute } from 'next';

// Private pages stay crawlable so Google can see their noindex tag;
// blocking them here would let bare URLs get indexed from links.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: 'https://wellnourishai.ashutoshswamy.in/sitemap.xml',
  };
}
