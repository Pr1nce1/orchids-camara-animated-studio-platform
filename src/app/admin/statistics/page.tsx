"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Trophy,
  Heart,
  PartyPopper,
  Globe,
  Star,
  Users,
  Camera,
  Building2,
  Award,
  Zap,
} from "lucide-react";
import { useStore, Statistic } from "@/lib/store";

const iconOptions = [
  { name: "Trophy", icon: Trophy },
  { name: "Heart", icon: Heart },
  { name: "PartyPopper", icon: PartyPopper },
  { name: "Globe", icon: Globe },
  { name: "Star", icon: Star },
  { name: "Users", icon: Users },
  { name: "Camera", icon: Camera },
  { name: "Building2", icon: Building2 },
  { name: "Award", icon: Award },
  { name: "Zap", icon: Zap },
];

const colorOptions = ["#FFB300", "#EF5350", "#4FC3F7", "#66BB6A", "#7E57C2", "#FF7043", "#26A69A", "#EC407A"];

export default function StatisticsManager() {
  const { statistics, addStatistic, updateStatistic, deleteStatistic } = useStore();
  const [editingItem, setEditingItem] = useState<Statistic | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sortedStats = [...statistics].sort((a, b) => a.order - b.order);

  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find((i) => i.name === iconName);
    return found ? found.icon : Trophy;
  };

  const handleSave = (stat: Statistic) => {
    if (isAdding) {
      addStatistic({ ...stat, id: Date.now().toString(), order: statistics.length + 1 });
    } else {
      updateStatistic(stat.id, stat);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteStatistic(id);
    setDeleteConfirm(null);
  };

  const openAddModal = () => {
    setIsAdding(true);
    setEditingItem({
      id: "",
      icon: "Trophy",
      label: "",
      value: 0,
      suffix: "+",
      prefix: "",
      color: "#0288D1",
      order: statistics.length + 1,
      enabled: true,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01579B]">Statistics Manager</h1>
          <p className="text-[#607D8B] mt-1">Manage the counter statistics displayed on your website</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="px-6 py-3 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Statistic
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStats.map((stat, index) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0] ${
                !stat.enabled ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <IconComponent className="w-7 h-7" style={{ color: stat.color }} />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#90A4AE] hover:text-[#607D8B] cursor-grab">
                    <GripVertical className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingItem(stat)}
                    className="p-2 text-[#0288D1] hover:bg-[#E3F2FD] rounded-lg transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(stat.id)}
                    className="p-2 text-[#EF5350] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-4xl font-bold text-[#263238] mb-2">
                {stat.prefix}
                {stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <p className="text-[#607D8B]">{stat.label}</p>
              
              <div className="mt-4 pt-4 border-t border-[#E0E0E0] flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${stat.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {stat.enabled ? "Enabled" : "Disabled"}
                </span>
                <span className="text-xs text-[#90A4AE]">Order: {stat.order}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {(editingItem || isAdding) && (
          <StatisticModal
            statistic={editingItem!}
            onSave={handleSave}
            onClose={() => {
              setEditingItem(null);
              setIsAdding(false);
            }}
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
              <h3 className="text-xl font-display font-bold text-[#263238] mb-2">Delete Statistic?</h3>
              <p className="text-[#607D8B] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-[#EF5350] text-white rounded-xl font-medium hover:bg-[#E53935]"
                >
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

function StatisticModal({
  statistic,
  onSave,
  onClose,
  isNew,
}: {
  statistic: Statistic;
  onSave: (stat: Statistic) => void;
  onClose: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState(statistic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find((i) => i.name === iconName);
    return found ? found.icon : Trophy;
  };

  const IconComponent = getIconComponent(form.icon);

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
        className="bg-white rounded-2xl w-full max-w-lg my-8"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0]">
          <h2 className="text-xl font-display font-bold text-[#01579B]">
            {isNew ? "Add New Statistic" : "Edit Statistic"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-lg">
            <X className="w-5 h-5 text-[#607D8B]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-[#F8F9FA] rounded-xl p-4 flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${form.color}20` }}
            >
              <IconComponent className="w-8 h-8" style={{ color: form.color }} />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#263238]">
                {form.prefix}
                {form.value.toLocaleString()}
                {form.suffix}
              </div>
              <p className="text-[#607D8B]">{form.label || "Label"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setForm({ ...form, icon: opt.name })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    form.icon === opt.name
                      ? "border-[#0288D1] bg-[#E3F2FD]"
                      : "border-[#E0E0E0] hover:border-[#B3E5FC]"
                  }`}
                >
                  <opt.icon className="w-6 h-6 mx-auto" style={{ color: form.color }} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    form.color === color ? "ring-2 ring-offset-2 ring-[#0288D1]" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">Label</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g., Years of Experience"
              className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Prefix</label>
              <input
                type="text"
                value={form.prefix}
                onChange={(e) => setForm({ ...form, prefix: e.target.value })}
                placeholder="$"
                maxLength={3}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">Suffix</label>
              <input
                type="text"
                value={form.suffix}
                onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                placeholder="+"
                maxLength={3}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-[#E0E0E0] text-[#0288D1] focus:ring-[#0288D1]"
              />
              <span className="text-[#263238]">Enable on website</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-xl font-medium"
            >
              {isNew ? "Add Statistic" : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
