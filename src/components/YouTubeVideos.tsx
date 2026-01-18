"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play, X, VolumeX, Youtube } from "lucide-react";
import { useStore, YouTubeVideo } from "@/lib/store";
import Link from "next/link";

export function YouTubeVideos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const youtubeVideos = useStore((s) => s.youtubeVideos);
  
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const publishedVideos = youtubeVideos.filter((v) => v.enabled).sort((a, b) => a.order - b.order);

  if (publishedVideos.length === 0) return null;

  const row1 = publishedVideos.slice(0, Math.ceil(publishedVideos.length / 2));
  const row2 = publishedVideos.slice(Math.ceil(publishedVideos.length / 2));

  const handleVideoHover = (videoId: string, isHovering: boolean) => {
    if (isHovering) {
      setHoveredVideo(videoId);
      setIsPaused(true);
    } else {
      setHoveredVideo(null);
      setIsPaused(false);
    }
  };

  const getEmbedUrl = (video: YouTubeVideo) => {
    return `https://www.youtube.com/embed/${video.youtubeId}`;
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A2E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#FF0000_0%,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#FF0000_0%,transparent_50%)] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF0000]/20 text-[#FF0000] text-sm font-medium mb-4"
          >
            <Youtube className="w-4 h-4" />
            YOUTUBE CHANNEL
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Cinematic Videos
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch our latest wedding films and highlights on YouTube
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {row1.length > 0 && (
          <div className="overflow-hidden mb-6">
            <motion.div
              className="flex gap-6 pl-6"
              animate={{ x: isPaused ? 0 : [0, -1920] }}
              transition={{ x: { duration: 30, repeat: Infinity, ease: "linear" } }}
              style={{ width: "fit-content" }}
            >
              {[...row1, ...row1, ...row1].map((video, index) => (
                <YouTubeCard
                  key={`row1-${video.id}-${index}`}
                  video={video}
                  isHovered={hoveredVideo === `row1-${video.id}-${index}`}
                  onHover={(isHovering) => handleVideoHover(`row1-${video.id}-${index}`, isHovering)}
                  onPlay={() => setSelectedVideo(video)}
                  getEmbedUrl={getEmbedUrl}
                />
              ))}
            </motion.div>
          </div>
        )}

        {row2.length > 0 && (
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 pl-6"
              animate={{ x: isPaused ? -480 : [-1920, 0] }}
              transition={{ x: { duration: 35, repeat: Infinity, ease: "linear" } }}
              style={{ width: "fit-content" }}
            >
              {[...row2, ...row2, ...row2].map((video, index) => (
                <YouTubeCard
                  key={`row2-${video.id}-${index}`}
                  video={video}
                  isHovered={hoveredVideo === `row2-${video.id}-${index}`}
                  onHover={(isHovering) => handleVideoHover(`row2-${video.id}-${index}`, isHovering)}
                  onPlay={() => setSelectedVideo(video)}
                  getEmbedUrl={getEmbedUrl}
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
          <Link href="/portfolio/youtube">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white rounded-full font-semibold text-lg shadow-xl shadow-[#FF0000]/25 hover:shadow-2xl transition-shadow inline-flex items-center gap-2"
            >
              <Youtube className="w-5 h-5" />
              View All Videos →
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
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${getEmbedUrl(selectedVideo)}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-4 left-4 right-16">
              <h3 className="text-white text-xl font-semibold">{selectedVideo.title}</h3>
              {selectedVideo.category && (
                <span className="text-white/70 text-sm">{selectedVideo.category}</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

interface YouTubeCardProps {
  video: YouTubeVideo;
  isHovered: boolean;
  onHover: (isHovering: boolean) => void;
  onPlay: () => void;
  getEmbedUrl: (video: YouTubeVideo) => string;
}

function YouTubeCard({ video, isHovered, onHover, onPlay, getEmbedUrl }: YouTubeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative w-96 flex-shrink-0 group cursor-pointer transition-all duration-300 ${
        isHovered ? "z-10" : ""
      }`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onPlay}
    >
      <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
        isHovered ? "shadow-2xl shadow-[#FF0000]/50 ring-2 ring-[#FF0000]" : "shadow-black/50"
      }`}>
        {isHovered ? (
          <iframe
            src={`${getEmbedUrl(video)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${video.youtubeId}`}
            className="w-full h-full pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <img
            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity pointer-events-none ${
          isHovered ? "opacity-50" : "opacity-80"
        }`} />
        
        {!isHovered && (
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center shadow-2xl shadow-[#FF0000]/50"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </motion.div>
          </motion.div>
        )}

        <div className="absolute top-3 left-3 px-2 py-1 bg-[#FF0000] text-white text-xs font-bold rounded flex items-center gap-1">
          <Youtube className="w-3 h-3" />
          YouTube
        </div>

        {video.duration && !isHovered && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
            {video.duration}
          </div>
        )}

        {isHovered && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded flex items-center gap-1 z-10">
            <VolumeX className="w-3 h-3" />
            MUTED
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          {video.category && (
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-white text-xs mb-2 inline-block">
              {video.category}
            </span>
          )}
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 group-hover:text-[#FFCDD2] transition-colors">
            {video.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
