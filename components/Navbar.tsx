'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar(){
  const path = usePathname();
  return (
    <motion.header initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="py-3">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white">CC</div>
          <div className="text-white font-semibold text-lg">CanvasCraft</div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className={`text-sm ${path.startsWith('/dashboard')? 'text-white' : 'text-slate-300'}`}>Dashboard</Link>
          <Link href="/publish" className={`text-sm ${path.startsWith('/publish')? 'text-white' : 'text-slate-300'}`}>Publish</Link>
          <Link href="/(auth)/login" className="text-sm text-slate-300">Login</Link>
        </nav>
      </div>
    </motion.header>
  );
}
