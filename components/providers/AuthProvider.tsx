"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import { SESSION_MARKER } from "@/lib/session-cookie";

interface AuthContextValue {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const hasSession = () => document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_MARKER}=`));

async function syncSessionCookie(user: User | null, forceRefresh = false) {
  if (user) {
    // Force refresh so a just-set displayName lands in the token's `name` claim
    const idToken = await user.getIdToken(forceRefresh);
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
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
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      // Only hit the server when the cookie and the Firebase user disagree,
      // not on every page load and hourly token refresh.
      if (!authAction.current && !!nextUser !== hasSession()) {
        await syncSessionCookie(nextUser).catch(() => {});
      }
      setUser(nextUser);
      setIsLoaded(true);
    });
    return unsubscribe;
  }, []);

  const startSession = async (getUser: () => Promise<User>) => {
    authAction.current = true;
    try {
      const user = await getUser();
      try {
        await syncSessionCookie(user, true);
      } catch (err) {
        // No server session: drop the Firebase one too, or the form would bounce to /dashboard and back
        await firebaseSignOut(auth);
        throw err;
      }
      router.push("/dashboard");
    } finally {
      authAction.current = false;
    }
  };

  const signIn = (email: string, password: string) =>
    startSession(async () => (await signInWithEmailAndPassword(auth, email, password)).user);

  const signUp = (email: string, password: string, fullName: string) =>
    startSession(async () => {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) await updateProfile(user, { displayName: fullName });
      return user;
    });

  const signInWithGoogle = () =>
    startSession(async () => (await signInWithPopup(auth, new GoogleAuthProvider())).user);

  const signOutUser = async () => {
    await firebaseSignOut(auth);
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
