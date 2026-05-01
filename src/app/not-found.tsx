'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaChevronLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20">
          Error 404
        </span>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
          Lost in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Space</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-md mx-auto font-medium leading-relaxed">
          The node you are looking for does not exist or has been moved to a different coordinate.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="group px-8 py-4 bg-zinc-900 border border-white/10 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <FaChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <Link 
            href="/"
            className="group px-8 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-2xl shadow-white/5"
          >
            <FaHome className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
    </div>
  );
}
