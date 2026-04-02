import Navbar from "@/components/Navbar";
import ChatPanel from "@/components/ChatPanel";
import Toolbar from "@/components/Toolbar";
import StudioLayout from "@/components/StudioLayout";

export default function Home() {
  return (
    <>
      {/* CSS dot grid background — zero GPU cost */}
      <div
        className="fixed inset-0 bg-[#f0f0f0]"
        style={{
          backgroundImage: "radial-gradient(circle, #c0c0c0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Navbar />
      <ChatPanel />
      <Toolbar />

      {/* StudioLayout owns LeftSidebar + SequenceTimeline + CanvasWorkspace */}
      <StudioLayout />
    </>
  );
}
