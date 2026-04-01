import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";

export default function Home() {
  return (
    <>
      {/* Canvas background with grid */}
      <div
        className="fixed inset-0 bg-[#f0f0f0]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating panels layered on top of canvas */}
      <Navbar />
      <LeftSidebar />
      <VideoPlayer />
      <ChatPanel />
    </>
  );
}
