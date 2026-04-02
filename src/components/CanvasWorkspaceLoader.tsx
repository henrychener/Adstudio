"use client";

import dynamic from "next/dynamic";

const CanvasWorkspace = dynamic(() => import("./CanvasWorkspace"), {
  ssr: false,
});

export default function CanvasWorkspaceLoader() {
  return <CanvasWorkspace />;
}
