// components/HowItWorks.tsx
'use client';
import { motion } from "framer-motion";
import { Rocket, Users, MousePointerClick, Globe } from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "1. Start a project",
    desc: "Create a new canvas and choose from ready-made blocks to kickstart your site instantly.",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    icon: Users,
    title: "2. Invite collaborators",
    desc: "Share your canvas link and collaborate in real-time with live cursors & presence.",
    color: "from-cyan-400 to-sky-500",
  },
  {
    icon: MousePointerClick,
    title: "3. Drag & drop blocks",
    desc: "Easily arrange text, images, and custom components with a smooth drag-and-drop editor.",
    color: "from-purple-400 to-fuchsia-500",
  },
  {
    icon: Globe,
    title: "4. Publish to Appwrite",
    desc: "Deploy your site instantly to Appwrite Sites with one click. Share it with the world!",
    color: "from-teal-400 to-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold">
          How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">works</span>
        </h2>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Build, collaborate, and launch in minutes. Here’s the journey from idea to published site:
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-2xl border border-slate-700 relative group hover:shadow-xl hover:shadow-indigo-500/10 transition"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${step.color} mb-4`}>
              <step.icon className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
