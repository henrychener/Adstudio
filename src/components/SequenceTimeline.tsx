"use client";

import { useEffect, useRef, useCallback } from "react";
import { Plus, GripHorizontal } from "lucide-react";

const CLIPS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=240&h=144&fit=crop",
    label: "04s",
    active: true,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=240&h=144&fit=crop",
    label: "08s",
    active: false,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=240&h=144&fit=crop",
    label: "12s",
    active: false,
  },
];

export default function SequenceTimeline() {
  const panelRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    // Position at bottom of workspace area
    const workspaceLeft = 230;
    const workspaceRight = 316;
    const workspaceWidth = window.innerWidth - workspaceLeft - workspaceRight;
    const x = workspaceLeft + Math.round((workspaceWidth - el.offsetWidth) / 2);
    const y = window.innerHeight - el.offsetHeight - 16;
    posRef.current = { x, y };
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      nodeX: posRef.current.x,
      nodeY: posRef.current.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !panelRef.current) return;
    e.preventDefault();
    const x = dragRef.current.nodeX + (e.clientX - dragRef.current.startX);
    const y = dragRef.current.nodeY + (e.clientY - dragRef.current.startY);
    posRef.current = { x, y };
    panelRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !panelRef.current) return;
    const x = dragRef.current.nodeX + (e.clientX - dragRef.current.startX);
    const y = dragRef.current.nodeY + (e.clientY - dragRef.current.startY);
    posRef.current = { x, y };
    panelRef.current.style.transform = `translate(${x}px, ${y}px)`;
    dragRef.current = null;
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed top-0 left-0 z-40 flex flex-col select-none"
      style={{ willChange: "transform" }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center h-5 cursor-move"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <GripHorizontal className="w-3.5 h-3.5 text-[#c0c0c0]" />
      </div>

      {/* Timeline card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
            Sequence Timeline
          </h3>
          <span className="text-[10px] font-semibold text-[#e11d48] bg-[#fef2f2] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Live Preview
          </span>
        </div>
        <div className="flex items-center gap-3">
          {CLIPS.map((clip) => (
            <div
              key={clip.id}
              className={`w-[100px] h-[60px] rounded-lg overflow-hidden relative flex-shrink-0 cursor-pointer transition-colors ${
                clip.active
                  ? "border-2 border-[#e11d48]"
                  : "border border-[#e5e7eb] hover:border-[#e11d48]"
              }`}
            >
              <img
                src={clip.src}
                alt={`Clip ${clip.id}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <span className="absolute bottom-1 right-1.5 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
                {clip.label}
              </span>
            </div>
          ))}
          <div className="w-[100px] h-[60px] rounded-lg border-2 border-dashed border-[#d1d5db] flex flex-col items-center justify-center cursor-pointer hover:border-[#e11d48] hover:bg-[#fef2f2] transition-colors flex-shrink-0">
            <Plus className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[9px] text-[#9ca3af] mt-0.5 uppercase tracking-wider">Add Clip</span>
          </div>
        </div>
      </div>
    </div>
  );
}
