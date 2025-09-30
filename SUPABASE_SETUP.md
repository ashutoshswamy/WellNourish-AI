# WellNourish AI - Supabase Integration Setup

This guide will help you set up Supabase authentication and database storage for the WellNourish AI application.

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. A Supabase project

## Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/sign in
2. Create a new project
3. Wait for the project to be set up (usually takes 1-2 minutes)

### 2. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:

   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the `Project URL` and `anon/public` key

3. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Set Up the Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL in the editor

This will create:

- `profiles` table for user profile data (age, height, weight, etc.)
- `plans` table for storing generated diet and workout plans
- Row Level Security (RLS) policies to ensure users can only access their own data
- Necessary indexes for performance

### 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following:
   - **Site URL**: Set to your application URL (e.g., `http://localhost:9002` for development)
   - **Redirect URLs**: Add your auth callback URL (e.g., `http://localhost:9002/auth/callback`)

### 5. Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:9002`
3. Try signing up with a new account
4. Check your email for the confirmation link
5. After confirming, try logging in and creating a wellness plan

## Features Implemented

### Authentication

- ✅ User signup with email confirmation
- ✅ User login/logout
- ✅ Protected routes (middleware)
- ✅ Auth context for user state management

### Database Integration

- ✅ User profiles storage (age, height, weight, activity level, goals)
- ✅ Generated plans storage (diet plans and workout regimens)
- ✅ User-specific data access (RLS)
- ✅ Plan history and management

### User Interface

- ✅ Login and signup pages
- ✅ Authentication-aware header with user menu
- ✅ Plans management page
- ✅ Profile form integration with existing data loading

## Database Schema

### Tables

#### `profiles`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `age` (integer)
- `gender` (text: 'male' | 'female')
- `height` (integer, in cm)
- `weight` (integer, in kg)
- `activity_level` (text: activity level enum)
- `goal` (text: fitness goal enum)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `plans`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `profile_id` (uuid, foreign key to profiles)
- `diet_plan` (text, generated diet plan)
- `workout_regimen` (text, generated workout plan)
- `title` (text, plan title)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Authentication is required for all plan generation and data access
- Secure session management with Supabase Auth

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Make sure `.env.local` is in the root directory
   - Restart your development server after making changes

2. **Authentication Redirect Issues**

   - Check that your Site URL and Redirect URLs are correctly configured in Supabase
   - Ensure the callback URL matches your app's domain

3. **Database Permission Errors**

   - Verify that RLS policies are correctly set up
   - Check that the user is authenticated before accessing data

4. **Email Confirmation Not Working**
   - Check your email spam folder
   - Verify SMTP settings in Supabase (for production)

### Development vs Production

- For development: Use `http://localhost:9002`
- For production: Update environment variables and Supabase settings with your production domain

## Next Steps

1. Customize the email templates in Supabase Auth settings
2. Add social login providers (Google, GitHub, etc.)
3. Implement password reset functionality
4. Add profile picture upload with Supabase Storage
5. Implement plan sharing features

## Support

If you encounter any issues:

1. Check the Supabase documentation
2. Verify your environment variables
3. Check the browser console for errors
4. Review the database logs in Supabase dashboard
