"use client";

import { useState } from "react";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleRecover}
        className="w-full max-w-md p-6 bg-slate-900 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Recover Password</h1>
        <p className="text-slate-400 mb-6 text-sm">
          Enter your email, and we’ll send you a password reset link.
        </p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="mt-4 text-center text-slate-300">{message}</p>
        )}
      </form>
    </div>
  );
}
