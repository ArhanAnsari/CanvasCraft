"use client";
import { useAuth } from "@/lib/useAuth";

export default function SignupPage() {
  const { signup } = useAuth();

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <button
        onClick={signup}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Sign Up with Appwrite
      </button>
    </div>
  );
}