"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, Play, Youtube, ExternalLink } from "lucide-react";
import { useStore, YouTubeVideo } from "@/lib/store";

export default function YouTubeManager() {
  const { youtubeVideos, addYoutubeVideo, updateYoutubeVideo, deleteYoutubeVideo } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<YouTubeVideo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredVideos = youtubeVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  const handleSave = (video: YouTubeVideo) => {
    if (isAdding) {
      addYoutubeVideo({ ...video, id: `yt${Date.now()}`, createdAt: new Date().toISOString() });
    } else {
      updateYoutubeVideo(video.id, video);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteYoutubeVideo(id);
    setDeleteConfirm(null);
  };

  const openAddModal = () => {
    setIsAdding(true);
    setEditingItem({
      id: "",
      youtubeId: "",
      url: "",
      title: "",
      thumbnail: "",
      description: "",
      category: "",
      duration: "",
      order: youtubeVideos.length + 1,
      enabled: true,
      createdAt: "",
    });
  };

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match ? match[1] : "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01579B]">YouTube Videos</h1>
          <p className="text-[#607D8B] mt-1">Manage YouTube videos embedded on your website</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="px-6 py-3 bg-gradient-to-r from-[#EF5350] to-[#E57373] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add YouTube Video
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0] mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#90A4AE]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search YouTube videos..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#EF5350] focus:ring-2 focus:ring-[#EF5350]/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E0E0E0] group ${!video.enabled ? "opacity-50" : ""}`}
          >
            <div className="relative aspect-video">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#EF5350] flex items-center justify-center">
                  <Play className="w-7 h-7 text-white ml-1" fill="white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => setEditingItem(video)} className="p-3 bg-white rounded-full text-[#0288D1] hover:bg-[#E3F2FD]">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => setDeleteConfirm(video.id)} className="p-3 bg-white rounded-full text-[#EF5350] hover:bg-red-50">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#EF5350] text-white text-xs font-medium rounded-lg flex items-center gap-1">
                <Youtube className="w-3 h-3" />
                YouTube
              </div>
              {video.duration && (
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">{video.duration}</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#263238] truncate">{video.title}</h3>
              <p className="text-xs text-[#90A4AE] mt-1">{video.category}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E0E0E0]">
                <span className={`text-xs px-2 py-1 rounded-full ${video.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {video.enabled ? "Enabled" : "Disabled"}
                </span>
                <span className="text-xs text-[#90A4AE]">Order: {video.order}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Youtube className="w-16 h-16 text-[#E0E0E0] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#607D8B]">No YouTube videos found</h3>
          <p className="text-[#90A4AE] mt-1">Add your first YouTube video to get started</p>
        </div>
      )}

      <AnimatePresence>
        {(editingItem || isAdding) && (
          <YouTubeModal video={editingItem!} onSave={handleSave} onClose={() => { setEditingItem(null); setIsAdding(false); }} isNew={isAdding} />
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

function YouTubeModal({ video, onSave, onClose, isNew }: { video: YouTubeVideo; onSave: (video: YouTubeVideo) => void; onClose: () => void; isNew: boolean; }) {
  const [form, setForm] = useState(video);
  const categories = ["Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match ? match[1] : "";
  };

  const handleUrlChange = (url: string) => {
    const youtubeId = extractYoutubeId(url);
    const thumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "";
    setForm({ ...form, url, youtubeId, thumbnail });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-display font-bold text-[#01579B]">{isNew ? "Add YouTube Video" : "Edit YouTube Video"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-lg"><X className="w-5 h-5 text-[#607D8B]" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">YouTube URL</label>
            <input type="url" value={form.url} onChange={(e) => handleUrlChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=VIDEO_ID" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#EF5350] focus:ring-2 focus:ring-[#EF5350]/20 outline-none" required />
            {form.thumbnail && <div className="mt-3 rounded-xl overflow-hidden"><img src={form.thumbnail} alt="Preview" className="w-full h-48 object-cover" /></div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Video title" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#EF5350] focus:ring-2 focus:ring-[#EF5350]/20 outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#EF5350] focus:ring-2 focus:ring-[#EF5350]/20 outline-none">
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g., 8:45" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#EF5350] focus:ring-2 focus:ring-[#EF5350]/20 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Video description" rows={3} className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#EF5350] focus:ring-2 focus:ring-[#EF5350]/20 outline-none resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-5 h-5 rounded border-[#E0E0E0] text-[#EF5350] focus:ring-[#EF5350]" />
              <span className="text-[#263238]">Enable on website</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#EF5350] to-[#E57373] text-white rounded-xl font-medium">{isNew ? "Add Video" : "Save Changes"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
