"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(params.get("userId"));
    setSecret(params.get("secret"));
  }, [params]);

  const resetPassword = async () => {
    if (!userId || !secret) {
      alert("Invalid or missing recovery link.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, secret, password, confirm }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Reset failed");

      alert("✅ Password reset successful! Please log in.");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "❌ Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">🔑 Reset Password</h1>

        {!userId || !secret ? (
          <p className="text-red-400">
            Invalid or missing recovery link. Please request a new password reset.
          </p>
        ) : (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white"
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
