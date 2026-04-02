"use client";

import { useEffect, useRef, useCallback } from "react";
import { Application, Graphics } from "pixi.js";
import VideoPlayerNode from "./VideoPlayerNode";
import { CanvasVideoNode } from "./StudioLayout";

const GRID_SIZE = 24;
const SNAP_THRESHOLD = 8;

// Draw a dashed line into g (path only — caller must call g.stroke() after)
function buildDashedLine(
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

interface Props {
  nodes: CanvasVideoNode[];
}

export default function CanvasWorkspace({ nodes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiReadyRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);

  // Persistent PixiJS objects — geometry built once, only position/visibility updated during drag
  const selBoxRef = useRef<Graphics | null>(null);
  const selDimsRef = useRef({ w: 0, h: 0 });
  const vGuideRef = useRef<Graphics | null>(null);
  const hGuideRef = useRef<Graphics | null>(null);

  // RAF handle for batching PixiJS updates to one per display frame
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{
    selX: number; selY: number; selW: number; selH: number;
    cx: number | null; cy: number | null;
  } | null>(null);

  // Build/rebuild guide geometry — called on init and window resize
  const buildGuideGeometry = useCallback((W: number, H: number) => {
    const vg = vGuideRef.current;
    const hg = hGuideRef.current;
    if (!vg || !hg) return;

    vg.clear();
    buildDashedLine(vg, 0, 0, 0, H);
    vg.stroke({ width: 1, color: 0x3b82f6, alpha: 0.7 });
    vg.visible = false;

    hg.clear();
    buildDashedLine(hg, 0, 0, W, 0);
    hg.stroke({ width: 1, color: 0x3b82f6, alpha: 0.7 });
    hg.visible = false;
  }, []);

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

      // Layer order: guides behind selection box
      const vGuide = new Graphics();
      const hGuide = new Graphics();
      const selBox = new Graphics();
      app.stage.addChild(vGuide);
      app.stage.addChild(hGuide);
      app.stage.addChild(selBox);

      vGuideRef.current = vGuide;
      hGuideRef.current = hGuide;
      selBoxRef.current = selBox;
      pixiReadyRef.current = true;

      buildGuideGeometry(container.clientWidth, container.clientHeight);
    })();

    const ro = new ResizeObserver(() => {
      if (!destroyed || !pixiReadyRef.current) return;
      const W = container.clientWidth;
      const H = container.clientHeight;
      app.renderer.resize(W, H);
      buildGuideGeometry(W, H);
    });
    ro.observe(container);

    return () => {
      destroyed = true;
      pixiReadyRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      app.destroy(false);
      selBoxRef.current = null;
      vGuideRef.current = null;
      hGuideRef.current = null;
    };
  }, [buildGuideGeometry]);

  // Apply a pending PixiJS update — called inside rAF
  const flushPixiUpdate = useCallback(() => {
    rafRef.current = null;
    const p = pendingRef.current;
    if (!p) return;
    pendingRef.current = null;

    // Selection box: rebuild geometry only when node size changes, otherwise just reposition
    const sel = selBoxRef.current;
    if (sel) {
      if (selDimsRef.current.w !== p.selW || selDimsRef.current.h !== p.selH) {
        sel.clear();
        sel.roundRect(0, 0, p.selW + 6, p.selH + 6, 6)
           .stroke({ width: 1, color: 0x888888, alpha: 0.35 });
        selDimsRef.current = { w: p.selW, h: p.selH };
      }
      sel.x = p.selX - 3;
      sel.y = p.selY - 3;
    }

    // Guide lines: just toggle visibility and move — zero geometry ops
    const vg = vGuideRef.current;
    const hg = hGuideRef.current;
    if (vg) {
      vg.visible = p.cx !== null;
      if (p.cx !== null) vg.x = p.cx;
    }
    if (hg) {
      hg.visible = p.cy !== null;
      if (p.cy !== null) hg.y = p.cy;
    }
  }, []);

  // Schedule a PixiJS update — multiple pointermove events per frame collapse into one
  const scheduleUpdate = useCallback((
    selX: number, selY: number, selW: number, selH: number,
    cx: number | null, cy: number | null
  ) => {
    pendingRef.current = { selX, selY, selW, selH, cx, cy };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flushPixiUpdate);
    }
  }, [flushPixiUpdate]);

  const snapAndSchedule = useCallback((
    rawX: number, rawY: number, w: number, h: number
  ): { x: number; y: number } => {
    const cx = rawX + w / 2;
    const cy = rawY + h / 2;
    const snappedCX = Math.round(cx / GRID_SIZE) * GRID_SIZE;
    const snappedCY = Math.round(cy / GRID_SIZE) * GRID_SIZE;
    const useSnapX = Math.abs(cx - snappedCX) < SNAP_THRESHOLD;
    const useSnapY = Math.abs(cy - snappedCY) < SNAP_THRESHOLD;
    const x = useSnapX ? snappedCX - w / 2 : rawX;
    const y = useSnapY ? snappedCY - h / 2 : rawY;

    scheduleUpdate(x, y, w, h, useSnapX ? snappedCX : null, useSnapY ? snappedCY : null);
    return { x, y };
  }, [scheduleUpdate]);

  const handleDragUpdate = useCallback((rawX: number, rawY: number, w: number, h: number) =>
    snapAndSchedule(rawX, rawY, w, h), [snapAndSchedule]);

  const handleDragEnd = useCallback((rawX: number, rawY: number, w: number, h: number) => {
    const result = snapAndSchedule(rawX, rawY, w, h);
    // Hide guides on next frame after snapping to final position
    requestAnimationFrame(() => {
      if (vGuideRef.current) vGuideRef.current.visible = false;
      if (hGuideRef.current) hGuideRef.current.visible = false;
    });
    return result;
  }, [snapAndSchedule]);

  const handleMount = useCallback((x: number, y: number, w: number, h: number) => {
    let attempts = 0;
    const tryDraw = () => {
      if (pixiReadyRef.current) {
        scheduleUpdate(x, y, w, h, null, null);
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryDraw, 50);
      }
    };
    tryDraw();
  }, [scheduleUpdate]);

  return (
    <div
      ref={containerRef}
      className="fixed top-14 left-[230px] right-[316px] bottom-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {nodes.map((node, i) => (
          <VideoPlayerNode
            key={node.id}
            src={node.src}
            name={node.name}
            initialX={i * 40}
            initialY={i * 40}
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
        ))}
      </div>
    </div>
  );
}
