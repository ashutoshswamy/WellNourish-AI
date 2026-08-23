# 🥗 WellNourish AI

**WellNourish AI** is a premium, AI-driven meal planning application designed to revolutionize your approach to nutrition. Built with a focus on personalization, aesthetics, and ease of use, it helps you reach your health goals with customized meal plans, interactive shopping lists, and a seamless dashboard experience.

---

## ✨ Features

- 🤖 **AI-Powered Nutrition**: Personalized meal plans generated using Google's Gemini Pro model, tailored to your dietary preferences, health goals, and metrics.
- 📊 **Dynamic Dashboard**: A beautiful, premium dashboard to track your progress and manage your daily meals.
- 📋 **Interactive Shopping Lists**: Automatically generated shopping lists based on your meal plans to simplify your grocery trips.
- 👤 **In-Depth Profiling**: A comprehensive onboarding experience to capture your biometrics, activity levels, and dietary restrictions.
- 🔒 **Secure Authentication**: Email/password and Google sign-in powered by **Firebase Auth**.
- 🚀 **Real-time Data**: Persistent storage using **Firestore**.
- 📱 **Fully Responsive**: A mobile-first design that looks stunning on every device.
- 🎨 **Premium UI/UX**: Smooth animations with **Framer Motion** and a modern design system.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database & Backend**: [Firestore](https://firebase.google.com/docs/firestore)
- **AI Engine**: [Google Generative AI (Gemini Pro)](https://ai.google.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Firebase project with Authentication (Email/Password + Google providers) and Firestore enabled
- The [Firebase CLI](https://firebase.google.com/docs/cli) (`npm i -g firebase-tools`), for deploying Firestore rules/indexes
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
   # Firebase client SDK (Project settings > General)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK (Project settings > Service accounts > Generate new private key)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="your_service_account_private_key"

   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Deploy Firestore rules and indexes:**
   ```bash
   firebase login
   firebase deploy --only firestore:rules,firestore:indexes
   ```
   `firebase.json` / `.firebaserc` already point at `firestore.rules` and `firestore.indexes.json` and the `wellnourishai` project — no `firebase init` needed. Composite indexes take a few minutes to build; check **Firebase Console → Firestore → Indexes** for "Enabled" before generating a plan.

5. **Run the development server:**
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
