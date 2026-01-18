"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function ServicesManager() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#01579B]">Services Manager</h1>
        <p className="text-[#607D8B] mt-1">Manage your service offerings</p>
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
          Services management will be available in a future update. You&apos;ll be able to add, edit, and reorder your service offerings.
        </p>
      </motion.div>
    </div>
  );
}
