import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Make sure to set the NEXT_PUBLIC_BASE_URL environment variable in your production environment
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  return staticPages;
}
