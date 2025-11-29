import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import React from 'react';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

/**
 * Send a welcome email to newly signed up users
 */
async function sendWelcomeEmail(email: string, userName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping welcome email');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to WellNourish AI! 🥗',
      react: React.createElement(WelcomeEmail, { userName }),
    });
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - we don't want to block the user signup flow
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';
  const flow = searchParams.get('flow'); // 'signup' or 'login'
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle error from OAuth provider
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    const errorUrl = new URL('/auth/auth-code-error', origin);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  /**
   * Helper function to determine redirect path based on user's onboarding status
   * For signup flows, redirect to onboarding
   * For login flows, redirect to dashboard
   */
  const getRedirectPath = async (isSignupFlow: boolean): Promise<string> => {
    // If it's explicitly a signup flow, go to onboarding
    if (isSignupFlow) {
      return '/onboarding';
    }
    
    // For login flows, check if user has completed onboarding
    // If they haven't completed preferences, redirect to onboarding
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      // If no preferences exist, user needs to complete onboarding
      if (!preferences) {
        return '/onboarding';
      }
    }
    
    return '/dashboard';
  };

  /**
   * Helper function to construct the full redirect URL
   */
  const buildRedirectUrl = (path: string, forwardedHost: string | null): string => {
    const isLocalEnv = process.env.NODE_ENV === 'development';
    
    if (isLocalEnv) {
      return `${origin}${path}`;
    } else if (forwardedHost) {
      return `https://${forwardedHost}${path}`;
    } else {
      return `${origin}${path}`;
    }
  };

  // Handle email confirmation (signup, recovery, email change, etc.)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'recovery' | 'email' | 'magiclink',
    });

    if (!verifyError) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      
      // For email signup verification, redirect to onboarding
      // For other types (recovery, magiclink), use the provided next parameter or dashboard
      const isSignupVerification = type === 'signup';
      const redirectPath = isSignupVerification ? '/onboarding' : next;
      
      // Send welcome email for new signups
      if (isSignupVerification) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const userName = user.user_metadata?.full_name || user.user_metadata?.name;
          await sendWelcomeEmail(user.email, userName);
        }
      }
      
      const redirectUrl = buildRedirectUrl(redirectPath, forwardedHost);
      return NextResponse.redirect(redirectUrl);
    }

    // Log the error for debugging
    console.error('OTP verification error:', verifyError.message, verifyError);
    
    // Redirect to error page with more context
    const errorUrl = new URL('/auth/auth-code-error', origin);
    errorUrl.searchParams.set('error', 'verification_failed');
    errorUrl.searchParams.set('error_description', verifyError.message);
    return NextResponse.redirect(errorUrl);
  }

  // Handle OAuth code exchange
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      
      // Determine redirect based on flow type
      const isSignupFlow = flow === 'signup';
      const redirectPath = await getRedirectPath(isSignupFlow);
      
      // Send welcome email for new OAuth signups
      if (isSignupFlow) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const userName = user.user_metadata?.full_name || user.user_metadata?.name;
          await sendWelcomeEmail(user.email, userName);
        }
      }
      
      const redirectUrl = buildRedirectUrl(redirectPath, forwardedHost);
      return NextResponse.redirect(redirectUrl);
    }

    // Log the error for debugging
    console.error('Code exchange error:', exchangeError.message, exchangeError);
    
    // Redirect to error page with more context
    const errorUrl = new URL('/auth/auth-code-error', origin);
    errorUrl.searchParams.set('error', 'code_exchange_failed');
    errorUrl.searchParams.set('error_description', exchangeError.message);
    return NextResponse.redirect(errorUrl);
  }

  // No code or token provided - redirect to error page
  const errorUrl = new URL('/auth/auth-code-error', origin);
  errorUrl.searchParams.set('error', 'no_code');
  errorUrl.searchParams.set('error_description', 'No authorization code was provided');
  return NextResponse.redirect(errorUrl);
}
