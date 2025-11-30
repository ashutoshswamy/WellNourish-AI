import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wellnourishai.in';
export const SITE_NAME = 'WellNourish AI';

// Default metadata for the entire app
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'WellNourish AI - AI-Powered Nutrition & Wellness Companion',
    template: '%s | WellNourish AI',
  },
  description:
    'Transform your health with personalized AI-generated meal plans, workout routines, and nutrition guidance. Get custom diet plans tailored to your goals, preferences, and dietary restrictions.',
  keywords: [
    'nutrition',
    'meal plan',
    'diet plan',
    'AI nutrition',
    'personalized diet',
    'healthy eating',
    'weight loss',
    'weight gain',
    'muscle building',
    'vegetarian diet',
    'vegan diet',
    'Indian cuisine',
    'workout plan',
    'fitness',
    'wellness',
    'health app',
    'calorie tracking',
    'macro tracking',
    'personalized nutrition',
    'AI meal planner',
  ],
  authors: [{ name: 'WellNourish AI', url: SITE_URL }],
  creator: 'WellNourish AI',
  publisher: 'WellNourish AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'WellNourish AI - AI-Powered Nutrition & Wellness Companion',
    description:
      'Transform your health with personalized AI-generated meal plans, workout routines, and nutrition guidance. Get custom diet plans tailored to your goals, preferences, and dietary restrictions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WellNourish AI - AI-Powered Nutrition & Wellness Companion',
    description:
      'Transform your health with personalized AI-generated meal plans, workout routines, and nutrition guidance.',
    creator: '@ashutoshswamy_',
    site: '@wellnourishai',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
  category: 'health',
  classification: 'Health & Fitness',
  referrer: 'origin-when-cross-origin',
  applicationName: 'WellNourish AI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WellNourish AI',
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  other: {
    'msapplication-TileColor': '#22c55e',
  },
};

// Page-specific metadata configurations
export interface PageSEOConfig {
  title: string;
  description: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: { url: string; width?: number; height?: number; alt?: string }[];
  };
}

export const pageSEOConfig: Record<string, PageSEOConfig> = {
  home: {
    title: 'WellNourish AI - AI-Powered Nutrition & Wellness Companion',
    description:
      'Transform your health with personalized AI-generated meal plans, workout routines, and nutrition guidance. Get custom diet plans tailored to your goals, preferences, and dietary restrictions.',
  },
  login: {
    title: 'Login',
    description:
      'Sign in to your WellNourish AI account to access your personalized meal plans, workout routines, and nutrition dashboard.',
    noindex: true,
  },
  signup: {
    title: 'Create Account',
    description:
      'Join WellNourish AI today and start your journey to better health with AI-powered personalized nutrition and fitness plans.',
    noindex: true,
  },
  forgotPassword: {
    title: 'Forgot Password',
    description: 'Reset your WellNourish AI account password securely.',
    noindex: true,
  },
  resetPassword: {
    title: 'Reset Password',
    description: 'Create a new password for your WellNourish AI account.',
    noindex: true,
  },
  dashboard: {
    title: 'Dashboard',
    description:
      'View and manage your personalized meal plans, track your nutrition progress, and access your wellness dashboard.',
    noindex: true,
  },
  onboarding: {
    title: 'Get Started',
    description:
      'Set up your profile and preferences to receive personalized AI-generated meal and workout plans tailored just for you.',
    noindex: true,
  },
  plan: {
    title: 'Your Personalized Plan',
    description:
      'View your AI-generated personalized meal plan and workout routine with detailed recipes and nutritional information.',
    noindex: true,
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Learn how WellNourish AI collects, uses, and protects your personal data. Our commitment to your privacy and data security.',
    canonical: `${SITE_URL}/privacy`,
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Read the terms and conditions for using WellNourish AI. Understand your rights and responsibilities as a user.',
    canonical: `${SITE_URL}/terms`,
  },
  cookies: {
    title: 'Cookie Policy',
    description:
      'Understand how WellNourish AI uses cookies to improve your experience. Learn about our cookie practices and your choices.',
    canonical: `${SITE_URL}/cookies`,
  },
};

// Helper function to generate metadata for a page
export function generatePageMetadata(page: keyof typeof pageSEOConfig): Metadata {
  const config = pageSEOConfig[page];

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
    },
    twitter: {
      title: config.title,
      description: config.description,
    },
  };

  if (config.noindex || config.nofollow) {
    metadata.robots = {
      index: !config.noindex,
      follow: !config.nofollow,
    };
  }

  if (config.canonical) {
    metadata.alternates = {
      canonical: config.canonical,
    };
  }

  return metadata;
}
