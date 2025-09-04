"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase();
    return email ? email[0].toUpperCase() : "U";
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
      <div className="container flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
        >
          CanvasCraft
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-sm">
          <Link href="/#how" className="text-slate-300 hover:text-white transition">How it works</Link>
          <Link href="/#features" className="text-slate-300 hover:text-white transition">Features</Link>
          <Link href="/publish" className="text-slate-300 hover:text-white transition">Published Sites</Link>

          {!user ? (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white transition">Login</Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>

              {/* Avatar Dropdown */}
              <div className="relative group">
                {user.prefs?.avatar ? (
                  <img
                    src={user.prefs.avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-slate-600 cursor-pointer"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold cursor-pointer">
                    {getInitials(user.name, user.email)}
                  </div>
                )}

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 text-sm">
                  <Link href="/settings" className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-t-lg">⚙️ Settings</Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-left text-red-400 hover:bg-slate-700 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-slate-300 hover:text-white transition">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900/95">
          <div className="flex flex-col p-4 gap-3 text-slate-300">
            <Link href="/#how" onClick={() => setOpen(false)}>How it works</Link>
            <Link href="/#features" onClick={() => setOpen(false)}>Features</Link>
            <Link href="/publish" onClick={() => setOpen(false)}>Published Sites</Link>
            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-center"
                  onClick={() => setOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/settings" onClick={() => setOpen(false)}>⚙️ Settings</Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-center"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
