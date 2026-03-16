"use client";

import { motion } from "framer-motion";
import { Skull } from "lucide-react";
import Window from "./Window";

const ENTRIES = [
  { score: 2, category: "SaaS Startup",    critique: "Logo looks like a stock icon with a gradient slapped on it." },
  { score: 3, category: "Local Restaurant", critique: "Four different fonts. One menu. Zero personality." },
  { score: 1, category: "Fashion Brand",   critique: "Trying to be luxury. Achieving clipart." },
  { score: 4, category: "Fitness App",     critique: "The color palette belongs in a 2009 energy drink ad." },
  { score: 2, category: "Law Firm",        critique: "Comic Sans is illegal. This is close." },
  { score: 3, category: "Tech Agency",     critique: '"Innovative solutions" in the tagline. Innovation: zero.' },
];

const scoreColor = (s: number) => s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";
const scoreBg    = (s: number) => s <= 3 ? "rgba(255,59,48,0.09)" : s <= 6 ? "rgba(255,149,0,0.09)" : "rgba(52,199,89,0.09)";

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
  onOpenRoast: () => void;
}

export default function HallOfShameWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, onOpenRoast,
}: Props) {
  return (
    <Window
      title="Hall of Shame 💀"
      initialX={initialX}
      initialY={initialY}
      width={420}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div style={{ maxHeight: 480, overflowY: "auto" }}>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2 mb-0.5">
            <Skull size={16} className="text-[#FF3B30]" />
            <h2 className="font-sans text-[14px] font-bold text-[#1A1A1A]">Hall of Shame</h2>
          </div>
          <p className="font-sans text-[12px] text-[#9B9B9B]">Real brands. Anonymized. Brutally scored.</p>
        </div>

        {/* Entries */}
        <div>
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              className="flex items-start gap-3 px-5 py-3 border-b border-black/[0.05] last:border-0"
              style={{ background: scoreBg(entry.score) }}
            >
              {/* Score badge */}
              <div
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                style={{ border: `1.5px solid ${scoreColor(entry.score)}30`, background: `${scoreColor(entry.score)}14` }}
              >
                <span
                  className="font-display font-bold leading-none"
                  style={{ fontSize: "1.1rem", color: scoreColor(entry.score) }}
                >
                  {entry.score}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span
                  className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full mb-1.5 inline-block"
                  style={{ background: "rgba(0,0,0,0.05)", color: "#6B6B6B" }}
                >
                  {entry.category}
                </span>
                <p className="font-sans text-[12.5px] text-[#1A1A1A] leading-snug">{entry.critique}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-black/[0.06]">
          <p className="font-sans text-[11.5px] text-[#9B9B9B] mb-3 text-center">
            Submit your brand to see if you make the list →
          </p>
          <button
            onClick={onOpenRoast}
            className="flex items-center justify-center w-full py-2.5 bg-[#FF3B30] text-white font-sans text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Roast My Brand
          </button>
        </div>

      </div>
    </Window>
  );
}
