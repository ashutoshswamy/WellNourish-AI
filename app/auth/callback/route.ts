import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.user) {
      // Check if user is new (created in the last minute) and signed up via OAuth
      // OR if the user just verified their email (confirmed in the last minute)
      const now = Date.now();
      const isNewUser = new Date(data.user.created_at).getTime() > now - 60 * 1000;
      const isOAuthUser = data.user.app_metadata.provider !== 'email';
      const justVerified = data.user.email_confirmed_at && (new Date(data.user.email_confirmed_at).getTime() > now - 60 * 1000);

      if ((isNewUser && isOAuthUser) || (justVerified && !isOAuthUser)) {
        try {
          const { resend } = await import("@/lib/resend");
          const { WelcomeEmail } = await import("@/components/emails/WelcomeEmail");
          const fullName = data.user.user_metadata.full_name || data.user.user_metadata.name || 'User';
          
          await resend.emails.send({
            from: 'WellNourish AI <onboarding@wellnourishai.in>',
            to: data.user.email!,
            subject: 'Welcome to WellNourish AI!',
            react: WelcomeEmail({ fullName }),
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // If we are on localhost even in production build (npm start), respect the origin protocol
        if (forwardedHost.includes('localhost')) {
           return NextResponse.redirect(`${origin}${next}`)
        }
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
