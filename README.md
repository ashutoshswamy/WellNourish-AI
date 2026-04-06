# 🥗 WellNourish AI

**WellNourish AI** is a premium, AI-driven meal planning application designed to revolutionize your approach to nutrition. Built with a focus on personalization, aesthetics, and ease of use, it helps you reach your health goals with customized meal plans, interactive shopping lists, and a seamless dashboard experience.

---

## ✨ Features

- 🤖 **AI-Powered Nutrition**: Personalized meal plans generated using Google's Gemini Pro model, tailored to your dietary preferences, health goals, and metrics.
- 📊 **Dynamic Dashboard**: A beautiful, premium dashboard to track your progress and manage your daily meals.
- 📋 **Interactive Shopping Lists**: Automatically generated shopping lists based on your meal plans to simplify your grocery trips.
- 👤 **In-Depth Profiling**: A comprehensive onboarding experience to capture your biometrics, activity levels, and dietary restrictions.
- 🔒 **Secure Authentication**: Seamless login and signup experience powered by **Clerk**.
- 🚀 **Real-time Data**: Instant updates and persistent storage using **Supabase**.
- 📱 **Fully Responsive**: A mobile-first design that looks stunning on every device.
- 🎨 **Premium UI/UX**: Smooth animations with **Framer Motion** and a modern design system.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & Backend**: [Supabase](https://supabase.com/)
- **AI Engine**: [Google Generative AI (Gemini Pro)](https://ai.google.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project
- A Clerk account and project
- A Google AI Studio API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashutoshswamy/wellnourish-ai.git
   cd wellnourish-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## 🙌 Credits

Developed with ❤️ by **Ashutosh Swamy**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ashutoshswamy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ashutoshswamy)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/ashutoshswamy_)
