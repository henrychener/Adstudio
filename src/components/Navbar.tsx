"use client";

import { Search, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-white border-b border-[#e5e7eb]">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        <h1 className="text-[15px] font-bold tracking-tight text-[#1a1a1a]">
          The Kinetic Editor
        </h1>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-semibold text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-0.5"
          >
            Studio
          </a>
          <a href="#" className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
            Inspiration
          </a>
          <a href="#" className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
            Drafts
          </a>
        </nav>
      </div>

      {/* Right: Search + Export + Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 focus:border-[#e11d48]"
          />
        </div>
        <button className="px-5 py-1.5 bg-[#e11d48] text-white text-sm font-medium rounded-full hover:bg-[#be123c] transition-colors">
          Export
        </button>
        <button className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
          <UserCircle className="w-7 h-7" />
        </button>
      </div>
    </header>
  );
}
