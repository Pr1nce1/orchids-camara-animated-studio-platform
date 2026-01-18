"use client";

import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import { useState } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=80",
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const titleLetters = "CAMARA".split("");
  const taglineWords = ["Moments", "to", "Memories"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {heroImages.map((img, index) => (
        <motion.div
          key={img}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentImage === index ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-ken-burns"
            style={{ backgroundImage: `url('${img}')` }}
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#01579B]/70 via-[#0288D1]/50 to-[#01579B]/80" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-[#B3E5FC] text-sm font-medium tracking-wider border border-white/20">
            PREMIUM PHOTOGRAPHY & VIDEOGRAPHY
          </span>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <div className="flex justify-center items-center">
            {titleLetters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + index * 0.08,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="font-display text-7xl md:text-9xl font-bold text-white inline-block"
                style={{
                  textShadow: "0 0 60px rgba(79, 195, 247, 0.5), 0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mb-12">
          {taglineWords.map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
              className={`text-2xl md:text-4xl font-light ${
                index === 2 ? "text-[#FFB300] font-display italic" : "text-white/90"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-white text-[#01579B] rounded-full font-semibold text-lg shadow-2xl hover:shadow-white/25 transition-all flex items-center gap-2"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            View Portfolio
          </motion.button>

            <motion.a
              href="tel:+919845374999"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white transition-all"
            >
              Call Now
            </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-white/60 text-sm mb-2 tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/60" />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentImage === index
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
