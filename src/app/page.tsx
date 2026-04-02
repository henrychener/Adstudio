import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import ChatPanel from "@/components/ChatPanel";
import CanvasWorkspaceLoader from "@/components/CanvasWorkspaceLoader";

export default function Home() {
  return (
    <>
      {/* CSS dot grid background — zero GPU cost */}
      <div
        className="fixed inset-0 bg-[#f0f0f0]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #c0c0c0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Navbar />
      <LeftSidebar />
      <ChatPanel />

      {/* WebGL canvas workspace with draggable nodes */}
      <CanvasWorkspaceLoader />
    </>
  );
}
