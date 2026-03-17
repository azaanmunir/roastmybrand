"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import Window from "./Window";

interface RoastEntry {
  id: number;
  brand: string;
  score: number;
  emoji: string;
  age: string;
}

const MOCK_ROASTS: Omit<RoastEntry, "id">[] = [
  { brand: "K***a",                    score: 3,  emoji: "💀", age: "2m ago" },
  { brand: "B****r F****s",            score: 6,  emoji: "🔥", age: "5m ago" },
  { brand: "N**h S**r D**n",           score: 2,  emoji: "☠️", age: "8m ago" },
  { brand: "T***h",                    score: 7,  emoji: "✅", age: "11m ago" },
  { brand: "C***c T**e",              score: 4,  emoji: "🥴", age: "14m ago" },
  { brand: "F***x",                    score: 1,  emoji: "💀", age: "17m ago" },
  { brand: "B**g B***d C**p",          score: 5,  emoji: "🔥", age: "22m ago" },
  { brand: "V***o",                    score: 8,  emoji: "✅", age: "26m ago" },
  { brand: "P***e L***s",              score: 3,  emoji: "☠️", age: "30m ago" },
  { brand: "S***p St***o",             score: 6,  emoji: "🔥", age: "35m ago" },
  { brand: "Z***h",                    score: 2,  emoji: "💀", age: "41m ago" },
  { brand: "C***o B***d & Co",         score: 9,  emoji: "🏆", age: "48m ago" },
  { brand: "A***e C**p",               score: 3,  emoji: "💀", age: "52m ago" },
  { brand: "O***x",                    score: 5,  emoji: "🔥", age: "57m ago" },
  { brand: "R**d L***f D**n",          score: 4,  emoji: "🥴", age: "1h ago" },
];

const scoreColor  = (s: number) => s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";
const scoreBg     = (s: number) => s <= 3 ? "rgba(255,59,48,0.10)" : s <= 6 ? "rgba(255,149,0,0.10)" : "rgba(52,199,89,0.10)";
const scoreLabel  = (s: number) => s <= 3 ? "Destroyed" : s <= 5 ? "Rough" : s <= 7 ? "Decent" : "Strong";

let nextId = 1;

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
}

export default function LiveRoastsWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY,
}: Props) {
  const [feed, setFeed] = useState<RoastEntry[]>(() =>
    MOCK_ROASTS.slice(0, 5).map((r) => ({ ...r, id: nextId++ }))
  );
  const [cursor, setCursor] = useState(5);
  const [totalCount] = useState(1247);

  useEffect(() => {
    const id = setInterval(() => {
      const next = MOCK_ROASTS[cursor % MOCK_ROASTS.length];
      setFeed((prev) => [{ ...next, id: nextId++, age: "just now" }, ...prev].slice(0, 7));
      setCursor((c) => c + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [cursor]);

  return (
    <Window
      title="Live Roasts"
      initialX={initialX}
      initialY={initialY}
      width={320}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="flex flex-col" style={{ minHeight: 0 }}>

        {/* Header */}
        <div className="px-4 pt-3 pb-3 border-b border-black/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#FF3B30]"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.13em] text-[#6B6B6B]">
                Live
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/[0.04] rounded-full px-2.5 py-1">
              <Flame size={10} className="text-[#FF9500]" />
              <span className="font-sans text-[11px] font-semibold text-[#1A1A1A]">
                {totalCount.toLocaleString()} roasted
              </span>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="overflow-hidden flex-1" style={{ maxHeight: 340 }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {feed.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                className="px-4 py-3 border-b border-black/[0.05] last:border-0"
                style={{ backgroundColor: scoreBg(entry.score) }}
              >
                <div className="flex items-center gap-3">
                  {/* Score badge */}
                  <div
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${scoreColor(entry.score)}18`, border: `1.5px solid ${scoreColor(entry.score)}30` }}
                  >
                    <span
                      className="font-display leading-none font-bold"
                      style={{ fontSize: "1.15rem", color: scoreColor(entry.score) }}
                    >
                      {entry.score}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="font-sans text-[12.5px] font-semibold text-[#1A1A1A] truncate">
                        {entry.brand}
                      </p>
                      <span className="font-sans text-[10px] text-[#AAAAAA] shrink-0">{entry.age}</span>
                    </div>

                    {/* Score bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[3px] rounded-full bg-black/[0.07] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: scoreColor(entry.score) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${entry.score * 10}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        />
                      </div>
                      <span
                        className="font-sans text-[10px] font-medium shrink-0"
                        style={{ color: scoreColor(entry.score) }}
                      >
                        {scoreLabel(entry.score)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-black/[0.06] flex items-center justify-between">
          <span className="font-sans text-[10px] text-[#C0C0C0]">Names anonymized</span>
          <span className="font-sans text-[10px] text-[#AAAAAA] font-medium cursor-pointer hover:text-[#1A1A1A] transition-colors">
            Roast yours →
          </span>
        </div>

      </div>
    </Window>
  );
}
