"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Window from "./Window";

interface RoastEntry {
  id: number;
  brand: string;
  score: number;
  emoji: string;
  age: string;
}

const MOCK_ROASTS: Omit<RoastEntry, "id">[] = [
  { brand: "A***e C**p",        score: 3,  emoji: "💀", age: "2m ago" },
  { brand: "B****r F****s",     score: 6,  emoji: "🔥", age: "5m ago" },
  { brand: "S***p St***o",      score: 2,  emoji: "☠️", age: "8m ago" },
  { brand: "T***h S*****t",     score: 7,  emoji: "✅", age: "11m ago" },
  { brand: "C***c T**e",        score: 4,  emoji: "🥴", age: "14m ago" },
  { brand: "N***t V****n",      score: 1,  emoji: "💀", age: "17m ago" },
  { brand: "F***d A***a",       score: 5,  emoji: "🔥", age: "22m ago" },
  { brand: "B***d S***o",       score: 8,  emoji: "✅", age: "26m ago" },
  { brand: "P***e L***s",       score: 3,  emoji: "☠️", age: "30m ago" },
  { brand: "G***w F***t",       score: 6,  emoji: "🔥", age: "35m ago" },
  { brand: "Z***h M***a",       score: 2,  emoji: "💀", age: "41m ago" },
  { brand: "C***o B***d",       score: 9,  emoji: "🏆", age: "48m ago" },
];

const scoreColor = (s: number) =>
  s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";

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

  /* Add a new entry every 4s */
  useEffect(() => {
    const id = setInterval(() => {
      const next = MOCK_ROASTS[cursor % MOCK_ROASTS.length];
      setFeed((prev) => [{ ...next, id: nextId++, age: "just now" }, ...prev].slice(0, 8));
      setCursor((c) => c + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [cursor]);

  return (
    <Window
      title="Live Roasts — 847 brands roasted"
      initialX={initialX}
      initialY={initialY}
      width={300}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="p-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-[#FF3B30]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="font-sans text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-[0.14em]">
            Live
          </span>
        </div>

        {/* Feed */}
        <div className="space-y-1.5 overflow-hidden" style={{ maxHeight: "280px" }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {feed.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-2.5 glass rounded-lg px-3 py-2"
              >
                {/* Score */}
                <span
                  className="font-display leading-none shrink-0"
                  style={{ fontSize: "1.6rem", color: scoreColor(entry.score) }}
                >
                  {entry.score}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[12px] font-semibold text-[#1A1A1A] truncate">
                    {entry.brand}
                  </p>
                  <p className="font-sans text-[10px] text-[#9B9B9B]">
                    {entry.score}/10 {entry.emoji} · {entry.age}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <p className="font-sans text-[10px] text-[#C0C0C0] text-center mt-3">
          Updated in real time · Names anonymized
        </p>
      </div>
    </Window>
  );
}
