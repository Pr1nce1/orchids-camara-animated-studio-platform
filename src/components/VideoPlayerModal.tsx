"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, Share2 } from "lucide-react";
import { PortfolioItem } from "@/lib/store";

interface VideoPlayerModalProps {
  videos: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function VideoPlayerModal({ videos, currentIndex, onClose, onNavigate }: VideoPlayerModalProps) {
  const currentVideo = videos[currentIndex];

  const goToPrev = () => onNavigate((currentIndex - 1 + videos.length) % videos.length);
  const goToNext = () => onNavigate((currentIndex + 1) % videos.length);

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
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

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

      <motion.div
        key={currentVideo.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#132238] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xl font-display font-bold text-white">{currentVideo.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {currentVideo.category.map((cat) => (
                <span key={cat} className="px-2 py-0.5 bg-[#0288D1]/30 text-[#4FC3F7] text-xs rounded">{cat}</span>
              ))}
              {currentVideo.location && <span className="text-white/50 text-sm">• {currentVideo.location}</span>}
            </div>
          </div>

          <div className="relative aspect-video bg-black">
            {currentVideo.youtubeUrl ? (
              <iframe
                src={`${currentVideo.youtubeUrl}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={currentVideo.mediaUrl}
                poster={currentVideo.thumbnailUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>

          {currentVideo.description && (
            <div className="p-4 border-t border-white/10">
              <p className="text-white/70 text-sm">{currentVideo.description}</p>
            </div>
          )}
        </div>

        {videos.length > 1 && (
          <div className="mt-6">
            <h4 className="text-white/80 text-sm font-medium mb-3">More Videos</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {videos.filter((_, i) => i !== currentIndex).slice(0, 5).map((video, index) => {
                const actualIndex = videos.findIndex(v => v.id === video.id);
                return (
                  <button
                    key={video.id}
                    onClick={() => onNavigate(actualIndex)}
                    className="flex-shrink-0 w-40 group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" fill="white" />
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">{video.duration}</div>
                      )}
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
