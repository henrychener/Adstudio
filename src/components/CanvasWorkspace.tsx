"use client";

import { useEffect, useRef, useCallback } from "react";
import { Application, Graphics } from "pixi.js";
import VideoPlayerNode from "./VideoPlayerNode";
import { CanvasVideoNode } from "./StudioLayout";

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

const NODE_WIDTH = 560;
const NODE_HEIGHT = 340; // approx aspect-video height at 560px wide

interface Props {
  nodes: CanvasVideoNode[];
}

export default function CanvasWorkspace({ nodes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectionRef = useRef<Graphics | null>(null);
  const guidesRef = useRef<Graphics | null>(null);
  const pixiReadyRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);

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
    // Thin, subtle border — 1px, soft gray
    g.roundRect(x - 3, y - 3, w + 6, h + 6, 6)
     .stroke({ width: 1, color: 0x888888, alpha: 0.35 });
  }, []);

  const clearGuides = useCallback(() => {
    guidesRef.current?.clear();
  }, []);

  const drawGuides = useCallback((centerX: number | null, centerY: number | null) => {
    const g = guidesRef.current;
    const container = containerRef.current;
    if (!g || !container) return;
    g.clear();

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Lines pass through the element's center point
    if (centerX !== null) drawDashedLine(g, centerX, 0, centerX, H);
    if (centerY !== null) drawDashedLine(g, 0, centerY, W, centerY);

    if (centerX !== null || centerY !== null) {
      g.stroke({ width: 1, color: 0x3b82f6, alpha: 0.7 });
    }
  }, []);

  const snapAndDraw = useCallback((
    rawX: number, rawY: number, w: number, h: number
  ): { x: number; y: number } => {
    // Snap by center point so guide lines intersect at element center
    const cx = rawX + w / 2;
    const cy = rawY + h / 2;
    const snappedCX = Math.round(cx / GRID_SIZE) * GRID_SIZE;
    const snappedCY = Math.round(cy / GRID_SIZE) * GRID_SIZE;
    const useSnapX = Math.abs(cx - snappedCX) < SNAP_THRESHOLD;
    const useSnapY = Math.abs(cy - snappedCY) < SNAP_THRESHOLD;
    const x = useSnapX ? snappedCX - w / 2 : rawX;
    const y = useSnapY ? snappedCY - h / 2 : rawY;

    drawSelection(x, y, w, h);
    drawGuides(useSnapX ? snappedCX : null, useSnapY ? snappedCY : null);

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
        {nodes.map((node, i) => {
          // Stagger new nodes so they don't all land on top of each other
          const offset = i * 40;
          return (
            <VideoPlayerNode
              key={node.id}
              src={node.src}
              name={node.name}
              initialX={offset}
              initialY={offset}
              onDragUpdate={(x, y, w, h) => {
                selectedIdRef.current = node.id;
                return handleDragUpdate(x, y, w, h);
              }}
              onDragEnd={(x, y, w, h) => {
                selectedIdRef.current = node.id;
                return handleDragEnd(x, y, w, h);
              }}
              onMount={(x, y, w, h) => {
                selectedIdRef.current = node.id;
                handleMount(x, y, w, h);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
