"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await account.updateRecovery(userId as string, secret as string, password, confirm);
      setMessage("Password reset successful. You can now login.");
    } catch (err: any) {
      setMessage(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md p-6 bg-slate-900 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Reset Password</h1>

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white mb-4"
        />
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white mb-4"
        />

        <button
          type="submit"
          className="w-full px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-4 text-center text-slate-300">{message}</p>
        )}
      </form>
    </div>
  );
}
