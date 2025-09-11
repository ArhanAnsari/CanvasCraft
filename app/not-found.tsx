"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-xl text-gray-300"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
