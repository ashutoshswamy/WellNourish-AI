import { generateFAQLD } from "@/lib/seo";

// FAQ data for the homepage
export const homepageFAQs = [
  {
    question: "What is WellNourish AI and how does it work?",
    answer:
      "WellNourish AI is an intelligent health platform that uses artificial intelligence to create personalized diet and workout plans. Our AI analyzes your goals, preferences, dietary restrictions, and fitness level to generate customized nutrition and exercise recommendations tailored specifically for you.",
  },
  {
    question: "Is WellNourish AI free to use?",
    answer:
      "Yes, WellNourish AI offers free access to our core features including personalized diet planning and workout routines. Users can create an account and start their health journey at no cost.",
  },
  {
    question: "How accurate are the AI-generated diet and workout plans?",
    answer:
      "Our AI algorithms are trained on extensive nutritional and fitness data, following established health guidelines. However, our recommendations are for informational purposes only and should not replace professional medical advice. We recommend consulting with healthcare professionals for personalized medical guidance.",
  },
  {
    question: "Can I customize my diet plan for specific dietary restrictions?",
    answer:
      "Absolutely! WellNourish AI supports various dietary preferences and restrictions including vegetarian, vegan, gluten-free, keto, Mediterranean, and many others. Simply specify your preferences during setup, and our AI will create a plan that fits your needs.",
  },
  {
    question: "How often should I update my fitness goals and measurements?",
    answer:
      "We recommend updating your measurements weekly and reviewing your goals monthly. Regular updates help our AI provide more accurate recommendations and track your progress effectively.",
  },
  {
    question: "Is my personal health data secure with WellNourish AI?",
    answer:
      "Yes, we take data security seriously. All personal information is encrypted, stored securely, and never shared with third parties without your consent. We comply with privacy regulations and use industry-standard security measures to protect your data.",
  },
  {
    question: "Can WellNourish AI help with specific health conditions?",
    answer:
      "While WellNourish AI can provide general nutrition and fitness guidance, it is not designed to treat or manage specific health conditions. Always consult with qualified healthcare professionals for medical advice, especially if you have existing health conditions.",
  },
  {
    question: "How do I get started with WellNourish AI?",
    answer:
      "Getting started is simple! Create a free account, complete your health profile including goals, preferences, and basic measurements, and our AI will immediately generate your personalized diet and workout plans. You can start your health journey in just a few minutes.",
  },
];

// Generate the FAQ structured data
export const homepageFAQStructuredData = generateFAQLD(homepageFAQs);
