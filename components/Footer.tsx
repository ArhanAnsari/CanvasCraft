import { Github, Twitter, Globe, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur mt-20">
      <div className="container mx-auto py-10 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <Image
              src="/canvascraft-logo.png"
              alt="CanvasCraft Logo"
              width={64}
              height={64}
              className="rounded"
            />
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
              CanvasCraft
            </h3>
          </div>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Build, collaborate, and publish sites in real time.  
            A next-gen builder made for creators and teams.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-slate-200">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-slate-400 text-sm">
            <li><a href="/#how-it-works" className="hover:text-white transition">How it works</a></li>
            <li><a href="/#features" className="hover:text-white transition">Features</a></li>
            <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
            <li><a href="/publish" className="hover:text-white transition">Published Sites</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold text-slate-200">Connect</h4>
          <div className="mt-3 flex justify-center md:justify-start gap-4">
            <a
              href="https://github.com/ArhanAnsari"
              target="_blank"
              className="text-slate-400 hover:text-white transition"
            >
              <Github size={20} />
            </a>
            <a
              href="https://x.com/codewitharhan"
              target="_blank"
              className="text-slate-400 hover:text-white transition"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://arhanansari.vercel.app"
              target="_blank"
              className="text-slate-400 hover:text-white transition"
            >
              <Globe size={20} />
            </a>
            <a
              href="https://youtube.com/@codewitharhanofficial?si=bJKF4UpMXPK-ASUa"
              target="_blank"
              className="text-slate-400 hover:text-white transition"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="border-t border-slate-800 py-4 text-center text-slate-500 text-sm">
        © 2025 CanvasCraft. All rights reserved.  
        <br />
        Built with <span className="text-red-500">❤️</span> by{" "}
        <a
          href="https://arhanansari.vercel.app"
          className="underline hover:text-slate-200 transition"
        >
          Arhan Ansari
        </a>
      </div>
    </footer>
  );
}
