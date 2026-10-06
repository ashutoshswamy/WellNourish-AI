import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve Firebase's auth handler from our own origin so the Google sign-in popup
  // is same-site (pairs with NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN set to this domain).
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com/__/auth/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;
