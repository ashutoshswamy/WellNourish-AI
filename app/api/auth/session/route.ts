import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE, SESSION_MARKER } from "@/lib/session-cookie";

const EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(req: Request) {
  const { idToken } = await req.json();
  if (!idToken) return new NextResponse("Missing idToken", { status: 400 });

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      maxAge: EXPIRES_IN_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    // Expires 2h before the session so the client's hourly token refresh re-mints it in time
    cookieStore.set(SESSION_MARKER, "1", {
      maxAge: EXPIRES_IN_MS / 1000 - 2 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Session creation failed:", err);
    return new NextResponse("Failed to create session", { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(SESSION_MARKER);
  return NextResponse.json({ success: true });
}
