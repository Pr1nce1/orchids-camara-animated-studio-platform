"use client";

import { motion } from "framer-motion";
import { Palette, Construction } from "lucide-react";

export default function HeroManager() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#01579B]">Hero Section</h1>
        <p className="text-[#607D8B] mt-1">Customize your homepage hero section</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 shadow-sm border border-[#E0E0E0] text-center"
      >
        <div className="w-20 h-20 bg-[#E3F2FD] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-[#0288D1]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-[#263238] mb-3">Coming Soon</h2>
        <p className="text-[#607D8B] max-w-md mx-auto">
          Hero section customization will be available in a future update. You&apos;ll be able to edit titles, taglines, background images, and animations.
        </p>
      </motion.div>
    </div>
  );
}
