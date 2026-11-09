"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { SESSION_MARKER } from "@/lib/session-cookie";

interface AuthContextValue {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, legalAcceptance: LegalAcceptance) => Promise<void>;
  signInWithGoogle: (legalAcceptance?: LegalAcceptance) => Promise<void>;
  signOutUser: () => Promise<void>;
}

interface LegalAcceptance {
  isAdult: true;
  acceptedTerms: true;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Firebase's client SDK is large and only needed once auth is touched, so it stays out of the initial bundle.
const loadAuth = () => Promise.all([import("firebase/auth"), import("@/lib/firebase-client")]);

const hasSession = () => document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_MARKER}=`));

async function syncSessionCookie(user: User | null, forceRefresh = false, legalAcceptance?: LegalAcceptance) {
  if (user) {
    // Force refresh so a just-set displayName lands in the token's `name` claim
    const idToken = await user.getIdToken(forceRefresh);
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, legalAcceptance }),
    });
    if (!res.ok) throw new Error("Failed to create session");
  } else {
    await fetch("/api/auth/session", { method: "DELETE" });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // True while a sign-in/up call is minting the session itself
  const authAction = useRef(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    loadAuth().then(([{ onIdTokenChanged }, { auth }]) => {
      if (cancelled) return;
      unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
        // Only hit the server when the cookie and the Firebase user disagree,
        // not on every page load and hourly token refresh.
        if (!authAction.current && !!nextUser !== hasSession()) {
          await syncSessionCookie(nextUser).catch(() => {});
        }
        setUser(nextUser);
        setIsLoaded(true);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const startSession = async (getUser: () => Promise<User>, legalAcceptance?: LegalAcceptance) => {
    authAction.current = true;
    try {
      const user = await getUser();
      try {
        await syncSessionCookie(user, true, legalAcceptance);
      } catch (err) {
        // No server session: drop the Firebase one too, or the form would bounce to /dashboard and back
        const [{ signOut }, { auth }] = await loadAuth();
        await signOut(auth);
        throw err;
      }
      // Cookie is server-set; hard navigation avoids stale prefetched login redirects.
      window.location.assign("/dashboard");
    } finally {
      authAction.current = false;
    }
  };

  const signIn = (email: string, password: string) =>
    startSession(async () => {
      const [{ signInWithEmailAndPassword }, { auth }] = await loadAuth();
      return (await signInWithEmailAndPassword(auth, email, password)).user;
    });

  const signUp = (email: string, password: string, fullName: string, legalAcceptance: LegalAcceptance) =>
    startSession(async () => {
      const [{ createUserWithEmailAndPassword, updateProfile }, { auth }] = await loadAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) await updateProfile(user, { displayName: fullName });
      return user;
    }, legalAcceptance);

  const signInWithGoogle = (legalAcceptance?: LegalAcceptance) =>
    startSession(async () => {
      const [{ signInWithPopup, GoogleAuthProvider }, { auth }] = await loadAuth();
      return (await signInWithPopup(auth, new GoogleAuthProvider())).user;
    }, legalAcceptance);

  const signOutUser = async () => {
    const [{ signOut }, { auth }] = await loadAuth();
    await signOut(auth);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{ user, isSignedIn: !!user, isLoaded, signIn, signUp, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used within AuthProvider");
  return ctx;
}
