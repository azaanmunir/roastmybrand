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
  const active = WALLPAPERS.find((w) => w.id === activeWallpaper) ?? WALLPAPERS[0];

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
      <div style={{ height: "360px", display: "flex", flexDirection: "column" }}>

        {/* Large preview */}
        <div
          style={{
            height: "160px",
            flexShrink: 0,
            backgroundImage: active.webImage ? `url("${active.webImage}")` : active.gradient,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="h-full flex items-end px-4 pb-3"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 60%)" }}
          >
            <span className="font-sans text-[13px] font-semibold text-white drop-shadow">
              {active.label}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B9B9B] mb-3">
            All Wallpapers
          </p>
          <div className="grid grid-cols-4 gap-3">
            {WALLPAPERS.map((wp: Wallpaper) => {
              const isSelected = wp.id === activeWallpaper;
              return (
                <button
                  key={wp.id}
                  onClick={() => onSelect(wp.id)}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  <div
                    className="w-full rounded-lg relative overflow-hidden transition-transform duration-150 group-hover:scale-[1.04]"
                    style={{
                      height: "60px",
                      backgroundImage: wp.webImage ? `url("${wp.webImage}")` : wp.gradient,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: isSelected ? "2px solid #007AFF" : "2px solid rgba(0,0,0,0.1)",
                      boxShadow: isSelected
                        ? "0 0 0 1px #007AFF, 0 2px 8px rgba(0,122,255,0.25)"
                        : "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,122,255,0.15)" }}>
                        <CheckCircle2 size={16} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                  <span className="font-sans text-[10px] text-[#6B6B6B] text-center leading-tight">
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
