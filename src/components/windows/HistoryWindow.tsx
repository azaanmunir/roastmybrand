"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import Window from "./Window";

interface HistoryEntry {
  id: number;
  brandName: string;
  score: number;
  headline: string;
  whatsBroken: string[];
  whatsRedeemable: string;
  verdict: string;
  date: string;
}

const scoreColor = (s: number) => s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";
const scoreBg    = (s: number) => s <= 3 ? "rgba(255,59,48,0.10)" : s <= 6 ? "rgba(255,149,0,0.10)" : "rgba(52,199,89,0.10)";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

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

export default function HistoryWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, onOpenRoast,
}: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("roastHistory");
      setEntries(raw ? JSON.parse(raw) : []);
    } catch { setEntries([]); }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("roastHistory");
    setEntries([]);
    setExpanded(null);
  };

  const toggle = (id: number) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <Window
      title="Roast History"
      initialX={initialX}
      initialY={initialY}
      width={520}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="flex" style={{ minHeight: 360, maxHeight: 480 }}>

        {/* Sidebar */}
        <div className="w-36 shrink-0 border-r border-black/[0.07] pt-2 pb-3 px-2" style={{ background: "rgba(0,0,0,0.02)" }}>
          <p className="font-sans text-[10px] font-semibold text-[#9B9B9B] uppercase tracking-[0.12em] px-2 mb-1.5">Library</p>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-accent/10">
            <Clock size={12} className="text-accent shrink-0" />
            <span className="font-sans text-[12px] font-medium text-accent truncate">All Roasts</span>
          </div>
          {entries.length > 0 && (
            <p className="font-sans text-[10px] text-[#C0C0C0] px-2 mt-2">{entries.length} roast{entries.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        {/* Main panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-black/[0.06]">
            <span className="font-sans text-[12px] font-semibold text-[#1A1A1A]">All Roasts</span>
            {entries.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 font-sans text-[11px] text-[#FF3B30] hover:opacity-70 transition-opacity"
              >
                <Trash2 size={10} />
                Clear History
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
                <Clock size={28} className="text-[#D0D0D0] mb-3" />
                <p className="font-sans text-[13px] font-semibold text-[#6B6B6B] mb-1">No roasts yet</p>
                <p className="font-sans text-[12px] text-[#AAAAAA] mb-4">Submit your first brand to get started</p>
                <button
                  onClick={onOpenRoast}
                  className="px-4 py-2 bg-accent text-white font-sans text-[12px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit your first brand →
                </button>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {entries.map((entry) => (
                  <motion.div key={entry.id} layout transition={{ duration: 0.2 }}>
                    {/* Row */}
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.05] cursor-pointer hover:bg-black/[0.02] transition-colors"
                      onClick={() => toggle(entry.id)}
                    >
                      {/* Chevron */}
                      <span className="shrink-0 text-[#C0C0C0]">
                        {expanded === entry.id
                          ? <ChevronDown size={12} />
                          : <ChevronRight size={12} />}
                      </span>

                      {/* Score badge */}
                      <div
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: scoreBg(entry.score), border: `1.5px solid ${scoreColor(entry.score)}30` }}
                      >
                        <span className="font-display font-bold leading-none" style={{ fontSize: "0.9rem", color: scoreColor(entry.score) }}>
                          {entry.score}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sans text-[12.5px] font-semibold text-[#1A1A1A] truncate">{entry.brandName}</span>
                          <span className="font-sans text-[10px] text-[#C0C0C0] shrink-0">{relativeTime(entry.date)}</span>
                        </div>
                        <p className="font-sans text-[11px] text-[#9B9B9B] truncate mt-0.5">{entry.headline}</p>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {expanded === entry.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 py-3 space-y-3 border-b border-black/[0.05]" style={{ background: "rgba(0,0,0,0.015)" }}>
                            <div>
                              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9B9B9B] mb-1.5">What&apos;s Broken</p>
                              <ul className="space-y-1">
                                {entry.whatsBroken.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 font-sans text-[12px] text-[#3A3A3A]">
                                    <span className="text-[#FF3B30] shrink-0 mt-0.5">✗</span> {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9B9B9B] mb-1">What Works</p>
                              <p className="font-sans text-[12px] text-[#3A3A3A]">
                                <span className="text-[#34C759] mr-1">✓</span>{entry.whatsRedeemable}
                              </p>
                            </div>
                            <div>
                              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9B9B9B] mb-1">Verdict</p>
                              <p className="font-sans text-[12px] text-[#3A3A3A] leading-relaxed">{entry.verdict}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </Window>
  );
}
