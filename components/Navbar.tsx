"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-700">
      <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
        CanvasCraft
      </Link>
      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link href="/publish" className="text-slate-300 hover:text-white">Published Sites</Link>
            <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
            <Link href="/signup" className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">Signup</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link href="/publish" className="text-slate-300 hover:text-white">Published Sites</Link>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-400 text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
