"use client";

import { useEffect, useRef, useCallback } from "react";
import { Sparkles, SlidersHorizontal, Type, GripHorizontal } from "lucide-react";

export default function Toolbar() {
  const panelRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    // Center horizontally in the workspace area (between sidebars)
    const workspaceLeft = 230;
    const workspaceRight = 316;
    const workspaceWidth = window.innerWidth - workspaceLeft - workspaceRight;
    const x = workspaceLeft + Math.round((workspaceWidth - el.offsetWidth) / 2);
    const y = 72;
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
      className="fixed top-0 left-0 z-40 flex flex-col items-center gap-1 select-none"
      style={{ willChange: "transform" }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center w-full h-5 cursor-move"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <GripHorizontal className="w-3.5 h-3.5 text-[#c0c0c0]" />
      </div>

      {/* Toolbar pill */}
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
  );
}
