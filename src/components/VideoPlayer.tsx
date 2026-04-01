"use client";

import { useState } from "react";
import {
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Sparkles,
  SlidersHorizontal,
  Type,
  Plus,
} from "lucide-react";

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed top-[72px] left-[230px] right-[316px] bottom-4 flex flex-col z-30">
      {/* Floating Toolbar */}
      <div className="flex items-center justify-center gap-2 py-3">
        <div className="flex items-center gap-1 bg-white rounded-full shadow-sm border border-[#e5e7eb] px-1.5 py-1">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-[#1a1a1a] hover:bg-[#f3f4f6] transition-colors">
            <Sparkles className="w-4 h-4 text-[#e11d48]" />
            Remix
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-[#1a1a1a] hover:bg-[#f3f4f6] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-[#1a1a1a] hover:bg-[#f3f4f6] transition-colors">
            <Type className="w-4 h-4" />
            Text
          </button>
        </div>
      </div>

      {/* Video Preview - centered on canvas */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-4">
        <div className="relative w-full max-w-[680px] aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden shadow-xl">
          {/* Video placeholder - city night scene */}
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1280&h=720&fit=crop"
            alt="City night scene"
            className="w-full h-full object-cover"
          />

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-12">
            {/* Progress Bar */}
            <div className="w-full h-[3px] bg-white/20 rounded-full mb-3 relative cursor-pointer group">
              <div
                className="h-full bg-[#e11d48] rounded-full"
                style={{ width: "30%" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#e11d48] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: "30%" }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="text-white/70 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" fill="currentColor" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6" fill="currentColor" />
                </button>
                <button className="text-white/70 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" fill="currentColor" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-white/90 text-sm font-mono tracking-wide">
                  01:24 / 04:30
                </span>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sequence Timeline - floating at bottom */}
      <div className="mx-4 mt-3 bg-white rounded-xl shadow-sm border border-[#e5e7eb] px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
            Sequence Timeline
          </h3>
          <span className="text-[10px] font-semibold text-[#e11d48] bg-[#fef2f2] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Clip 1 */}
          <div className="w-[120px] h-[72px] rounded-lg overflow-hidden border-2 border-[#e11d48] relative flex-shrink-0 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=240&h=144&fit=crop"
              alt="Clip 1"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1.5 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
              04s
            </span>
          </div>

          {/* Clip 2 */}
          <div className="w-[120px] h-[72px] rounded-lg overflow-hidden border border-[#e5e7eb] relative flex-shrink-0 cursor-pointer hover:border-[#e11d48] transition-colors">
            <img
              src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=240&h=144&fit=crop"
              alt="Clip 2"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1.5 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
              08s
            </span>
          </div>

          {/* Clip 3 */}
          <div className="w-[120px] h-[72px] rounded-lg overflow-hidden border border-[#e5e7eb] relative flex-shrink-0 cursor-pointer hover:border-[#e11d48] transition-colors">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=240&h=144&fit=crop"
              alt="Clip 3"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1.5 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
              12s
            </span>
          </div>

          {/* Add Clip Button */}
          <div className="w-[120px] h-[72px] rounded-lg border-2 border-dashed border-[#d1d5db] flex flex-col items-center justify-center cursor-pointer hover:border-[#e11d48] hover:bg-[#fef2f2] transition-colors flex-shrink-0">
            <Plus className="w-5 h-5 text-[#9ca3af]" />
            <span className="text-[9px] text-[#9ca3af] mt-0.5 uppercase tracking-wider">
              Add Clip
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
