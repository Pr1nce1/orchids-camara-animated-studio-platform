"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, Star, Play, Video, Upload, Volume2, VolumeX } from "lucide-react";
import { useStore, PortfolioItem } from "@/lib/store";
import { VideoUploadModal } from "@/components/admin/VideoUploadModal";

const categories = ["All", "Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

export default function VideosManager() {
  const { portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useStore();
  const videos = portfolio.filter((p) => p.type === "video");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleSave = (item: PortfolioItem) => {
    if (isAdding) {
      addPortfolioItem({ ...item, id: `v${Date.now()}`, type: "video", createdAt: new Date().toISOString() });
    } else {
      updatePortfolioItem(item.id, item);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deletePortfolioItem(id);
    setDeleteConfirm(null);
  };

  const handleUploadComplete = (uploadedVideos: any[]) => {
    uploadedVideos.forEach((video, index) => {
      addPortfolioItem({
        id: `v${Date.now()}-${index}`,
        title: video.title || video.fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        type: "video",
        category: video.categories || [],
        mediaUrl: video.dataUrl,
        thumbnailUrl: video.thumbnailUrl,
        description: video.description || "",
        clientName: "",
        location: video.location || "",
        dateTaken: "",
        photographer: "CAMARA Team",
        featured: video.featured || false,
        status: video.status || "published",
        duration: video.duration || "0:00",
        videoSource: "uploaded",
        createdAt: new Date().toISOString(),
      });
    });
  };

  const openAddModal = () => {
    setIsAdding(true);
    setEditingItem({
      id: "",
      title: "",
      type: "video",
      category: [],
      mediaUrl: "",
      thumbnailUrl: "",
      description: "",
      clientName: "",
      location: "",
      dateTaken: "",
      photographer: "CAMARA Team",
      featured: false,
      status: "published",
      duration: "",
      videoSource: "youtube",
      youtubeUrl: "",
      createdAt: "",
    });
  };

  const handleVideoHover = (videoId: string, isHovering: boolean) => {
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01579B]">Videos Manager</h1>
          <p className="text-[#607D8B] mt-1">Manage your videography portfolio</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#7E57C2] to-[#9575CD] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Upload Videos
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-[#66BB6A] to-[#81C784] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add YouTube Video
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0] mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#90A4AE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === cat ? "bg-[#7E57C2] text-white" : "bg-[#F8F9FA] text-[#607D8B] hover:bg-[#E0E0E0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 group transition-all duration-300 ${
              hoveredVideo === video.id ? "border-[#7E57C2] shadow-lg shadow-[#7E57C2]/20" : "border-[#E0E0E0]"
            }`}
            onMouseEnter={() => video.videoSource === "uploaded" && handleVideoHover(video.id, true)}
            onMouseLeave={() => video.videoSource === "uploaded" && handleVideoHover(video.id, false)}
          >
            <div className="relative aspect-video">
              {video.videoSource === "uploaded" && video.mediaUrl ? (
                <>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredVideo === video.id ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    src={video.mediaUrl}
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              )}

              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                hoveredVideo === video.id ? "opacity-0" : "opacity-100"
              }`}>
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-7 h-7 text-[#7E57C2] ml-1" fill="#7E57C2" />
                </div>
              </div>

              {hoveredVideo === video.id && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded flex items-center gap-1">
                  <VolumeX className="w-3 h-3" />
                  MUTED
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                <button onClick={() => setEditingItem(video)} className="p-3 bg-white rounded-full text-[#0288D1] hover:bg-[#E3F2FD]">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => setDeleteConfirm(video.id)} className="p-3 bg-white rounded-full text-[#EF5350] hover:bg-red-50">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {video.featured && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#FFB300] text-white text-xs font-medium rounded-lg flex items-center gap-1 z-10">
                  <Star className="w-3 h-3" fill="white" />
                  Featured
                </div>
              )}

              {video.duration && (
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                  {video.duration}
                </div>
              )}

              <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-lg z-10 ${
                video.status === "published" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}>
                {video.status}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#263238] truncate">{video.title}</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {video.category.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 bg-[#EDE7F6] text-[#7E57C2] text-xs rounded">{cat}</span>
                ))}
                <span className={`px-2 py-0.5 text-xs rounded ${
                  video.videoSource === "uploaded" ? "bg-[#E3F2FD] text-[#0288D1]" : "bg-[#FFEBEE] text-[#EF5350]"
                }`}>
                  {video.videoSource === "uploaded" ? "Uploaded" : "YouTube"}
                </span>
              </div>
              <p className="text-xs text-[#90A4AE] mt-2">{video.location}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-[#E0E0E0] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#607D8B]">No videos found</h3>
          <p className="text-[#90A4AE] mt-1">Try adjusting your filters or upload new videos</p>
        </div>
      )}

      <AnimatePresence>
        {showUploadModal && (
          <VideoUploadModal
            onUploadComplete={handleUploadComplete}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(editingItem || isAdding) && (
          <VideoModal item={editingItem!} onSave={handleSave} onClose={() => { setEditingItem(null); setIsAdding(false); }} isNew={isAdding} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-display font-bold text-[#263238] mb-2">Delete Video?</h3>
              <p className="text-[#607D8B] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-[#EF5350] text-white rounded-xl font-medium hover:bg-[#E53935]">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoModal({ item, onSave, onClose, isNew }: { item: PortfolioItem; onSave: (item: PortfolioItem) => void; onClose: () => void; isNew: boolean; }) {
  const [form, setForm] = useState(item);
  const categoryOptions = ["Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

  const handleCategoryToggle = (cat: string) => {
    setForm((prev) => ({ ...prev, category: prev.category.includes(cat) ? prev.category.filter((c) => c !== cat) : [...prev.category, cat] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-display font-bold text-[#01579B]">{isNew ? "Add YouTube Video" : "Edit Video"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-lg"><X className="w-5 h-5 text-[#607D8B]" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Thumbnail URL</label>
            <input type="url" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://example.com/thumbnail.jpg" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none" required />
            {form.thumbnailUrl && <div className="mt-3 rounded-xl overflow-hidden"><img src={form.thumbnailUrl} alt="Preview" className="w-full h-48 object-cover" /></div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">YouTube Embed URL</label>
            <input type="url" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/embed/VIDEO_ID" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Video title" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g., 4:32" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button key={cat} type="button" onClick={() => handleCategoryToggle(cat)} className={`px-4 py-2 rounded-xl font-medium transition-all ${form.category.includes(cat) ? "bg-[#7E57C2] text-white" : "bg-[#F8F9FA] text-[#607D8B] hover:bg-[#E0E0E0]"}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Video description" rows={3} className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none resize-none" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded border-[#E0E0E0] text-[#7E57C2] focus:ring-[#7E57C2]" />
              <span className="text-[#263238]">Featured video</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.status === "published"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })} className="w-5 h-5 rounded border-[#E0E0E0] text-[#7E57C2] focus:ring-[#7E57C2]" />
              <span className="text-[#263238]">Published</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#7E57C2] to-[#9575CD] text-white rounded-xl font-medium">{isNew ? "Add Video" : "Save Changes"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
