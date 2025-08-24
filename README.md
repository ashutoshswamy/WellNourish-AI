# WellNourish AI

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and configured for use with Firebase Studio.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project also uses [Genkit](https://firebase.google.com/docs/genkit) for its AI capabilities. To run the Genkit flows in development, use the following command in a separate terminal:

```bash
npm run genkit:watch
```

## Environment Variables

Create a `.env.local` file in the root of your project and add the necessary environment variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Google AI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://react.dev/) - learn about React.
- [Genkit Documentation](https://firebase.google.com/docs/genkit) - learn about Genkit for AI-powered features.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase for backend services.
- [ShadCN UI Documentation](https://ui.shadcn.com/) - learn about the UI components used.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about the CSS framework.

## Deploy on Firebase

This application is ready to be deployed on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).
