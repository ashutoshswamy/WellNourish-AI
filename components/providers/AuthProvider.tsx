"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

async function syncSessionCookie(user: User | null) {
  if (user) {
    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } else {
    await fetch("/api/auth/session", { method: "DELETE" });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      await syncSessionCookie(nextUser);
      setUser(nextUser);
      setIsLoaded(true);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");
    router.refresh();
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) await updateProfile(credential.user, { displayName: fullName });
    await syncSessionCookie(credential.user);
    router.push("/dashboard");
    router.refresh();
  };

  const signInWithGoogle = async () => {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());
    await syncSessionCookie(credential.user);
    router.push("/dashboard");
    router.refresh();
  };

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
