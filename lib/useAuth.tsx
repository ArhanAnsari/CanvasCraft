"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account } from "./appwrite";
import { ID } from "appwrite";
import getBaseUrl from "./getBaseUrl";
import { redirect } from "next/navigation";

interface User {
  $id: string;
  email: string;
  name?: string;
  prefs?: {
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await account.get();
      setUser(res);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signup = async (email: string, password: string, name?: string) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password); // auto-login
  };

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    await fetchUser();
  };

  const loginWithGithub = async () => {
    account.createOAuth2Session(
      "github",
      `${getBaseUrl()}/dashboard`, // success
      `${getBaseUrl()}/login`      // failure
    );
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    redirect("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
