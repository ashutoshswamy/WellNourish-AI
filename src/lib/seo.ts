import { Metadata } from "next";

// Base URL for the application
export const BASE_URL = "https://www.wellnourishai.in";

// Default site metadata
export const DEFAULT_METADATA = {
  siteName: "WellNourish AI",
  title: "WellNourish AI - Personal AI-Powered Diet & Workout Planner",
  description:
    "Transform your health with WellNourish AI - the smartest personal diet and workout planner. Get customized nutrition plans and fitness routines powered by artificial intelligence, tailored specifically for your goals, lifestyle, and preferences.",
  keywords: [
    "AI diet planner",
    "workout planner",
    "nutrition plan",
    "fitness tracker",
    "personalized diet",
    "AI health coach",
    "meal planning",
    "fitness goals",
    "healthy lifestyle",
    "wellness app",
    "diet management",
    "health optimization",
    "nutrition tracking",
    "personal trainer AI",
    "health technology",
  ],
  author: "WellNourish AI Team",
  creator: "WellNourish AI",
  publisher: "WellNourish AI",
  locale: "en_US",
  type: "website",
};

interface PageMetadataConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  image?: string;
  type?: string;
}

/**
 * Generate comprehensive metadata for a page
 */
export function generatePageMetadata(
  config: PageMetadataConfig = {}
): Metadata {
  const {
    title = DEFAULT_METADATA.title,
    description = DEFAULT_METADATA.description,
    keywords = DEFAULT_METADATA.keywords,
    path = "",
    noIndex = false,
    noFollow = false,
    image = "/opengraph-image",
    type = "website",
  } = config;

  const url = `${BASE_URL}${path}`;
  const fullTitle =
    title === DEFAULT_METADATA.title
      ? title
      : `${title} | ${DEFAULT_METADATA.siteName}`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: DEFAULT_METADATA.author }],
    creator: DEFAULT_METADATA.creator,
    publisher: DEFAULT_METADATA.publisher,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        "en-US": url,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: type as any,
      locale: DEFAULT_METADATA.locale,
      url,
      siteName: DEFAULT_METADATA.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@wellnourishai",
      site: "@wellnourishai",
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
      other: {
        "domain-verification": "wellnourishai.in",
      },
    },
    category: "health",
    classification: "health application",
  };
}

/**
 * Generate structured data for WebApplication
 */
export function generateWebApplicationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: DEFAULT_METADATA.siteName,
    alternateName: "WellNourish AI Diet & Workout Planner",
    description: DEFAULT_METADATA.description,
    url: BASE_URL,
    applicationCategory: "HealthApplication",
    applicationSubCategory: "Diet Planning",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    softwareVersion: "1.0",
    datePublished: "2024",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: DEFAULT_METADATA.siteName,
      url: BASE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2025-12-31",
    },
    creator: {
      "@type": "Organization",
      name: DEFAULT_METADATA.siteName,
      url: BASE_URL,
    },
    keywords: DEFAULT_METADATA.keywords.join(", "),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    featureList: [
      "AI-powered diet planning",
      "Personalized workout routines",
      "Nutrition tracking",
      "Health goal setting",
      "Progress monitoring",
      "Custom meal plans",
      "Exercise recommendations",
      "Health analytics",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Health-conscious individuals",
    },
    usageInfo: BASE_URL + "/terms",
    privacyPolicy: BASE_URL + "/privacy",
  };
}

/**
 * Generate structured data for Organization
 */
export function generateOrganizationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: DEFAULT_METADATA.siteName,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: BASE_URL + "/android-chrome-512x512.png",
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [BASE_URL],
    description: DEFAULT_METADATA.description,
    founder: {
      "@type": "Person",
      name: "WellNourish AI Team",
    },
    foundingDate: "2024",
    knowsAbout: [
      "Nutrition",
      "Fitness",
      "Health Technology",
      "Artificial Intelligence",
      "Diet Planning",
      "Workout Programming",
    ],
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQLD(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbLD(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: BASE_URL + item.url }),
    })),
  };
}
