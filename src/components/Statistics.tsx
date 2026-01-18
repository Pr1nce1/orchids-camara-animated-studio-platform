"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Trophy, Heart, PartyPopper, Globe, Star, Users, Camera, Building2, Award, Zap, LucideIcon } from "lucide-react";
import { useStore } from "@/lib/store";

const iconMap: Record<string, LucideIcon> = {
  Trophy, Heart, PartyPopper, Globe, Star, Users, Camera, Building2, Award, Zap,
};

function AnimatedCounter({ value, suffix, prefix, inView }: { value: number; suffix: string; prefix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function Statistics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const statistics = useStore((s) => s.statistics);
  
  const enabledStats = statistics.filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-white to-[#F8F9FA] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#0288D1]/5"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, delay: i * 0.5 }}
          >
            <Trophy size={60 + i * 10} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#01579B] mb-4">
            Our Journey in Numbers
          </h2>
          <p className="text-[#607D8B] text-lg max-w-2xl mx-auto">
            Three decades of capturing life&apos;s most precious moments
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {enabledStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Trophy;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                whileHover={{ y: -10, rotateY: 5, rotateX: 5 }}
                className="perspective-1000"
              >
                <div className="preserve-3d bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E0E0E0] group relative">
                  <motion.div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${stat.color}20` }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <IconComponent className="w-8 h-8" style={{ color: stat.color }} />
                  </motion.div>

                  <div className="text-center">
                    <div className="font-display text-3xl md:text-4xl font-bold text-[#01579B] mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} inView={isInView} />
                    </div>
                    <p className="text-[#607D8B] text-sm font-medium">{stat.label}</p>
                  </div>

                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${stat.color}10, transparent)` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
