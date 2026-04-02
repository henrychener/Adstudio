"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  GripHorizontal,
} from "lucide-react";

interface Props {
  src: string;
  name?: string;
  initialX?: number;
  initialY?: number;
  onDragUpdate: (x: number, y: number, w: number, h: number) => { x: number; y: number };
  onDragEnd: (x: number, y: number, w: number, h: number) => { x: number; y: number };
  onMount: (x: number, y: number, w: number, h: number) => void;
}

export default function VideoPlayerNode({
  src,
  initialX,
  initialY,
  onDragUpdate,
  onDragEnd,
  onMount,
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const container = el.parentElement;
    if (!container) return;
    const x = initialX ?? Math.max(0, Math.round((container.clientWidth - el.offsetWidth) / 2));
    const y = initialY ?? Math.max(0, Math.round((container.clientHeight - el.offsetHeight) / 2));
    posRef.current = { x, y };
    el.style.transform = `translate(${x}px, ${y}px)`;
    onMount(x, y, el.offsetWidth, el.offsetHeight);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Video play failed:", err));
    }
  }, [isPlaying]);

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
    if (!dragRef.current || !nodeRef.current) return;
    e.preventDefault();
    const el = nodeRef.current;
    const rawX = dragRef.current.nodeX + (e.clientX - dragRef.current.startX);
    const rawY = dragRef.current.nodeY + (e.clientY - dragRef.current.startY);
    const { x, y } = onDragUpdate(rawX, rawY, el.offsetWidth, el.offsetHeight);
    posRef.current = { x, y };
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, [onDragUpdate]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !nodeRef.current) return;
    const el = nodeRef.current;
    const rawX = dragRef.current.nodeX + (e.clientX - dragRef.current.startX);
    const rawY = dragRef.current.nodeY + (e.clientY - dragRef.current.startY);
    const { x, y } = onDragEnd(rawX, rawY, el.offsetWidth, el.offsetHeight);
    posRef.current = { x, y };
    el.style.transform = `translate(${x}px, ${y}px)`;
    dragRef.current = null;
  }, [onDragEnd]);

  return (
    <div
      ref={nodeRef}
      className="absolute top-0 left-0 w-[560px] flex flex-col"
      style={{ willChange: "transform" }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center h-6 cursor-move select-none"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <GripHorizontal className="w-4 h-4 text-[#c0c0c0]" />
      </div>

      {/* Video element */}
      <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          onEnded={() => setIsPlaying(false)}
          draggable={false}
        />

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-12">
          <div className="w-full h-[3px] bg-white/20 rounded-full mb-3 relative cursor-pointer group">
            <div className="h-full bg-[#e11d48] rounded-full" style={{ width: "0%" }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-white/70 hover:text-white transition-colors">
                <SkipBack className="w-5 h-5" fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                className="text-white hover:scale-110 transition-transform"
              >
                {isPlaying
                  ? <Pause className="w-6 h-6" fill="currentColor" />
                  : <Play className="w-6 h-6" fill="currentColor" />
                }
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <SkipForward className="w-5 h-5" fill="currentColor" />
              </button>
            </div>
            <div className="flex items-center gap-4">
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
  );
}
