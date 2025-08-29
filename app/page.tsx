'use client';

import Hero from "@/components/Hero";
import { motion } from "framer-motion";

export default function Page(){
  return (
    <>
      <Hero />
      <section className="container mt-8 grid md:grid-cols-3 gap-6">
        <motion.div whileHover={{y:-6}} className="glass p-6 rounded">
          <h3 className="text-xl font-bold mb-2">Collaborative</h3>
          <p className="text-slate-300">Edit pages with teammates in real time with live cursors and presence.</p>
        </motion.div>
        <motion.div whileHover={{y:-6}} className="glass p-6 rounded">
          <h3 className="text-xl font-bold mb-2">No-Code Blocks</h3>
          <p className="text-slate-300">Assemble hero, features, gallery, and CTA blocks with drag & drop.</p>
        </motion.div>
        <motion.div whileHover={{y:-6}} className="glass p-6 rounded">
          <h3 className="text-xl font-bold mb-2">Publish</h3>
          <p className="text-slate-300">Export a static site and publish to Appwrite Sites with one click.</p>
        </motion.div>
      </section>
    </>
  );
}
