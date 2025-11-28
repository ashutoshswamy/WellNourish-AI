import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Route configuration
const ROUTE_CONFIG = {
  // Routes that require authentication
  protected: [
    '/dashboard',
    '/profile',
    '/settings',
    '/plan',
    '/onboarding',
  ],
  // Routes only for unauthenticated users
  authOnly: [
    '/login',
    '/signup',
    '/forgot-password',
    '/magic-link',
  ],
  // Routes that should be accessible regardless of auth state
  public: [
    '/',
    '/auth/callback',
    '/auth/auth-code-error',
    '/reset-password', // Needs to be accessible for password recovery flow
  ],
  // Default redirect destinations
  defaultAuthRedirect: '/dashboard',
  defaultUnauthRedirect: '/login',
} as const;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Helper function to check if path matches any routes in a list
  const matchesRoute = (routes: readonly string[]) =>
    routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  // Check route types
  const isPublicRoute = matchesRoute(ROUTE_CONFIG.public);
  const isProtectedRoute = matchesRoute(ROUTE_CONFIG.protected);
  const isAuthOnlyRoute = matchesRoute(ROUTE_CONFIG.authOnly);

  // Public routes are always accessible
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users from protected routes
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTE_CONFIG.defaultUnauthRedirect;
    // Preserve the intended destination for redirect after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth-only routes (login, signup, etc.)
  if (user && isAuthOnlyRoute) {
    const url = request.nextUrl.clone();
    // Check for a redirect parameter first
    const redirectTo = request.nextUrl.searchParams.get('redirect');
    // Validate redirect to prevent open redirect vulnerability
    const safeRedirect = redirectTo?.startsWith('/') 
      ? redirectTo 
      : ROUTE_CONFIG.defaultAuthRedirect;
    url.pathname = safeRedirect;
    url.search = '';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
