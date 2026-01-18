"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play, X, VolumeX } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

const categories = ["All", "Wedding", "Candid", "Pre-Wedding", "Event", "Corporate"];
const types = ["All", "Photography", "Videography"];

export function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const portfolio = useStore((s) => s.portfolio);
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<typeof portfolio[0] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const publishedItems = portfolio.filter((item) => item.status === "published");

  const filteredItems = publishedItems.filter((item) => {
    const categoryMatch = activeCategory === "All" || item.category.includes(activeCategory);
    const typeMatch = activeType === "All" || 
      (activeType === "Photography" && item.type === "photo") ||
      (activeType === "Videography" && item.type === "video");
    return categoryMatch && typeMatch;
  });

  const row1 = filteredItems.slice(0, Math.ceil(filteredItems.length / 2));
  const row2 = filteredItems.slice(Math.ceil(filteredItems.length / 2));

  const handleVideoHover = (itemId: string, item: typeof portfolio[0], isHovering: boolean) => {
    if (item.type !== "video") return;
    
    if (item.videoSource === "uploaded" && item.mediaUrl) {
      const videoEl = videoRefs.current[itemId];
      if (!videoEl) return;

      if (isHovering) {
        setHoveredVideo(itemId);
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      } else {
        setHoveredVideo(null);
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    }
  };

  return (
    <section id="portfolio" ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-[#0288D1]/10 text-[#0288D1] text-sm font-medium mb-4"
          >
            OUR WORK
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#01579B] mb-4">
            Featured Portfolio
          </h2>
          <p className="text-[#607D8B] text-lg max-w-2xl mx-auto">
            Explore our collection of stunning photography and cinematic videography
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#0288D1] text-white shadow-lg shadow-[#0288D1]/25"
                  : "bg-[#F8F9FA] text-[#607D8B] hover:bg-[#E0E0E0]"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-3 mb-12"
        >
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeType === type
                  ? "bg-[#FFB300] text-white"
                  : "bg-transparent text-[#607D8B] border border-[#E0E0E0] hover:border-[#0288D1]"
              }`}
            >
              {type}
            </button>
          ))}
        </motion.div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {row1.length > 0 && (
            <div className="overflow-hidden mb-6">
              <motion.div
                className="flex gap-6"
                animate={{ x: isPaused ? 0 : [0, -1920] }}
                transition={{ x: { duration: 40, repeat: Infinity, ease: "linear" } }}
                style={{ width: "fit-content" }}
              >
                {[...row1, ...row1].map((item, index) => (
                  <PortfolioCard
                    key={`${item.id}-${index}`}
                    item={item}
                    onPlay={() => item.type === "video" && setSelectedVideo(item)}
                    isHovered={hoveredVideo === `${item.id}-${index}`}
                    onHover={(isHovering) => handleVideoHover(`${item.id}-${index}`, item, isHovering)}
                    videoRef={(el) => { videoRefs.current[`${item.id}-${index}`] = el; }}
                  />
                ))}
              </motion.div>
            </div>
          )}

          {row2.length > 0 && (
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: isPaused ? -960 : [-1920, 0] }}
                transition={{ x: { duration: 40, repeat: Infinity, ease: "linear" } }}
                style={{ width: "fit-content" }}
              >
                {[...row2, ...row2].map((item, index) => (
                  <PortfolioCard
                    key={`${item.id}-${index}`}
                    item={item}
                    onPlay={() => item.type === "video" && setSelectedVideo(item)}
                    isHovered={hoveredVideo === `row2-${item.id}-${index}`}
                    onHover={(isHovering) => handleVideoHover(`row2-${item.id}-${index}`, item, isHovering)}
                    videoRef={(el) => { videoRefs.current[`row2-${item.id}-${index}`] = el; }}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Link href="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-full font-semibold text-lg shadow-xl shadow-[#0288D1]/25 hover:shadow-2xl transition-shadow"
                >
                  View Full Portfolio →
                </motion.button>
              </Link>
            </motion.div>
          </div>

        {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedVideo.videoSource === "uploaded" && selectedVideo.mediaUrl ? (
              <video
                src={selectedVideo.mediaUrl}
                className="w-full h-full"
                controls
                autoPlay
              />
            ) : (
              <iframe
                src={selectedVideo.youtubeUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            </motion.div>
          </motion.div>
        )}
      </section>
    );
  }

interface PortfolioCardProps {
  item: ReturnType<typeof useStore>["portfolio"][0];
  onPlay: () => void;
  isHovered: boolean;
  onHover: (isHovering: boolean) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}

function PortfolioCard({ item, onPlay, isHovered, onHover, videoRef }: PortfolioCardProps) {
  const isUploadedVideo = item.type === "video" && item.videoSource === "uploaded" && item.mediaUrl;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative w-80 flex-shrink-0 group cursor-pointer transition-all duration-300 ${
        isHovered ? "z-10" : ""
      }`}
      onClick={onPlay}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className={`relative aspect-video rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isHovered ? "shadow-2xl shadow-[#0288D1]/40 ring-2 ring-[#4FC3F7]" : ""
      }`}>
        {isUploadedVideo ? (
          <>
            <img
              src={item.thumbnailUrl || item.mediaUrl}
              alt={item.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                isHovered ? "opacity-0" : "opacity-100 group-hover:scale-105"
              }`}
            />
            <video
              ref={videoRef}
              src={item.mediaUrl}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <img
            src={item.thumbnailUrl || item.mediaUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${
          isHovered ? "opacity-60" : "opacity-80 group-hover:opacity-100"
        }`} />
        
        {item.type === "video" && !isHovered && (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
            <motion.div
              className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-7 h-7 text-[#0288D1] ml-1" fill="#0288D1" />
            </motion.div>
          </motion.div>
        )}

        {isHovered && item.type === "video" && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded flex items-center gap-1 z-10">
            <VolumeX className="w-3 h-3" />
            MUTED
          </div>
        )}

        {item.duration && !isHovered && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium">
            {item.duration}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            {item.category.slice(0, 2).map((cat) => (
              <span key={cat} className="px-2 py-0.5 bg-[#0288D1]/80 backdrop-blur-sm rounded text-white text-xs">{cat}</span>
            ))}
            <span className="px-2 py-0.5 bg-[#FFB300]/80 backdrop-blur-sm rounded text-white text-xs">
              {item.type === "photo" ? "Photography" : "Videography"}
            </span>
          </div>
          <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-[#4FC3F7] transition-colors">
            {item.title}
          </h3>
        </div>
      </div>
      </motion.div>
    );
  }

