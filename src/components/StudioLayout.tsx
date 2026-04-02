"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import LeftSidebar from "./LeftSidebar";
import { VideoAsset } from "@/lib/videoStorage";

const CanvasWorkspace = dynamic(() => import("./CanvasWorkspace"), {
  ssr: false,
});

export interface CanvasVideoNode {
  id: string;       // unique instance id (multiple copies of same asset allowed)
  assetId: string;
  name: string;
  src: string;
}

export default function StudioLayout() {
  const [nodes, setNodes] = useState<CanvasVideoNode[]>([]);

  const addToCanvas = useCallback((asset: VideoAsset) => {
    setNodes((prev) => [
      ...prev,
      {
        id: `node_${Date.now()}`,
        assetId: asset.id,
        name: asset.name,
        src: asset.url,
      },
    ]);
  }, []);

  return (
    <>
      <LeftSidebar onAddToCanvas={addToCanvas} />
      <CanvasWorkspace nodes={nodes} />
    </>
  );
}
