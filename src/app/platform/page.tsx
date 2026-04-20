'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaChevronRight, 
  FaGithub, 
  FaArrowRight,
} from 'react-icons/fa';
import { 
  FiMonitor, 
  FiLayers,
  FiZap,
  FiShield
} from 'react-icons/fi';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function PlatformLandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm text-white">M</div>
            <span className="font-black text-xl tracking-tighter">Modulab</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">About Platform</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="https://dev.modulab.online" className="hover:text-white transition-colors">Portfolio Product</a>
          </div>
          <a 
            href="https://dev.modulab.online/login" 
            className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            Start Building
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20">
              Introducing Modulab
            </span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tight mb-8 leading-[0.85]">
              The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Developers</span>.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Modulab is a multi-tenant platform designed to help developers build, manage, and showcase their digital footprint with unparalleled ease.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://dev.modulab.online" 
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[20px] font-black text-lg shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Explore Dev Product</span>
                <FaChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="about" className="py-32 px-6 bg-zinc-950/50 border-y border-white/5">
        <div className="container max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">One Platform. <span className="text-blue-500">Infinite Nodes</span>.</h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
              We provide the core infrastructure. You build the modules that define your career.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <FiLayers className="w-8 h-8 text-blue-500" />, title: "Multi-tenant", desc: "Isolated environments for every product and user under the Modulab umbrella." },
              { icon: <FiZap className="w-8 h-8 text-amber-500" />, title: "Lightning Fast", desc: "Built on Next.js 15 for sub-second page transitions and global availability." },
              { icon: <FiShield className="w-8 h-8 text-green-500" />, title: "Secure by Default", desc: "Enterprise-grade authentication and data isolation protocols." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="p-10 rounded-[40px] bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div {...fadeInUp} className="bg-gradient-to-br from-zinc-900 to-black p-12 md:p-24 rounded-[60px] border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8">Ready to join the ecosystem?</h2>
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
                Our portfolio module is just the beginning. More nodes are coming soon.
              </p>
              <a 
                href="https://dev.modulab.online/login" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-[20px] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Launch Your Instance
                <FaArrowRight className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center font-black text-[10px]">M</div>
            <span className="font-bold text-sm tracking-tighter">Modulab</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Modulab.online. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
