import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import ChatPanel from "@/components/ChatPanel";
import CanvasWorkspaceLoader from "@/components/CanvasWorkspaceLoader";
import Toolbar from "@/components/Toolbar";
import SequenceTimeline from "@/components/SequenceTimeline";

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
      <Toolbar />
      <SequenceTimeline />

      {/* WebGL canvas workspace with draggable nodes */}
      <CanvasWorkspaceLoader />
    </>
  );
}
