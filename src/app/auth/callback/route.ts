import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';
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

  // Handle email confirmation (signup, recovery, email change, etc.)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'recovery' | 'email' | 'magiclink',
    });

    if (!verifyError) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      // Construct the redirect URL
      let redirectUrl: string;
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }

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
      const isLocalEnv = process.env.NODE_ENV === 'development';

      // Construct the redirect URL
      let redirectUrl: string;
      if (isLocalEnv) {
        // In development, use localhost
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        // In production behind a proxy
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }

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
