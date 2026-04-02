"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Image, Sparkles, Settings, Upload, Film, Loader2, Plus } from "lucide-react";
import { VideoAsset, uploadVideo, listVideos } from "@/lib/videoStorage";

const PROJECTS = [
  {
    id: 1,
    name: "Summer_Campaign_v2",
    date: "2 DAYS AGO",
    thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=60&h=60&fit=crop",
  },
  {
    id: 2,
    name: "Product_Teaser_Final",
    date: "YESTERDAY",
    thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=60&h=60&fit=crop",
  },
];

interface Props {
  onAddToCanvas: (asset: VideoAsset) => void;
}

export default function LeftSidebar({ onAddToCanvas }: Props) {
  const [activeTab, setActiveTab] = useState<"assets" | "templates">("assets");
  const [videos, setVideos] = useState<VideoAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listVideos();
      setVideos(list);
    } catch {
      // Supabase not configured yet — fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "assets") fetchVideos();
  }, [activeTab, fetchVideos]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const asset = await uploadVideo(file);
      setVideos((prev) => [asset, ...prev]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <aside className="fixed left-4 top-[72px] bottom-4 w-[210px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
          Library
        </p>
        <h2 className="text-base font-bold text-[#1a1a1a] mt-0.5">
          Creative Assets
        </h2>
      </div>

      {/* Tabs */}
      <div className="px-3 flex flex-col gap-1">
        <button
          onClick={() => setActiveTab("assets")}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeTab === "assets"
              ? "bg-[#f3f4f6] text-[#1a1a1a] font-medium"
              : "text-[#6b7280] hover:bg-[#f9fafb]"
          }`}
        >
          <Image className="w-4 h-4 text-[#e11d48]" />
          Assets
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeTab === "templates"
              ? "bg-[#f3f4f6] text-[#1a1a1a] font-medium"
              : "text-[#6b7280] hover:bg-[#f9fafb]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Templates
        </button>
      </div>

      {activeTab === "assets" && (
        <>
          {/* Upload button */}
          <div className="px-3 pt-3">
            {/* Restrict to browser-playable formats. MOV/AVI/HEVC require server-side transcoding. */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-[#d1d5db] text-[#6b7280] text-sm hover:border-[#e11d48] hover:text-[#e11d48] hover:bg-[#fef2f2] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Video
                </>
              )}
            </button>
            {uploadError && (
              <p className="text-[11px] text-red-500 mt-1 px-1">{uploadError}</p>
            )}
          </div>

          {/* Video list */}
          <div className="px-3 pt-3 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-[#9ca3af]" />
              </div>
            ) : videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Film className="w-8 h-8 text-[#d1d5db] mb-2" />
                <p className="text-[12px] text-[#9ca3af]">No videos yet</p>
                <p className="text-[11px] text-[#c4c9d4] mt-0.5">Upload one to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {videos.map((video) => (
                  <VideoThumbnail
                    key={video.id}
                    video={video}
                    onAdd={onAddToCanvas}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "templates" && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[12px] text-[#9ca3af]">Templates coming soon</p>
        </div>
      )}

      {/* Projects Section */}
      <div className="border-t border-[#e5e7eb] px-4 pt-3 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
            Projects
          </p>
          <button className="text-[#9ca3af] hover:text-[#6b7280]">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-2.5 cursor-pointer hover:bg-[#f9fafb] rounded-lg p-1.5 -mx-1.5 transition-colors"
            >
              <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                <img src={project.thumb} alt={project.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">{project.name}</p>
                <p className="text-[9px] text-[#9ca3af] uppercase">{project.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Separate component so each thumbnail manages its own video preview
function VideoThumbnail({ video, onAdd }: { video: VideoAsset; onAdd: (v: VideoAsset) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play().catch(() => {});
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-[#0a0a0a]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        preload="metadata"
        muted
        loop
        playsInline
        onError={() => {/* format unsupported — thumbnail stays black */}}
      />

      {/* Overlay with add button on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={() => onAdd(video)}
          className="flex items-center gap-1 bg-white text-[#1a1a1a] text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#f3f4f6] transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Filename label */}
      <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-[9px] text-white/90 truncate">{video.name}</p>
      </div>
    </div>
  );
}
