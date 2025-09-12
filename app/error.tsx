"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
      >
        Something went wrong
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 max-w-lg text-center text-lg text-gray-300"
      >
        Don’t worry, our devs are already on it. You can try again or go back to the homepage.
      </motion.p>

      <div className="mt-8 flex gap-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => reset()}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Try Again
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/"
            className="rounded-2xl bg-gray-700 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-gray-600"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
