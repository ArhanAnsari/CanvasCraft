'use client';

import Hero from "@/components/Hero";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <>
      <Hero />
      <section className="container mt-8 grid md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -6 }} className="glass p-6 rounded">
          <h3 className="text-xl font-bold mb-2">Collaborative</h3>
          <p className="text-slate-300">
            Edit pages with teammates in real time with live cursors and presence.
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="glass p-6 rounded">
          <h3 className="text-xl font-bold mb-2">No-Code Blocks</h3>
          <p className="text-slate-300">
            Assemble hero, features, gallery, and CTA blocks with drag & drop.
          </p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="glass p-6 rounded">
          <h3 className="text-xl font-bold mb-2">Publish</h3>
          <p className="text-slate-300">
            Export a static site and publish to Appwrite Sites with one click.
          </p>
        </motion.div>
      </section>

      {/* Product Hunt Embed Badge (small) */}
      <section className="container mt-12 flex justify-center">
        <a
          href="https://www.producthunt.com/products/canvascraft?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-canvascraft"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1014774&theme=light&t=1757485428059"
            alt="CanvasCraft - Build, collaborate, and publish websites — all in real time | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width="250"
            height="54"
          />
        </a>
      </section>

      {/* Product Hunt Launch Embed (big card) */}
      <section className="container mt-12 flex justify-center">
        <iframe
          style={{ border: "none" }}
          src="https://cards.producthunt.com/cards/products/1106634"
          width="500"
          height="405"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        ></iframe>
      </section>
    </>
  );
}
