import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { SESSION_COOKIE, SESSION_MARKER } from "@/lib/session-cookie";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

const EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
const legalAcceptanceSchema = z
  .object({
    isAdult: z.literal(true),
    acceptedTerms: z.literal(true),
  })
  .optional();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const idToken = body && typeof body.idToken === "string" ? body.idToken : null;
    if (!idToken) return new NextResponse("Missing idToken", { status: 400 });
    const legalAcceptance = legalAcceptanceSchema.safeParse(body?.legalAcceptance);
    if (!legalAcceptance.success) return new NextResponse("Invalid legal acceptance", { status: 400 });

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (legalAcceptance.data) {
      const profileRef = adminDb.collection("profiles").doc(decodedToken.uid);
      await adminDb.runTransaction(async (tx) => {
        const profileSnap = await tx.get(profileRef);
        if (!profileSnap.data()?.legal_acceptance) {
          tx.set(profileRef, {
            legal_acceptance: {
              is_adult: true,
              terms_version: "1.0",
              privacy_version: "1.0",
              accepted_at: FieldValue.serverTimestamp(),
            },
          }, { merge: true });
        }
      });
    }
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
