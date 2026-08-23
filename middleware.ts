import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const isProtectedRoute = (pathname: string) =>
  (pathname.startsWith("/dashboard") || pathname.startsWith("/plan") || pathname.startsWith("/api")) &&
  pathname !== "/api/auth/session"; // sets the session cookie itself — can't require one first

// Only checks that a session cookie exists — the Admin SDK can't run on the
// Edge runtime, so real verification happens per-route via getServerUser().
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isProtectedRoute(pathname) && !req.cookies.get(SESSION_COOKIE)?.value) {
    if (pathname.startsWith("/api")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
