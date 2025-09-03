// components/Features.tsx
'use client';
import { motion } from "framer-motion";
import { Code2, Sparkles, Users, Globe } from "lucide-react";

const features = [
  {
    title: "Drag & Drop Builder",
    description: "Quickly assemble pages with pre-made blocks, no coding required.",
    icon: <Code2 className="w-8 h-8 text-indigo-400" />,
    illustration: "/images/dragdrop.png",
  },
  {
    title: "AI Assistance",
    description: "Generate sections, content, and styles with smart AI help.",
    icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
    illustration: "/images/ai.png",
  },
  {
    title: "Realtime Collaboration",
    description: "Invite your team, see live cursors, and edit together instantly.",
    icon: <Users className="w-8 h-8 text-sky-400" />,
    illustration: "/images/realtime.png",
  },
  {
    title: "One-Click Publish",
    description: "Deploy to Appwrite Sites in seconds — share your work instantly.",
    icon: <Globe className="w-8 h-8 text-indigo-300" />,
    illustration: "/images/publish.png",
  },
];

export default function Features() {
  return (
    <section className="container py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-14"
      >
        Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Features</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            {/* Illustration */}
            <div className="flex-shrink-0 w-40 h-28 bg-slate-800/40 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
              <img
                src={f.illustration}
                alt={f.title}
                className="object-contain w-full h-full p-4"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2">
                {f.icon}
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </div>
              <p className="text-slate-400 mt-2">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
