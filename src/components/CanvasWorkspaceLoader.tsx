"use client";

// This file exists because Next.js 16 requires ssr:false inside a client component.
// StudioLayout now owns CanvasWorkspace directly with dynamic(), so this loader
// is no longer needed as a standalone — kept for potential future use.
export default function CanvasWorkspaceLoader() {
  return null;
}
