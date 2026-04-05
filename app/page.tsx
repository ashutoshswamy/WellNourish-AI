import { Metadata } from 'next';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  title: "AI Nutritionist | Hyper-Personalized Meal Plans",
  description: "Get a 7-day meal plan tailored to your unique body metrics, allergies, and goals. Powered by advanced AI for precision nutrition.",
  alternates: {
    canonical: "https://wellnourishai.in",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WellNourish AI",
    "url": "https://wellnourishai.in",
    "description": "AI-powered personalized nutritionist and meal planner.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "7-Day Personalized Meal Plans",
      "AI Macro Calculation",
      "Allergy-Conscious Recipes",
      "Auto-Generated Grocery Lists"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
