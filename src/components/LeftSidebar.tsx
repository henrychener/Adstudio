"use client";

import { useState } from "react";
import { Image, Sparkles, Settings } from "lucide-react";

const ASSET_THUMBNAILS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&h=200&fit=crop",
    alt: "Neon corridor",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
    alt: "Abstract glass",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop",
    alt: "Retro tech",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=200&fit=crop",
    alt: "Abstract burst",
  },
];

const PROJECTS = [
  {
    id: 1,
    name: "Summer_Campaign_v2",
    date: "2 DAYS AGO",
    thumb:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=60&h=60&fit=crop",
  },
  {
    id: 2,
    name: "Product_Teaser_Final",
    date: "YESTERDAY",
    thumb:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=60&h=60&fit=crop",
  },
];

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<"assets" | "templates">("assets");

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

      {/* Asset Grid */}
      <div className="px-3 pt-3 grid grid-cols-2 gap-2 flex-1 overflow-y-auto content-start">
        {ASSET_THUMBNAILS.map((asset) => (
          <div
            key={asset.id}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#e11d48]/40 transition-all"
          >
            <img
              src={asset.src}
              alt={asset.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="border-t border-[#e5e7eb] px-4 pt-3 pb-3">
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
                <img
                  src={project.thumb}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1a1a1a] leading-tight">
                  {project.name}
                </p>
                <p className="text-[9px] text-[#9ca3af] uppercase">
                  {project.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
