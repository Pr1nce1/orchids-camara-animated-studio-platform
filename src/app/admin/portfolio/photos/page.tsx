"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, Star, Upload, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
import { useStore, PortfolioItem } from "@/lib/store";
import { PhotoUploadModal } from "@/components/admin/PhotoUploadModal";

const categories = ["All", "Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

export default function PhotosManager() {
  const { portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useStore();
  const photos = portfolio.filter((p) => p.type === "photo");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || photo.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleSave = (item: PortfolioItem) => {
    if (isAdding) {
      addPortfolioItem({ ...item, id: `p${Date.now()}`, createdAt: new Date().toISOString() });
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

  const handleUploadComplete = (uploadedPhotos: any[]) => {
    uploadedPhotos.forEach((photo, index) => {
      addPortfolioItem({
        id: `p${Date.now()}-${index}`,
        title: photo.fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        type: "photo",
        category: photo.categories || [],
        mediaUrl: photo.dataUrl,
        thumbnailUrl: photo.dataUrl,
        description: photo.description || "",
        clientName: "",
        location: photo.location || "",
        dateTaken: photo.dateTaken || "",
        photographer: "CAMARA Team",
        featured: photo.featured || false,
        status: photo.status || "published",
        createdAt: new Date().toISOString(),
      });
    });
  };

  const openAddModal = () => {
    setIsAdding(true);
    setEditingItem({
      id: "",
      title: "",
      type: "photo",
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
      createdAt: "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01579B]">Photos Manager</h1>
          <p className="text-[#607D8B] mt-1">Manage your photography portfolio</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Upload Photos
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-[#66BB6A] to-[#81C784] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add via URL
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
              placeholder="Search photos..."
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E0E0E0] group"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={photo.thumbnailUrl || photo.mediaUrl}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => setEditingItem(photo)}
                  className="p-3 bg-white rounded-full text-[#0288D1] hover:bg-[#E3F2FD]"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(photo.id)}
                  className="p-3 bg-white rounded-full text-[#EF5350] hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {photo.featured && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#FFB300] text-white text-xs font-medium rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3" fill="white" />
                  Featured
                </div>
              )}
              <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-lg ${
                photo.status === "published" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}>
                {photo.status}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#263238] truncate">{photo.title}</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {photo.category.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 bg-[#E3F2FD] text-[#0288D1] text-xs rounded">
                    {cat}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#90A4AE] mt-2">{photo.location}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-[#E0E0E0] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#607D8B]">No photos found</h3>
          <p className="text-[#90A4AE] mt-1">Try adjusting your filters or upload new photos</p>
        </div>
      )}

      <AnimatePresence>
        {showUploadModal && (
          <PhotoUploadModal
            onUploadComplete={handleUploadComplete}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(editingItem || isAdding) && (
          <PhotoModal
            item={editingItem!}
            onSave={handleSave}
            onClose={() => { setEditingItem(null); setIsAdding(false); }}
            isNew={isAdding}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-display font-bold text-[#263238] mb-2">Delete Photo?</h3>
              <p className="text-[#607D8B] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-[#EF5350] text-white rounded-xl font-medium hover:bg-[#E53935]">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotoModal({ item, onSave, onClose, isNew }: { item: PortfolioItem; onSave: (item: PortfolioItem) => void; onClose: () => void; isNew: boolean; }) {
  const [form, setForm] = useState(item);
  const categoryOptions = ["Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

  const handleCategoryToggle = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-display font-bold text-[#01579B]">
            {isNew ? "Add Photo via URL" : "Edit Photo"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-lg">
            <X className="w-5 h-5 text-[#607D8B]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Image URL</label>
            <input
              type="url"
              value={form.mediaUrl}
              onChange={(e) => setForm({ ...form, mediaUrl: e.target.value, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              required
            />
            {form.mediaUrl && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img src={form.mediaUrl} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Photo title"
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    form.category.includes(cat)
                      ? "bg-[#0288D1] text-white"
                      : "bg-[#F8F9FA] text-[#607D8B] hover:bg-[#E0E0E0]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Photo description"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Client Name</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Client name"
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-5 h-5 rounded border-[#E0E0E0] text-[#0288D1] focus:ring-[#0288D1]"
              />
              <span className="text-[#263238]">Featured photo</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.status === "published"}
                onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })}
                className="w-5 h-5 rounded border-[#E0E0E0] text-[#0288D1] focus:ring-[#0288D1]"
              />
              <span className="text-[#263238]">Published</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#66BB6A] to-[#81C784] text-white rounded-xl font-medium">
              {isNew ? "Add Photo" : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
