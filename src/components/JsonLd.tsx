'use client';

import {
  OrganizationJsonLd,
  FAQJsonLd,
  ArticleJsonLd,
} from 'next-seo';
import { SITE_URL, SITE_NAME } from '@/lib/seo.config';

// Organization JSON-LD for the whole site
export function OrganizationSchema() {
  return (
    <OrganizationJsonLd
      type="Organization"
      name={SITE_NAME}
      url={SITE_URL}
      logo={`${SITE_URL}/android-chrome-512x512.png`}
      sameAs={[
        // Add your social media profiles here
        // 'https://twitter.com/wellnourishai',
        // 'https://facebook.com/wellnourishai',
        // 'https://instagram.com/wellnourishai',
        // 'https://linkedin.com/company/wellnourishai',
      ]}
    />
  );
}

// WebSite JSON-LD using script tag
export function WebSiteSchema() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'AI-powered nutrition and wellness platform for personalized meal plans and workout routines.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}

// SoftwareApplication JSON-LD
export function AppSchema() {
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description:
      'AI-powered nutrition and wellness platform for personalized meal plans and workout routines.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
    />
  );
}

// FAQ JSON-LD for pages with FAQs
export function FAQSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  return (
    <FAQJsonLd
      questions={questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      }))}
    />
  );
}

// Breadcrumb JSON-LD
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

// WebPage JSON-LD
export function WebPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: 'en-IN',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
    />
  );
}

// Article JSON-LD for blog posts or articles
export function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  image,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  image?: string;
}) {
  return (
    <ArticleJsonLd
      type="Article"
      headline={headline}
      description={description}
      url={url}
      datePublished={datePublished}
      dateModified={dateModified || datePublished}
      author={[{ '@type': 'Person', name: authorName }]}
      publisher={{
        '@type': 'Organization',
        name: SITE_NAME,
      }}
    />
  );
}

// Home page specific schema
export function HomePageSchema() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <AppSchema />
      <WebPageSchema
        name="WellNourish AI - AI-Powered Nutrition & Wellness Companion"
        description="Transform your health with personalized AI-generated meal plans, workout routines, and nutrition guidance."
        url={SITE_URL}
      />
      <FAQSchema
        questions={[
          {
            question: 'What is WellNourish AI?',
            answer:
              'WellNourish AI is an AI-powered nutrition and wellness platform that creates personalized meal plans, workout routines, and nutrition guidance based on your unique goals, preferences, and dietary restrictions.',
          },
          {
            question: 'How does WellNourish AI create personalized meal plans?',
            answer:
              'Our advanced AI algorithms analyze your dietary preferences, allergies, fitness goals, and lifestyle to generate customized meal and workout plans tailored specifically for you.',
          },
          {
            question: 'Is WellNourish AI free to use?',
            answer:
              'WellNourish AI offers a free tier with basic features. Premium features are available for users who want more advanced personalization and tracking options.',
          },
          {
            question: 'Can WellNourish AI accommodate dietary restrictions?',
            answer:
              'Yes! WellNourish AI takes allergies and dietary restrictions seriously. You can specify your restrictions during onboarding, and all generated plans will respect your dietary needs.',
          },
          {
            question: 'What cuisines does WellNourish AI support?',
            answer:
              'WellNourish AI supports a wide variety of cuisines including Indian (North Indian, South Indian), Mediterranean, Asian, Continental, and more. You can select your preferred cuisines during setup.',
          },
        ]}
      />
    </>
  );
}
