"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  dataUrl: string;
}

interface PhotoUploadModalProps {
  onUploadComplete: (photos: { dataUrl: string; fileName: string }[]) => void;
  onClose: () => void;
}

export function PhotoUploadModal({ onUploadComplete, onClose }: PhotoUploadModalProps) {
  const [step, setStep] = useState<"upload" | "progress" | "details">("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bulkForm, setBulkForm] = useState({
    categories: [] as string[],
    status: "published" as "published" | "draft",
    featured: false,
    description: "",
    location: "",
    dateTaken: "",
  });

  const categoryOptions = ["Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

  const handleFiles = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValid && isValidSize;
    });

    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = await Promise.all(
      validFiles.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const dataUrl = await readFileAsDataUrl(file);
        return {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          progress: 0,
          status: "pending" as const,
          dataUrl,
        };
      })
    );

    setFiles((prev) => [...prev, ...newFiles]);
    setStep("progress");
    simulateUpload(newFiles);
  }, []);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const simulateUpload = async (uploadFiles: UploadedFile[]) => {
    const totalFiles = uploadFiles.length;
    let completedFiles = 0;

    for (const uploadFile of uploadFiles) {
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading" } : f))
      );

      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((r) => setTimeout(r, 50));
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f))
        );
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "complete", progress: 100 } : f))
      );

      completedFiles++;
      setOverallProgress(Math.round((completedFiles / totalFiles) * 100));
    }

    setTimeout(() => setStep("details"), 500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleCategoryToggle = (cat: string) => {
    setBulkForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSaveAll = () => {
    const photos = files.map((f) => ({
      dataUrl: f.dataUrl,
      fileName: f.file.name,
      ...bulkForm,
    }));
    onUploadComplete(photos);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0]">
          <h2 className="text-xl font-display font-bold text-[#01579B]">
            {step === "upload" && "Upload Photos"}
            {step === "progress" && `Uploading ${files.length} Photos...`}
            {step === "details" && `${files.length} Photos Uploaded Successfully!`}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F9FA] rounded-lg">
            <X className="w-5 h-5 text-[#607D8B]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "upload" && (
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging
                    ? "border-[#0288D1] bg-[#E3F2FD]"
                    : "border-[#E0E0E0] hover:border-[#90A4AE]"
                }`}
              >
                <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-[#0288D1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#263238] mb-2">
                  Drag & Drop Photos Here
                </h3>
                <p className="text-[#607D8B] mb-4">or click to browse</p>
                <p className="text-sm text-[#90A4AE]">
                  Supported: JPG, PNG, WebP | Max size: 10MB per file | Max files: 50
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-6 py-4 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <ImageIcon className="w-5 h-5" />
                Browse Files from Computer
              </button>
            </div>
          )}

          {step === "progress" && (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="bg-[#F8F9FA] rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#263238] truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-[#90A4AE]">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <Loader2 className="w-5 h-5 text-[#0288D1] animate-spin" />
                      )}
                      {file.status === "complete" && (
                        <CheckCircle className="w-5 h-5 text-[#66BB6A]" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-[#EF5350]" />
                      )}
                      <span className="text-sm font-medium text-[#607D8B] w-12 text-right">
                        {file.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0288D1] to-[#4FC3F7]"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ))}

              <div className="bg-[#E3F2FD] rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#0288D1]">Overall Progress</span>
                  <span className="text-sm font-bold text-[#0288D1]">{overallProgress}%</span>
                </div>
                <div className="h-3 bg-[#B3E5FC] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0288D1] to-[#4FC3F7]"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-[#0288D1] mt-2">
                  {files.filter((f) => f.status === "complete").length} of {files.length} completed
                </p>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-[#E8F5E9] rounded-xl">
                <CheckCircle className="w-6 h-6 text-[#66BB6A]" />
                <span className="text-[#2E7D32] font-medium">
                  {files.length} photos uploaded successfully!
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#263238] mb-2">
                  Category (select one or more)
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        bulkForm.categories.includes(cat)
                          ? "bg-[#0288D1] text-white"
                          : "bg-[#F8F9FA] text-[#607D8B] hover:bg-[#E0E0E0]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#263238] mb-2">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={bulkForm.status === "published"}
                        onChange={() => setBulkForm({ ...bulkForm, status: "published" })}
                        className="w-4 h-4 text-[#0288D1]"
                      />
                      <span className="text-[#263238]">Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={bulkForm.status === "draft"}
                        onChange={() => setBulkForm({ ...bulkForm, status: "draft" })}
                        className="w-4 h-4 text-[#0288D1]"
                      />
                      <span className="text-[#263238]">Draft</span>
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#263238] mb-2">Featured</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulkForm.featured}
                      onChange={(e) => setBulkForm({ ...bulkForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0288D1]"
                    />
                    <span className="text-[#263238]">Mark all as featured</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#263238] mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={bulkForm.description}
                  onChange={(e) => setBulkForm({ ...bulkForm, description: e.target.value })}
                  placeholder="Description for all photos"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#263238] mb-2">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={bulkForm.location}
                    onChange={(e) => setBulkForm({ ...bulkForm, location: e.target.value })}
                    placeholder="Chennai, India"
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#263238] mb-2">
                    Date Taken (optional)
                  </label>
                  <input
                    type="date"
                    value={bulkForm.dateTaken}
                    onChange={(e) => setBulkForm({ ...bulkForm, dateTaken: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#263238] mb-3">
                  Preview of uploaded photos
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {files.slice(0, 8).map((file) => (
                    <div key={file.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {files.length > 8 && (
                    <div className="aspect-square rounded-lg bg-[#F8F9FA] flex items-center justify-center">
                      <span className="text-[#607D8B] font-medium">+{files.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {step === "details" && (
          <div className="p-6 border-t border-[#E0E0E0] flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-[#E0E0E0] rounded-xl text-[#607D8B] font-medium hover:bg-[#F8F9FA]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="flex-1 py-3 bg-gradient-to-r from-[#66BB6A] to-[#81C784] text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              Save All & Publish
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
