"use client";

import { motion } from "framer-motion";
import { X, Youtube, ExternalLink, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { YouTubeVideo } from "@/lib/store";

interface YouTubePlayerModalProps {
  videos: YouTubeVideo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function YouTubePlayerModal({ videos, currentIndex, onClose, onNavigate }: YouTubePlayerModalProps) {
  const currentVideo = videos[currentIndex];

  const goToPrev = () => onNavigate((currentIndex - 1 + videos.length) % videos.length);
  const goToNext = () => onNavigate((currentIndex + 1) % videos.length);

  const openInYouTube = () => {
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: currentVideo.url } }, "*");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); openInYouTube(); }}
          className="p-2 bg-[#FF0000] hover:bg-[#CC0000] rounded-full text-white transition-colors flex items-center gap-2"
        >
          <Youtube className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:block">Open in YouTube</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {videos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <motion.div
        key={currentVideo.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0F0F0F] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="relative aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-4 border-t border-white/10">
            <h3 className="text-xl font-semibold text-white mb-2">{currentVideo.title}</h3>
            <div className="flex items-center gap-3 text-sm text-white/60">
              {currentVideo.category && (
                <span className="px-2 py-0.5 bg-[#FF0000]/20 text-[#FF6B6B] rounded">{currentVideo.category}</span>
              )}
              {currentVideo.duration && <span>Duration: {currentVideo.duration}</span>}
            </div>
            {currentVideo.description && (
              <p className="mt-3 text-white/70 text-sm">{currentVideo.description}</p>
            )}
          </div>
        </div>

        {videos.length > 1 && (
          <div className="mt-6">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-[#FF0000]" />
              More YouTube Videos
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {videos.filter((_, i) => i !== currentIndex).slice(0, 5).map((video) => {
                const actualIndex = videos.findIndex(v => v.id === video.id);
                return (
                  <button
                    key={video.id}
                    onClick={() => onNavigate(actualIndex)}
                    className="flex-shrink-0 w-44 group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center">
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">{video.duration}</div>
                      )}
                      <div className="absolute top-1 left-1">
                        <Youtube className="w-4 h-4 text-[#FF0000]" />
                      </div>
                    </div>
                    <p className="text-white/80 text-xs line-clamp-2">{video.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
