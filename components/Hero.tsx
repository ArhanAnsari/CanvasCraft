'use client';
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero(){
  return (
    <section className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16">
      <div>
        <h1 className="text-5xl font-extrabold leading-tight">
          Build sites <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">together</span> in real time
        </h1>
        <p className="mt-4 text-slate-300">Drag blocks, see live cursors, and publish to Appwrite Sites with one click. Collaborative, creative, and deployable.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="btn btn-primary">Get started</Link>
          <a href="#how" className="btn" style={{border:'1px solid rgba(255,255,255,.15)'}}>How it works</a>
        </div>
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="glass p-6 rounded-xl shadow-glow border border-slate-700 bg-slate-900/50">
        <div className="text-sm mb-3 text-slate-400">Live Preview</div>
        <div className="p-4 bg-gradient-to-b from-slate-900/70 to-slate-800/40 rounded-lg border border-slate-700">
          <div className="h-44 flex items-center justify-center text-slate-400 text-sm">
            Interactive preview — invite collaborators to see realtime edits
          </div>
        </div>
      </motion.div>
    </section>
  );
}
