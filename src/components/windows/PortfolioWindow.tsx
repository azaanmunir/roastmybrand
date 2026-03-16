"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Window from "./Window";

const PROJECTS = [
  { title: "Diyar Furniture Brand",   category: "Branding",       gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
  { title: "Solea Tanning UAE",        category: "Packaging",      gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
  { title: "TAKMEEL Real Estate",      category: "Branding",       gradient: "linear-gradient(135deg, #1c1c1c 0%, #2d6a4f 100%)" },
  { title: "Vinteeze Etsy Store",      category: "Social Media",   gradient: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Branding:     { bg: "rgba(0,113,227,0.12)", text: "#0071E3" },
  Packaging:    { bg: "rgba(255,149,0,0.12)", text: "#E08600" },
  "Social Media": { bg: "rgba(52,199,89,0.12)", text: "#1E9944" },
};

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
  onOpenContact: () => void;
}

export default function PortfolioWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, onOpenContact,
}: Props) {
  return (
    <Window
      title="Azaan's Portfolio"
      initialX={initialX}
      initialY={initialY}
      width={500}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="p-5" style={{ maxHeight: 480, overflowY: "auto" }}>

        {/* Header */}
        <div className="mb-5">
          <h2 className="font-display text-[1.4rem] italic text-[#1A1A1A] leading-tight">
            10+ Years. 1,300+ Clients.<br />Zero Generic Brands.
          </h2>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {PROJECTS.map((p) => {
            const cat = CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS["Branding"];
            return (
              <div
                key={p.title}
                className="rounded-xl overflow-hidden border border-black/[0.07]"
                style={{ background: "#FAFAFA" }}
              >
                {/* Image area */}
                <div className="w-full h-28 rounded-t-xl" style={{ background: p.gradient }} />
                {/* Info */}
                <div className="p-3">
                  <p className="font-sans text-[12.5px] font-semibold text-[#1A1A1A] mb-1.5 leading-tight">{p.title}</p>
                  <span
                    className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: cat.bg, color: cat.text }}
                  >
                    {p.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <motion.a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-white font-sans text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <ExternalLink size={13} />
            See Full Portfolio on Behance →
          </motion.a>
          <button
            onClick={onOpenContact}
            className="flex items-center justify-center w-full py-2.5 bg-black/[0.05] hover:bg-black/[0.09] font-sans text-[13px] font-semibold text-[#1A1A1A] rounded-lg transition-colors"
          >
            Work with Azaan →
          </button>
        </div>

      </div>
    </Window>
  );
}
