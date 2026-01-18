"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, Star, Quote } from "lucide-react";
import { useStore, Review } from "@/lib/store";

export default function ReviewsManager() {
  const { reviews, addReview, updateReview, deleteReview } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Review | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredReviews = reviews.filter((review) =>
    review.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  const handleSave = (review: Review) => {
    if (isAdding) {
      addReview({ ...review, id: `r${Date.now()}`, createdAt: new Date().toISOString() });
    } else {
      updateReview(review.id, review);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    setDeleteConfirm(null);
  };

  const openAddModal = () => {
    setIsAdding(true);
    setEditingItem({
      id: "",
      clientName: "",
      clientRole: "",
      clientPhoto: "",
      rating: 5,
      reviewText: "",
      eventType: "",
      eventDate: "",
      videoUrl: "",
      featured: false,
      status: "published",
      order: reviews.length + 1,
      createdAt: "",
    });
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : "0";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01579B]">Reviews Manager</h1>
          <p className="text-[#607D8B] mt-1">Manage client testimonials and reviews</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="px-6 py-3 bg-gradient-to-r from-[#FFB300] to-[#FFCA28] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Review
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#FFF8E1] flex items-center justify-center">
              <Star className="w-7 h-7 text-[#FFB300]" fill="#FFB300" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#263238]">{averageRating}</p>
              <p className="text-[#607D8B] text-sm">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#E3F2FD] flex items-center justify-center">
              <Quote className="w-7 h-7 text-[#0288D1]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#263238]">{reviews.length}</p>
              <p className="text-[#607D8B] text-sm">Total Reviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
              <Star className="w-7 h-7 text-[#66BB6A]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#263238]">{reviews.filter(r => r.rating === 5).length}</p>
              <p className="text-[#607D8B] text-sm">5-Star Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0] mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#90A4AE]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300]/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0] ${review.status === "draft" ? "opacity-60" : ""}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src={review.clientPhoto || "https://via.placeholder.com/60"} alt={review.clientName} className="w-14 h-14 rounded-full object-cover border-2 border-[#B3E5FC]" />
                <div>
                  <h3 className="font-semibold text-[#263238]">{review.clientName}</h3>
                  <p className="text-sm text-[#607D8B]">{review.clientRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingItem(review)} className="p-2 text-[#0288D1] hover:bg-[#E3F2FD] rounded-lg transition-colors">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => setDeleteConfirm(review.id)} className="p-2 text-[#EF5350] hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < review.rating ? "text-[#FFB300]" : "text-[#E0E0E0]"}`} fill={i < review.rating ? "#FFB300" : "none"} />
              ))}
            </div>

            <p className="text-[#607D8B] leading-relaxed mb-4 line-clamp-3">&ldquo;{review.reviewText}&rdquo;</p>

            <div className="flex items-center justify-between pt-4 border-t border-[#E0E0E0]">
              <div className="flex items-center gap-2">
                {review.featured && (
                  <span className="px-2 py-1 bg-[#FFF8E1] text-[#FFB300] text-xs font-medium rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3" fill="#FFB300" />
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-lg ${review.status === "published" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {review.status}
                </span>
              </div>
              <span className="text-xs text-[#90A4AE]">{review.eventType}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Quote className="w-16 h-16 text-[#E0E0E0] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#607D8B]">No reviews found</h3>
          <p className="text-[#90A4AE] mt-1">Add your first client review to get started</p>
        </div>
      )}

      <AnimatePresence>
        {(editingItem || isAdding) && (
          <ReviewModal review={editingItem!} onSave={handleSave} onClose={() => { setEditingItem(null); setIsAdding(false); }} isNew={isAdding} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-display font-bold text-[#263238] mb-2">Delete Review?</h3>
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

function ReviewModal({ review, onSave, onClose, isNew }: { review: Review; onSave: (review: Review) => void; onClose: () => void; isNew: boolean; }) {
  const [form, setForm] = useState(review);
  const eventTypes = ["Wedding", "Pre-Wedding", "Corporate", "Birthday", "Event", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-display font-bold text-[#01579B]">{isNew ? "Add New Review" : "Edit Review"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-lg"><X className="w-5 h-5 text-[#607D8B]" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Client Photo URL</label>
            <input type="url" value={form.clientPhoto} onChange={(e) => setForm({ ...form, clientPhoto: e.target.value })} placeholder="https://example.com/photo.jpg" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300]/20 outline-none" />
            {form.clientPhoto && <div className="mt-3 flex justify-center"><img src={form.clientPhoto} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#B3E5FC]" /></div>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Client Name</label>
              <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300]/20 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Role/Title</label>
              <input type="text" value={form.clientRole} onChange={(e) => setForm({ ...form, clientRole: e.target.value })} placeholder="Wedding Client" className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300]/20 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="p-1">
                  <Star className={`w-8 h-8 ${star <= form.rating ? "text-[#FFB300]" : "text-[#E0E0E0]"}`} fill={star <= form.rating ? "#FFB300" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Review Text</label>
            <textarea value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} placeholder="Write the review..." rows={4} className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300]/20 outline-none resize-none" required />
            <p className="text-xs text-[#90A4AE] mt-1">{form.reviewText.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Event Type</label>
            <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300]/20 outline-none">
              <option value="">Select event type</option>
              {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded border-[#E0E0E0] text-[#FFB300] focus:ring-[#FFB300]" />
              <span className="text-[#263238]">Featured review</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.status === "published"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })} className="w-5 h-5 rounded border-[#E0E0E0] text-[#FFB300] focus:ring-[#FFB300]" />
              <span className="text-[#263238]">Published</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#FFB300] to-[#FFCA28] text-white rounded-xl font-medium">{isNew ? "Add Review" : "Save Changes"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
