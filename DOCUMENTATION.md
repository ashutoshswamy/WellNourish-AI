# WellNourish AI Documentation

## Architecture Overview

WellNourish AI is built as a monolithic Next.js application using the App Router. It leverages server-side rendering (SSR) and React Server Components (RSC) for performance and SEO, while using Client Components for interactive features.

### Directory Structure

- **`/app`**: Contains the main application routes, layouts, and page components (App Router).
  - `(auth)`: Route group for authentication pages (login, signup).
  - `(dashboard)`: Route group for protected dashboard pages.
  - `api`: API routes for backend logic (e.g., plan generation).
- **`/components`**: Reusable UI components (buttons, inputs, cards, etc.).
- **`/lib`**: Library code, including Supabase client initialization.
- **`/utils`**: Helper functions and AI integration logic.
- **`/supabase`**: Database types and SQL scripts.
- **`/public`**: Static assets.

## Key Components

### Authentication
Authentication is handled by Supabase Auth. The application supports OAuth providers (Google, GitHub) and email/password sign-ins. Middleware (`middleware.ts`) is used to protect routes and manage sessions.

### AI Integration
The core feature of generating diet and workout plans is powered by the Google Gemini API.
- **Model**: `gemini-1.5-flash` (or similar) is used for fast and efficient text generation.
- **Prompt Engineering**: Structured prompts are sent to the AI to ensure the output matches the required JSON format for the application to render.

### Database
The data persistence layer is Supabase (PostgreSQL). We use Row Level Security (RLS) policies to ensure users can only access their own data.

**Key Tables**:
1.  **`profiles`**: Linked to `auth.users`. Stores:
    - `age`, `gender`, `height`, `weight`
    - `activity_level`, `dietary_preferences`, `allergies`
    - `health_goals`, `medical_conditions`
2.  **`plans`**: Stores generated content.
    - `user_id` (FK to profiles)
    - `diet_plan` (JSONB)
    - `workout_plan` (JSONB)
    - `created_at`

## Styling and UI
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Framer Motion**: Used for page transitions and component animations to give a premium feel.
- **Lucide Icons**: Consistent icon set used throughout the app.

## Development Guidelines

- **Components**: Create small, reusable components. Use functional components with hooks.
- **State Management**: Use React Context or local state as needed. For server state, rely on Next.js caching and revalidation.
- **Type Safety**: Use TypeScript for all new code. Ensure database types are generated from the Supabase schema.

## SEO Strategy
The application implements meta tags, dynamic titles, and semantic HTML to optimize for search engines. `layout.tsx` files control the metadata hierarchy.
