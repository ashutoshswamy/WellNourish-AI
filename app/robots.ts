import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://wellnourishai.in'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/auth/'], // Protect user data and API routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
