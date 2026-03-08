import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <h1 className="text-[15rem] md:text-[20rem] font-display font-black text-white/5 leading-none">404</h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Zap className="text-brand-accent mb-8 animate-pulse" size={80} />
          <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-4 uppercase tracking-tight">LOST IN SPACE</h2>
          <p className="text-white/40 text-lg font-bold uppercase tracking-widest mb-12">The page you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="flex items-center gap-3 px-10 py-5 bg-brand-accent text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-brand-accent/30 tracking-widest uppercase text-xs"
          >
            <ChevronLeft size={20} /> BACK TO EARTH
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
