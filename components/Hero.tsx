// components/Hero.tsx
'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import HowItWorks from "./HowItWorks";
import Features from "./Features";

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative container grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
        {/* Subtle grid background */}
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_60%)]" />

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
            🚀 Next-gen Site Builder
          </span>

          <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-tight">
            Build sites{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300">
              together
            </span>{" "}
            in real time
          </h1>

          <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
            Drag blocks, see live cursors, and publish to{" "}
            <span className="text-cyan-300 font-medium">Appwrite Sites</span> with one click. Collaborative, creative, and deployable — all in your browser.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="btn btn-primary px-6 py-3 rounded-xl text-lg shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition"
            >
              Get started →
            </Link>
            <a
              href="#how"
              className="px-6 py-3 rounded-xl text-lg border border-slate-700/60 hover:border-slate-500 transition text-slate-300 hover:text-white"
            >
              How it works
            </a>
          </div>

          {/* Mini Badge */}
          <div className="mt-6 text-sm text-slate-400">
            Trusted by <span className="text-indigo-300 font-semibold">devs & creators</span> worldwide 🌍
          </div>
        </motion.div>

        {/* Right Content (Preview Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass relative p-6 rounded-2xl shadow-glow border border-slate-700 bg-slate-900/50 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
          <div className="text-sm mb-3 text-slate-400">✨ Live Preview</div>
          <div className="p-6 bg-gradient-to-b from-slate-900/70 to-slate-800/40 rounded-xl border border-slate-700 relative">
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
              Interactive preview — invite collaborators to see realtime edits
            </div>
            {/* Floating shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* How it works Section with id */}
      <div id="how">
        <HowItWorks />
      </div>

      {/* Features Section */}
      <div id="features">
        <Features />
      </div>
    </>
  );
}
