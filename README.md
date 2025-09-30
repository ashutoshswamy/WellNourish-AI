# WellNourish AI 🌱

Transform your health with WellNourish AI - the smartest personal diet and workout planner powered by AI.

## 🌟 Features

- **Personalized Profile Creation**: Input your personal data (age, gender, height, weight, activity level) for customized planning
- **Smart Goal Setting**: Specify your fitness objectives (weight loss, muscle gain, maintenance, etc.)
- **AI-Powered Diet Plans**: Generate customized diet plans based on your profile, goals, and dietary preferences
- **AI-Powered Workout Regimens**: Create personalized workout routines tailored to your fitness level and objectives
- **Clean Plan Display**: View your diet and workout plans in a clear, structured format
- **Progress Tracking**: Monitor your fitness journey and visualize your achievements
- **Educational Guidance**: Access helpful information about exercises and nutrition

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI Integration**: Google AI (Genkit) for plan generation
- **Database & Auth**: Supabase
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Firebase App Hosting

## 🎨 Design

- **Primary Color**: Forest green (#33704B) - evoking nature, health, and growth
- **Background**: Pale green (#E0E5E2) - light and unobtrusive
- **Accent**: Warm Yellow (#E7B751) - highlighting important information
- **Typography**: PT Sans - modern and friendly humanist sans-serif

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Google AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ashutoshswamy/WellNourish-AI.git
   cd WellNourish-AI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   ```

4. **Set up Supabase**

   - Follow the detailed setup guide in `SUPABASE_SETUP.md`
   - Run the SQL schema from `supabase-schema.sql`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Start the AI development server** (in a separate terminal)
   ```bash
   npm run genkit:dev
   ```

The app will be available at `http://localhost:9002`

## 📁 Project Structure

```
src/
├── ai/                     # AI flows and configuration
│   ├── flows/             # Diet plan and workout generation
│   ├── genkit.ts          # AI configuration
│   └── dev.ts             # Development server
├── app/                   # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── plans/             # Plans display page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── enhanced-profile-form.tsx
│   ├── footer.tsx         # App footer with developer info
│   ├── plan-display.tsx
│   └── user-dashboard.tsx
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
└── lib/                   # Utilities and configurations
    └── supabase/          # Supabase client configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run genkit:dev` - Start AI development server
- `npm run genkit:watch` - Start AI server with watch mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📚 Documentation

- [Supabase Setup Guide](SUPABASE_SETUP.md) - Detailed database and authentication setup
- [Project Blueprint](docs/blueprint.md) - App design and feature specifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Developer

**Ashutosh Swamy**

- GitHub: [@ashutoshswamy](https://github.com/ashutoshswamy)
- LinkedIn: [ashutoshswamy](https://linkedin.com/in/ashutoshswamy)

---

Transform your health journey with the power of AI! 🚀💪
