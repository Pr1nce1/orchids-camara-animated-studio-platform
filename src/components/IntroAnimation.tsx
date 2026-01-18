"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [show, setShow] = useState(true);
  const letters = "CAMARA".split("");

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("camara-intro-seen");
    if (hasSeenIntro) {
      setShow(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("camara-intro-seen", "true");
      setShow(false);
      setTimeout(onComplete, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center animate-ken-burns"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#01579B]/90 via-[#0288D1]/80 to-[#01579B]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="mb-8"
            >
              <div className="relative">
                <Camera className="w-20 h-20 text-white" strokeWidth={1.5} />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(79, 195, 247, 0.4)",
                      "0 0 60px rgba(79, 195, 247, 0.8)",
                      "0 0 20px rgba(79, 195, 247, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <div className="flex items-center justify-center overflow-hidden">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + index * 0.1,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="font-display text-6xl md:text-8xl font-bold text-white inline-block"
                  style={{
                    textShadow: "0 0 40px rgba(79, 195, 247, 0.5)",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-6 overflow-hidden"
            >
              <motion.p
                className="text-lg md:text-xl text-[#B3E5FC] tracking-[0.3em] font-light"
                animate={{ letterSpacing: ["0.3em", "0.4em", "0.3em"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                MOMENTS TO MEMORIES
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.8, duration: 1.5, ease: "easeInOut" }}
              className="mt-12 h-0.5 w-48 bg-gradient-to-r from-transparent via-[#4FC3F7] to-transparent origin-center"
            />

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 3 }}
              className="absolute bottom-8 left-0 h-1 bg-gradient-to-r from-[#4FC3F7] via-[#FFB300] to-[#4FC3F7]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
