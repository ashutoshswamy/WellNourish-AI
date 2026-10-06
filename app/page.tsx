import { Metadata } from 'next';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  description: "Get a 7-day meal plan tailored to your unique body metrics, allergies, and goals. Powered by advanced AI for precision nutrition.",
  alternates: {
    canonical: "https://wellnourishai.ashutoshswamy.in",
  },
};

export default function Home() {
  const url = "https://wellnourishai.ashutoshswamy.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        "name": "WellNourish AI",
        "url": url,
        "publisher": { "@id": `${url}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#org`,
        "name": "WellNourish AI",
        "url": url,
        "logo": `${url}/android-chrome-512x512.png`,
        "founder": {
          "@type": "Person",
          "name": "Ashutosh Swamy",
          "url": "https://ashutoshswamy.in",
          "sameAs": [
            "https://github.com/ashutoshswamy",
            "https://linkedin.com/in/ashutoshswamy",
            "https://x.com/ashutoshswamy_",
          ],
        },
      },
      {
        "@type": "WebApplication",
        "name": "WellNourish AI",
        "url": url,
        "description": "AI-powered personalized nutritionist and meal planner.",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All",
        "image": `${url}/og-image.jpg`,
        "publisher": { "@id": `${url}/#org` },
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
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeClient />
    </>
  );
}
