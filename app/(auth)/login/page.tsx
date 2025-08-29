// app/(auth)/login/page.tsx
"use client";
import { useAuth } from "@/lib/useAuth";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        onClick={login}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Login with Appwrite
      </button>
    </div>
  );
}