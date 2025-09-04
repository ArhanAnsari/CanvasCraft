"use client";

import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, loginWithGithub } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-slate-900 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        {/* ✅ Forgot Password Link */}
        <div className="text-right mb-4">
          <a
            href="/recover"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Forgot password?
          </a>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={loginWithGithub}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-md flex items-center justify-center gap-3"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .296a12 12 0 00-3.793 23.403c.6.11.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.608-4.042-1.608-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.42-1.305.763-1.604-2.665-.303-5.466-1.333-5.466-5.93 0-1.31.467-2.381 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.874.12 3.176.77.839 1.233 1.91 1.233 3.22 0 4.61-2.804 5.624-5.476 5.92.431.372.815 1.102.815 2.222 0 1.605-.015 2.898-.015 3.293 0 .32.217.694.825.576A12 12 0 0012 .296z" />
          </svg>
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
