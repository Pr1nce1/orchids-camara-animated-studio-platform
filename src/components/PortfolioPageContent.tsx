"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, LayoutGrid, Image, Video, Youtube, Play, Star, ChevronDown, VolumeX } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import { YouTubePlayerModal } from "@/components/YouTubePlayerModal";
import { useStore, PortfolioItem, YouTubeVideo } from "@/lib/store";

const tabs = [
  { id: "all", label: "All Portfolio", href: "/portfolio", icon: LayoutGrid },
  { id: "photos", label: "Photos", href: "/portfolio/photos", icon: Image },
  { id: "videos", label: "Videos", href: "/portfolio/videos", icon: Video },
  { id: "youtube", label: "YouTube", href: "/portfolio/youtube", icon: Youtube },
];

const categories = ["All", "Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];
const sortOptions = [
  { value: "latest", label: "Latest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A-Z" },
  { value: "featured", label: "Featured First" },
];

interface PortfolioPageProps {
  activeTab: "all" | "photos" | "videos" | "youtube";
}

export function PortfolioPageContent({ activeTab }: PortfolioPageProps) {
  const portfolio = useStore((s) => s.portfolio);
  const youtubeVideos = useStore((s) => s.youtubeVideos);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [showSort, setShowSort] = useState(false);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [youtubeIndex, setYoutubeIndex] = useState(0);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const publishedPortfolio = portfolio.filter((item) => item.status === "published");
  const publishedYouTube = youtubeVideos.filter((v) => v.enabled);

  const getFilteredItems = () => {
    let items: PortfolioItem[] = [];
    
    if (activeTab === "all") {
      items = publishedPortfolio;
    } else if (activeTab === "photos") {
      items = publishedPortfolio.filter((item) => item.type === "photo");
    } else if (activeTab === "videos") {
      items = publishedPortfolio.filter((item) => item.type === "video");
    }

    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category.includes(selectedCategory));
    }

    if (searchQuery) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "oldest":
        items = [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "az":
        items = [...items].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
        items = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        items = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  };

  const getFilteredYouTube = () => {
    let items = publishedYouTube;

    if (selectedCategory !== "All") {
      items = items.filter((v) => v.category === selectedCategory);
    }

    if (searchQuery) {
      items = items.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items.sort((a, b) => a.order - b.order);
  };

  const filteredItems = getFilteredItems();
  const filteredYouTube = getFilteredYouTube();
  const photos = filteredItems.filter((item) => item.type === "photo");
  const videos = filteredItems.filter((item) => item.type === "video");

  const openPhotoLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openVideoModal = (index: number) => {
    setVideoIndex(index);
    setVideoModalOpen(true);
  };

  const openYouTubeModal = (index: number) => {
    setYoutubeIndex(index);
    setYoutubeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="bg-gradient-to-b from-[#01579B] to-[#0288D1] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Our Portfolio
              </h1>
              <p className="text-[#B3E5FC] text-lg max-w-2xl mx-auto">
                Capturing Life&apos;s Most Beautiful Moments
              </p>
              <div className="text-white/60 text-sm mt-4">
                Home &gt; Portfolio {activeTab !== "all" && `> ${tabs.find(t => t.id === activeTab)?.label}`}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="sticky top-16 z-30 bg-white border-b border-[#E0E0E0] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-2">
              {tabs.map((tab) => (
                <Link key={tab.id} href={tab.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-[#0288D1] text-white shadow-lg shadow-[#0288D1]/25"
                        : "text-[#607D8B] hover:bg-[#F8F9FA]"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#90A4AE]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portfolio..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0288D1] text-white"
                      : "bg-[#F8F9FA] text-[#607D8B] hover:bg-[#E0E0E0]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-3 bg-[#F8F9FA] rounded-xl text-[#607D8B] font-medium hover:bg-[#E0E0E0] transition-colors"
              >
                Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E0E0E0] overflow-hidden z-20"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setShowSort(false); }}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          sortBy === option.value
                            ? "bg-[#E3F2FD] text-[#0288D1]"
                            : "text-[#263238] hover:bg-[#F8F9FA]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {activeTab === "youtube" ? (
            <YouTubeGrid
              videos={filteredYouTube}
              onPlay={openYouTubeModal}
            />
          ) : (
            <PortfolioGrid
              items={filteredItems}
              photos={photos}
              onPhotoClick={openPhotoLightbox}
              onVideoClick={openVideoModal}
              hoveredVideo={hoveredVideo}
              setHoveredVideo={setHoveredVideo}
            />
          )}

          {((activeTab !== "youtube" && filteredItems.length === 0) ||
            (activeTab === "youtube" && filteredYouTube.length === 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === "youtube" ? (
                  <Youtube className="w-10 h-10 text-[#E0E0E0]" />
                ) : activeTab === "photos" ? (
                  <Image className="w-10 h-10 text-[#E0E0E0]" />
                ) : activeTab === "videos" ? (
                  <Video className="w-10 h-10 text-[#E0E0E0]" />
                ) : (
                  <LayoutGrid className="w-10 h-10 text-[#E0E0E0]" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-[#607D8B]">No items found</h3>
              <p className="text-[#90A4AE] mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {lightboxOpen && (
          <PhotoLightbox
            photos={photos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {videoModalOpen && (
          <VideoPlayerModal
            videos={videos}
            currentIndex={videoIndex}
            onClose={() => setVideoModalOpen(false)}
            onNavigate={setVideoIndex}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {youtubeModalOpen && (
          <YouTubePlayerModal
            videos={filteredYouTube}
            currentIndex={youtubeIndex}
            onClose={() => setYoutubeModalOpen(false)}
            onNavigate={setYoutubeIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PortfolioGrid({
  items,
  photos,
  onPhotoClick,
  onVideoClick,
  hoveredVideo,
  setHoveredVideo,
}: {
  items: PortfolioItem[];
  photos: PortfolioItem[];
  onPhotoClick: (index: number) => void;
  onVideoClick: (index: number) => void;
  hoveredVideo: string | null;
  setHoveredVideo: (id: string | null) => void;
}) {
  const videos = items.filter((item) => item.type === "video");
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoHover = (videoId: string, video: PortfolioItem, isHovering: boolean) => {
    if (video.videoSource !== "uploaded" || !video.mediaUrl) return;
    
    const videoEl = videoRefs.current[videoId];
    if (!videoEl) return;

    if (isHovering) {
      setHoveredVideo(videoId);
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    } else {
      setHoveredVideo(null);
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group cursor-pointer"
          onClick={() => {
            if (item.type === "photo") {
              const photoIndex = photos.findIndex((p) => p.id === item.id);
              onPhotoClick(photoIndex);
            } else {
              const videoIndex = videos.findIndex((v) => v.id === item.id);
              onVideoClick(videoIndex);
            }
          }}
          onMouseEnter={() => item.type === "video" && handleVideoHover(item.id, item, true)}
          onMouseLeave={() => item.type === "video" && handleVideoHover(item.id, item, false)}
        >
          <div className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
            hoveredVideo === item.id ? "shadow-xl shadow-[#0288D1]/30 ring-2 ring-[#4FC3F7]" : ""
          }`}>
            {item.type === "video" && item.videoSource === "uploaded" && item.mediaUrl ? (
              <>
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                    hoveredVideo === item.id ? "opacity-0 scale-110" : "opacity-100 group-hover:scale-105"
                  }`}
                />
                <video
                  ref={(el) => { videoRefs.current[item.id] = el; }}
                  src={item.mediaUrl}
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    hoveredVideo === item.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </>
            ) : (
              <img
                src={item.thumbnailUrl || item.mediaUrl}
                alt={item.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  hoveredVideo === item.id ? "scale-110" : "group-hover:scale-105"
                }`}
              />
            )}
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${
              hoveredVideo === item.id ? "opacity-60" : "opacity-70 group-hover:opacity-100"
            }`} />

            {item.type === "video" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: hoveredVideo === item.id ? 0 : 1 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                  animate={{ scale: hoveredVideo === item.id ? 0.8 : [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: hoveredVideo === item.id ? 0 : Infinity }}
                >
                  <Play className="w-6 h-6 text-[#0288D1] ml-1" fill="#0288D1" />
                </motion.div>
              </motion.div>
            )}

            {hoveredVideo === item.id && item.type === "video" && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded flex items-center gap-1 z-10">
                <VolumeX className="w-3 h-3" />
                MUTED
              </div>
            )}

            {item.featured && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#FFB300] text-white text-xs font-medium rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3" fill="white" />
                Featured
              </div>
            )}

            {item.type === "video" && item.duration && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded">
                {item.duration}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                {item.category.slice(0, 2).map((cat) => (
                  <span key={cat} className="px-2 py-0.5 bg-[#0288D1]/80 backdrop-blur-sm rounded text-white text-xs">
                    {cat}
                  </span>
                ))}
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-white text-xs flex items-center gap-1">
                  {item.type === "photo" ? <Image className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  {item.type === "photo" ? "Photo" : "Video"}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-[#4FC3F7] transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function YouTubeGrid({
  videos,
  onPlay,
}: {
  videos: YouTubeVideo[];
  onPlay: (index: number) => void;
}) {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <div>
      {featuredVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-[#607D8B] mb-3 flex items-center gap-2">
            <Youtube className="w-4 h-4 text-[#FF0000]" />
            Featured Video
          </h3>
          <div
            className="relative aspect-video max-w-4xl rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
            onClick={() => onPlay(0)}
            onMouseEnter={() => setHoveredVideo(featuredVideo.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: hoveredVideo === featuredVideo.id ? 0.5 : 1 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-[#FF0000] flex items-center justify-center shadow-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-9 h-9 text-white ml-1" fill="white" />
              </motion.div>
            </motion.div>

            <div className="absolute top-4 left-4 px-2 py-1 bg-[#FF0000] text-white text-xs font-medium rounded flex items-center gap-1">
              <Youtube className="w-3 h-3" />
              YouTube
            </div>

            {featuredVideo.duration && (
              <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 text-white text-sm font-medium rounded">
                {featuredVideo.duration}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-2xl font-display font-bold mb-2">{featuredVideo.title}</h3>
              {featuredVideo.category && (
                <span className="px-3 py-1 bg-[#FF0000]/30 text-white text-sm rounded">{featuredVideo.category}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {otherVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => onPlay(index + 1)}
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredVideo === video.id ? "scale-110" : "group-hover:scale-105"
                  }`}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: hoveredVideo === video.id ? 0.5 : 1 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full bg-[#FF0000] flex items-center justify-center shadow-xl"
                    animate={{ scale: hoveredVideo === video.id ? 1.2 : 1 }}
                  >
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </motion.div>
                </motion.div>

                <div className="absolute top-2 left-2">
                  <Youtube className="w-5 h-5 text-[#FF0000]" />
                </div>

                {video.duration && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
                    {video.duration}
                  </div>
                )}

                {hoveredVideo === video.id && (
                  <div className="absolute inset-0 border-4 border-[#FF0000] rounded-xl" />
                )}
              </div>

              <h3 className="font-semibold text-[#263238] group-hover:text-[#FF0000] transition-colors line-clamp-2">
                {video.title}
              </h3>
              {video.category && (
                <p className="text-sm text-[#607D8B] mt-1">{video.category}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
