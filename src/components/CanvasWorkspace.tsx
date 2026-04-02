"use client";

import { useEffect, useRef, useCallback } from "react";
import { Application, Graphics } from "pixi.js";
import VideoPlayerNode from "./VideoPlayerNode";

const GRID_SIZE = 24;
const SNAP_THRESHOLD = 8;

function drawDashedLine(
  g: Graphics,
  x1: number, y1: number,
  x2: number, y2: number,
  dash = 6, gap = 4
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len === 0) return;
  const nx = dx / len, ny = dy / len;
  let d = 0, on = true;
  while (d < len) {
    const step = Math.min(on ? dash : gap, len - d);
    if (on) {
      g.moveTo(x1 + nx * d, y1 + ny * d)
       .lineTo(x1 + nx * (d + step), y1 + ny * (d + step));
    }
    d += step;
    on = !on;
  }
}

export default function CanvasWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectionRef = useRef<Graphics | null>(null);
  const guidesRef = useRef<Graphics | null>(null);
  const pixiReadyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const app = new Application();
    let destroyed = false;

    (async () => {
      await app.init({
        canvas,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width: container.clientWidth,
        height: container.clientHeight,
      });

      if (destroyed) return;

      const guides = new Graphics();
      const selection = new Graphics();
      app.stage.addChild(guides);
      app.stage.addChild(selection);
      guidesRef.current = guides;
      selectionRef.current = selection;
      pixiReadyRef.current = true;
    })();

    const ro = new ResizeObserver(() => {
      if (!destroyed && container) {
        app.renderer.resize(container.clientWidth, container.clientHeight);
      }
    });
    ro.observe(container);

    return () => {
      destroyed = true;
      pixiReadyRef.current = false;
      ro.disconnect();
      app.destroy(false);
      selectionRef.current = null;
      guidesRef.current = null;
    };
  }, []);

  const drawSelection = useCallback((x: number, y: number, w: number, h: number) => {
    const g = selectionRef.current;
    if (!g) return;
    g.clear();
    g.roundRect(x - 4, y - 4, w + 8, h + 8, 6).stroke({ width: 2, color: 0xe11d48 });
  }, []);

  const clearGuides = useCallback(() => {
    guidesRef.current?.clear();
  }, []);

  const drawGuides = useCallback((
    snapX: number | null, snapY: number | null,
    nodeX: number, nodeY: number, nodeW: number, nodeH: number
  ) => {
    const g = guidesRef.current;
    const container = containerRef.current;
    if (!g || !container) return;
    g.clear();

    const W = container.clientWidth;
    const H = container.clientHeight;

    if (snapX !== null) drawDashedLine(g, snapX, 0, snapX, H);
    if (snapY !== null) drawDashedLine(g, 0, snapY, W, snapY);
    // Also snap lines for right/bottom edges
    if (snapX !== null && snapX === nodeX + nodeW) drawDashedLine(g, snapX, 0, snapX, H);
    if (snapY !== null && snapY === nodeY + nodeH) drawDashedLine(g, 0, snapY, W, snapY);

    if (snapX !== null || snapY !== null) {
      g.stroke({ width: 1, color: 0xe11d48, alpha: 0.75 });
    }
  }, []);

  const snapAndDraw = useCallback((
    rawX: number, rawY: number, w: number, h: number
  ): { x: number; y: number } => {
    const snappedX = Math.round(rawX / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(rawY / GRID_SIZE) * GRID_SIZE;
    const useSnapX = Math.abs(rawX - snappedX) < SNAP_THRESHOLD;
    const useSnapY = Math.abs(rawY - snappedY) < SNAP_THRESHOLD;
    const x = useSnapX ? snappedX : rawX;
    const y = useSnapY ? snappedY : rawY;

    drawSelection(x, y, w, h);
    drawGuides(useSnapX ? x : null, useSnapY ? y : null, x, y, w, h);

    return { x, y };
  }, [drawSelection, drawGuides]);

  const handleDragUpdate = useCallback((
    rawX: number, rawY: number, w: number, h: number
  ) => snapAndDraw(rawX, rawY, w, h), [snapAndDraw]);

  const handleDragEnd = useCallback((
    rawX: number, rawY: number, w: number, h: number
  ) => {
    const result = snapAndDraw(rawX, rawY, w, h);
    clearGuides();
    return result;
  }, [snapAndDraw, clearGuides]);

  const handleMount = useCallback((x: number, y: number, w: number, h: number) => {
    // PixiJS may still be initializing asynchronously; retry until ready
    let attempts = 0;
    const tryDraw = () => {
      if (pixiReadyRef.current) {
        drawSelection(x, y, w, h);
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryDraw, 50);
      }
    };
    tryDraw();
  }, [drawSelection]);

  return (
    <div
      ref={containerRef}
      className="fixed top-14 left-[230px] right-[316px] bottom-0 overflow-hidden"
    >
      {/* PixiJS WebGL canvas — behind nodes, no pointer events */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* DOM node layer */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <VideoPlayerNode
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
          onMount={handleMount}
        />
      </div>
    </div>
  );
}
