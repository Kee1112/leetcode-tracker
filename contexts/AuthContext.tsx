"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth as authInstance } from "@/lib/firebase";
import { getUser, setUser, type UserDoc } from "@/lib/firestore";

type AuthState = {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [userDoc, setUserDocState] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserDoc = async () => {
    if (!user) {
      setUserDocState(null);
      return;
    }
    const doc = await getUser(user.uid);
    setUserDocState(doc);
  };

  useEffect(() => {
    if (!authInstance) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(authInstance, async (firebaseUser) => {
      setUserState(firebaseUser);
      if (firebaseUser) {
        const doc = await getUser(firebaseUser.uid);
        if (doc) {
          setUserDocState(doc);
        } else {
          await setUser(firebaseUser.uid, {
            email: firebaseUser.email ?? "",
            displayName: firebaseUser.displayName ?? null,
            taskName: "My daily task",
          });
          const newDoc = await getUser(firebaseUser.uid);
          setUserDocState(newDoc ?? null);
        }
      } else {
        setUserDocState(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!authInstance) throw new Error("Firebase not configured");
    await signInWithEmailAndPassword(authInstance, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    if (!authInstance) throw new Error("Firebase not configured");
    const cred = await createUserWithEmailAndPassword(authInstance, email, password);
    await setUser(cred.user.uid, {
      email: cred.user.email ?? email,
      displayName: displayName ?? null,
      taskName: "My daily task",
    });
    await refreshUserDoc();
  };

  const signOut = async () => {
    if (authInstance) await firebaseSignOut(authInstance);
  };

  const value: AuthContextValue = {
    user,
    userDoc,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserDoc,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
