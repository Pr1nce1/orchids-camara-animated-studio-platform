"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut, Info } from "lucide-react";
import { PortfolioItem } from "@/lib/store";

interface PhotoLightboxProps {
  photos: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const currentPhoto = photos[currentIndex];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
  };

  const goToPrev = () => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
    setZoom(1);
  };

  const goToNext = () => {
    onNavigate((currentIndex + 1) % photos.length);
    setZoom(1);
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.5, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.5, 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="absolute top-4 left-4 text-white/80 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
          className={`p-2 rounded-full text-white transition-colors ${showInfo ? "bg-[#0288D1]" : "bg-white/10 hover:bg-white/20"}`}
        >
          <Info className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
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
        key={currentPhoto.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-[90vw] max-h-[85vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          src={currentPhoto.mediaUrl || currentPhoto.thumbnailUrl}
          alt={currentPhoto.title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          style={{ transform: `scale(${zoom})` }}
          transition={{ duration: 0.2 }}
          draggable={false}
        />

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-black/80 backdrop-blur-sm p-6 rounded-r-lg"
            >
              <h3 className="text-xl font-display font-bold text-white mb-4">{currentPhoto.title}</h3>
              
              <div className="space-y-4 text-sm">
                {currentPhoto.category.length > 0 && (
                  <div>
                    <p className="text-white/50 mb-1">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {currentPhoto.category.map((cat) => (
                        <span key={cat} className="px-2 py-1 bg-[#0288D1]/30 text-[#4FC3F7] rounded">{cat}</span>
                      ))}
                    </div>
                  </div>
                )}

                {currentPhoto.description && (
                  <div>
                    <p className="text-white/50 mb-1">Description</p>
                    <p className="text-white/80">{currentPhoto.description}</p>
                  </div>
                )}

                {currentPhoto.location && (
                  <div>
                    <p className="text-white/50 mb-1">Location</p>
                    <p className="text-white/80">{currentPhoto.location}</p>
                  </div>
                )}

                {currentPhoto.dateTaken && (
                  <div>
                    <p className="text-white/50 mb-1">Date</p>
                    <p className="text-white/80">{new Date(currentPhoto.dateTaken).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 pb-2">
        {photos.slice(0, 10).map((photo, index) => (
          <button
            key={photo.id}
            onClick={(e) => { e.stopPropagation(); onNavigate(index); setZoom(1); }}
            className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
              index === currentIndex ? "ring-2 ring-[#4FC3F7] opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            <img src={photo.thumbnailUrl || photo.mediaUrl} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
