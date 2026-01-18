"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useStore } from "@/lib/store";

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const allReviews = useStore((s) => s.reviews);
  
  const publishedReviews = allReviews.filter((r) => r.status === "published").sort((a, b) => a.order - b.order);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || publishedReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % publishedReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, publishedReviews.length]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + publishedReviews.length) % publishedReviews.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % publishedReviews.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + publishedReviews.length) % publishedReviews.length);
    
    if (normalizedDiff === 0) {
      return { x: 0, scale: 1, opacity: 1, zIndex: 3, rotateY: 0 };
    } else if (normalizedDiff === 1 || normalizedDiff === -publishedReviews.length + 1) {
      return { x: 300, scale: 0.85, opacity: 0.5, zIndex: 2, rotateY: -15 };
    } else if (normalizedDiff === publishedReviews.length - 1 || normalizedDiff === -1) {
      return { x: -300, scale: 0.85, opacity: 0.5, zIndex: 2, rotateY: 15 };
    }
    return { x: 0, scale: 0.7, opacity: 0, zIndex: 1, rotateY: 0 };
  };

  if (publishedReviews.length === 0) return null;

  return (
    <section id="reviews" ref={ref} className="py-24 bg-gradient-to-b from-[#01579B] to-[#0288D1] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            >
              <Star className="w-6 h-6 text-white" fill="white" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#B3E5FC] text-sm font-medium mb-4"
          >
            TESTIMONIALS
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-[#B3E5FC] text-lg max-w-2xl mx-auto">
            Real stories from real couples and clients who trusted us with their precious moments
          </p>
        </motion.div>

        <div 
          className="relative h-[400px] flex items-center justify-center perspective-1000"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {publishedReviews.map((review, index) => {
            const style = getCardStyle(index);
            return (
              <motion.div
                key={review.id}
                animate={style}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full max-w-lg"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFB300] rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-white" fill="white" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <motion.img
                      src={review.clientPhoto || "https://via.placeholder.com/80"}
                      alt={review.clientName}
                      className="w-16 h-16 rounded-full object-cover border-4 border-[#B3E5FC]"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <h4 className="font-display text-xl font-bold text-[#01579B]">{review.clientName}</h4>
                      <p className="text-[#607D8B] text-sm">{review.clientRole}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star
                          className={`w-5 h-5 ${i < review.rating ? "text-[#FFB300]" : "text-gray-300"}`}
                          fill={i < review.rating ? "#FFB300" : "none"}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-[#607D8B] leading-relaxed italic">&ldquo;{review.reviewText}&rdquo;</p>
                </div>
              </motion.div>
            );
          })}

          <button
            onClick={goToPrev}
            className="absolute left-4 md:left-8 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {publishedReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentIndex === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
