"use client";

import { CheckCircle2 } from "lucide-react";
import Window from "./Window";
import { WALLPAPERS, type Wallpaper } from "@/lib/wallpapers";

interface Props {
  zIndex: number;
  isActive?: boolean;
  activeWallpaper: string;
  onSelect: (id: string) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
}

export default function WallpapersWindow({
  zIndex, isActive, activeWallpaper, onSelect, onFocus, onClose, onMinimize, initialX, initialY,
}: Props) {
  return (
    <Window
      title="Wallpapers"
      initialX={initialX}
      initialY={initialY}
      width={460}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="flex" style={{ height: "340px" }}>
        {/* Sidebar */}
        <div
          className="flex flex-col gap-0.5 py-2 border-r border-black/[0.07]"
          style={{ width: "140px", background: "rgba(0,0,0,0.03)" }}
        >
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B9B9B] px-4 pt-1 pb-2">
            Library
          </p>
          {["All Wallpapers", "Gradients", "Minimal"].map((item) => (
            <button
              key={item}
              className={`w-full text-left px-4 py-1.5 font-sans text-[12px] rounded mx-1 ${
                item === "All Wallpapers"
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-[#1A1A1A] hover:bg-black/[0.05]"
              }`}
              style={{ width: "calc(100% - 8px)" }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3">
            {WALLPAPERS.map((wp: Wallpaper) => {
              const isSelected = wp.id === activeWallpaper;
              return (
                <button
                  key={wp.id}
                  onClick={() => onSelect(wp.id)}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  {/* Swatch */}
                  <div
                    className="w-full rounded-lg relative overflow-hidden transition-transform duration-150 group-hover:scale-[1.03]"
                    style={{
                      height: "64px",
                      background: wp.gradient,
                      border: isSelected
                        ? "2px solid #007AFF"
                        : "2px solid transparent",
                      boxShadow: isSelected
                        ? "0 0 0 1px #007AFF, 0 2px 8px rgba(0,122,255,0.25)"
                        : "0 2px 6px rgba(0,0,0,0.12)",
                    }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                  <span className="font-sans text-[11px] text-[#6B6B6B] text-center leading-tight">
                    {wp.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Window>
  );
}
