// components/HowItWorks.tsx
'use client';
import { motion } from "framer-motion";
import { MousePointerClick, Edit3, UploadCloud, Share2 } from "lucide-react";

const steps = [
  {
    title: "1. Drag & Drop",
    description: "Pick pre-built blocks and drag them into your canvas. No code needed.",
    icon: <MousePointerClick className="w-7 h-7 text-indigo-400" />,
  },
  {
    title: "2. Customize",
    description: "Edit text, colors, and layouts with a simple click. Make it truly yours.",
    icon: <Edit3 className="w-7 h-7 text-cyan-400" />,
  },
  {
    title: "3. Publish",
    description: "Deploy to Appwrite Sites instantly. Your project goes live in seconds.",
    icon: <UploadCloud className="w-7 h-7 text-sky-400" />,
  },
  {
    title: "4. Share & Collaborate",
    description: "Invite your team and work together in realtime with live cursors.",
    icon: <Share2 className="w-7 h-7 text-indigo-300" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="container py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-14"
      >
        How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Works</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="glass flex items-start gap-4 p-6 rounded-xl border border-slate-700 bg-slate-800/40 hover:border-indigo-400/40 transition"
          >
            <div className="flex-shrink-0 p-3 rounded-lg bg-slate-900/60 border border-slate-700">
              {s.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-slate-400 mt-1">{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
