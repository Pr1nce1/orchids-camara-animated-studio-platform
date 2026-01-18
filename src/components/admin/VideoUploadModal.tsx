"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Upload, Video, CheckCircle, AlertCircle, Loader2, Play } from "lucide-react";

interface UploadedVideo {
  id: string;
  file: File;
  preview: string;
  thumbnailUrl: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  dataUrl: string;
  duration: string;
}

interface VideoUploadModalProps {
  onUploadComplete: (videos: {
    dataUrl: string;
    thumbnailUrl: string;
    fileName: string;
    duration: string;
    categories: string[];
    status: "published" | "draft";
    featured: boolean;
    description: string;
    location: string;
  }[]) => void;
  onClose: () => void;
}

export function VideoUploadModal({ onUploadComplete, onClose }: VideoUploadModalProps) {
  const [step, setStep] = useState<"upload" | "progress" | "details">("upload");
  const [files, setFiles] = useState<UploadedVideo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoForms, setVideoForms] = useState<{
    title: string;
    categories: string[];
    status: "published" | "draft";
    featured: boolean;
    description: string;
    location: string;
  }[]>([]);

  const categoryOptions = ["Wedding", "Pre-Wedding", "Candid", "Event", "Corporate"];

  const extractThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        video.currentTime = video.duration * 0.25;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
        URL.revokeObjectURL(video.src);
        resolve(thumbnailUrl);
      };

      video.onerror = () => {
        resolve("https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80");
      };
    });
  };

  const extractDuration = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(videoFile);

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        URL.revokeObjectURL(video.src);
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      };

      video.onerror = () => {
        resolve("0:00");
      };
    });
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter((file) => {
      const isValid = file.type.startsWith("video/");
      const isValidSize = file.size <= 500 * 1024 * 1024;
      return isValid && isValidSize;
    });

    if (validFiles.length === 0) return;

    setStep("progress");

    const newFiles: UploadedVideo[] = [];
    const newForms: typeof videoForms = [];

    for (const file of validFiles) {
      const preview = URL.createObjectURL(file);
      const [thumbnailUrl, duration, dataUrl] = await Promise.all([
        extractThumbnail(file),
        extractDuration(file),
        readFileAsDataUrl(file),
      ]);

      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        thumbnailUrl,
        progress: 0,
        status: "pending",
        dataUrl,
        duration,
      });

      newForms.push({
        title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        categories: [],
        status: "published",
        featured: false,
        description: "",
        location: "",
      });
    }

    setFiles(newFiles);
    setVideoForms(newForms);
    simulateUpload(newFiles);
  }, []);

  const simulateUpload = async (uploadFiles: UploadedVideo[]) => {
    const totalFiles = uploadFiles.length;
    let completedFiles = 0;

    for (let i = 0; i < uploadFiles.length; i++) {
      const uploadFile = uploadFiles[i];
      
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
      );

      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise((r) => setTimeout(r, 30));
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, progress } : f))
        );
      }

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "complete", progress: 100 } : f))
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

  const handleCategoryToggle = (index: number, cat: string) => {
    setVideoForms((prev) =>
      prev.map((form, i) =>
        i === index
          ? {
              ...form,
              categories: form.categories.includes(cat)
                ? form.categories.filter((c) => c !== cat)
                : [...form.categories, cat],
            }
          : form
      )
    );
  };

  const updateForm = (index: number, field: string, value: any) => {
    setVideoForms((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [field]: value } : form))
    );
  };

  const handleSaveAll = () => {
    const videos = files.map((f, i) => ({
      dataUrl: f.dataUrl,
      thumbnailUrl: f.thumbnailUrl,
      fileName: f.file.name,
      duration: f.duration,
      ...videoForms[i],
    }));
    onUploadComplete(videos);
    onClose();
  };

  const currentFile = files[currentEditIndex];
  const currentForm = videoForms[currentEditIndex];

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
            {step === "upload" && "Upload Videos"}
            {step === "progress" && `Uploading ${files.length} Videos...`}
            {step === "details" && `${files.length} Videos Uploaded Successfully!`}
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
                    ? "border-[#7E57C2] bg-[#EDE7F6]"
                    : "border-[#E0E0E0] hover:border-[#90A4AE]"
                }`}
              >
                <div className="w-16 h-16 bg-[#EDE7F6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-[#7E57C2]" />
                </div>
                <h3 className="text-lg font-semibold text-[#263238] mb-2">
                  Drag & Drop Videos Here
                </h3>
                <p className="text-[#607D8B] mb-4">or click to browse</p>
                <p className="text-sm text-[#90A4AE]">
                  Supported: MP4, MOV, AVI, WebM | Max size: 500MB per file | Max files: 10
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-6 py-4 bg-gradient-to-r from-[#7E57C2] to-[#9575CD] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <Video className="w-5 h-5" />
                Browse Video Files from Computer
              </button>
            </div>
          )}

          {step === "progress" && (
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={file.id} className="bg-[#F8F9FA] rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg bg-black relative overflow-hidden">
                      {file.thumbnailUrl && (
                        <img
                          src={file.thumbnailUrl}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" fill="white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#263238] truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-[#90A4AE]">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <Loader2 className="w-5 h-5 text-[#7E57C2] animate-spin" />
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
                      className="h-full bg-gradient-to-r from-[#7E57C2] to-[#9575CD]"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ))}

              <div className="bg-[#EDE7F6] rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#7E57C2]">Overall Progress</span>
                  <span className="text-sm font-bold text-[#7E57C2]">{overallProgress}%</span>
                </div>
                <div className="h-3 bg-[#D1C4E9] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#7E57C2] to-[#9575CD]"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-[#7E57C2] mt-2">
                  {files.filter((f) => f.status === "complete").length} of {files.length} completed
                </p>
              </div>
            </div>
          )}

          {step === "details" && currentFile && currentForm && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 p-3 bg-[#E8F5E9] rounded-xl">
                  <CheckCircle className="w-5 h-5 text-[#66BB6A]" />
                  <span className="text-sm text-[#2E7D32] font-medium">
                    Edit Video {currentEditIndex + 1} of {files.length}
                  </span>
                </div>
                {files.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentEditIndex(Math.max(0, currentEditIndex - 1))}
                      disabled={currentEditIndex === 0}
                      className="px-3 py-1 rounded-lg bg-[#F8F9FA] text-[#607D8B] disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setCurrentEditIndex(Math.min(files.length - 1, currentEditIndex + 1))}
                      disabled={currentEditIndex === files.length - 1}
                      className="px-3 py-1 rounded-lg bg-[#F8F9FA] text-[#607D8B] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <img
                  src={currentFile.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-7 h-7 text-[#7E57C2] ml-1" fill="#7E57C2" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-sm font-medium rounded">
                  {currentFile.duration}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#263238] mb-2">Title</label>
                <input
                  type="text"
                  value={currentForm.title}
                  onChange={(e) => updateForm(currentEditIndex, "title", e.target.value)}
                  placeholder="Video title"
                  className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#7E57C2] focus:ring-2 focus:ring-[#7E57C2]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#263238] mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(currentEditIndex, cat)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentForm.categories.includes(cat)
                          ? "bg-[#7E57C2] text-white"
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
                  value={currentForm.description}
                  onChange={(e) => updateForm(currentEditIndex, "description", e.target.value)}
                  placeholder="Video description"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#7E57C2] focus:ring-2 focus:ring-[#7E57C2]/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#263238] mb-2">Location</label>
                  <input
                    type="text"
                    value={currentForm.location}
                    onChange={(e) => updateForm(currentEditIndex, "location", e.target.value)}
                    placeholder="Chennai, India"
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#7E57C2] focus:ring-2 focus:ring-[#7E57C2]/20 outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentForm.featured}
                      onChange={(e) => updateForm(currentEditIndex, "featured", e.target.checked)}
                      className="w-4 h-4 rounded text-[#7E57C2]"
                    />
                    <span className="text-[#263238]">Featured video</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentForm.status === "published"}
                      onChange={(e) =>
                        updateForm(currentEditIndex, "status", e.target.checked ? "published" : "draft")
                      }
                      className="w-4 h-4 rounded text-[#7E57C2]"
                    />
                    <span className="text-[#263238]">Published</span>
                  </label>
                </div>
              </div>

              {files.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-[#263238] mb-3">All Videos</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {files.map((file, i) => (
                      <button
                        key={file.id}
                        onClick={() => setCurrentEditIndex(i)}
                        className={`flex-shrink-0 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                          i === currentEditIndex ? "border-[#7E57C2]" : "border-transparent"
                        }`}
                      >
                        <div className="aspect-video relative">
                          <img
                            src={file.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 text-white text-[10px] rounded">
                            {file.duration}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              className="flex-1 py-3 bg-gradient-to-r from-[#7E57C2] to-[#9575CD] text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              Save & Publish All
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
