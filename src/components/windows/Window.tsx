"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  initialRotate?: number;
  width?: number | string;
  zIndex?: number;
  isActive?: boolean;
  titleBarStyle?: React.CSSProperties;
  onFocus?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
}

const DOTS = [
  { activeColor: "#FF5F57", inactiveColor: "rgba(0,0,0,0.18)", symbol: "×" },
  { activeColor: "#FEBC2E", inactiveColor: "rgba(0,0,0,0.18)", symbol: "−" },
  { activeColor: "#28C840", inactiveColor: "rgba(0,0,0,0.18)", symbol: "⤢" },
];

const SHADOW_ACTIVE =
  "0 40px 80px rgba(0,0,0,0.28), 0 12px 28px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)";
const SHADOW_INACTIVE =
  "0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)";

/** Parse initial pixel width from prop (handles CSS strings like "min(62vw, 820px)") */
function parseInitialWidth(w: number | string): number {
  if (typeof w === "number") return w;
  const m = w.match(/(\d+)px/);
  return m ? parseInt(m[1]) : 560;
}

const MIN_W = 300;
const MIN_H = 180;

export default function Window({
  title,
  children,
  initialX = 100,
  initialY = 60,
  initialRotate = 0,
  width = 480,
  zIndex = 10,
  isActive = false,
  titleBarStyle,
  onFocus,
  onClose,
  onMinimize,
  className = "",
}: WindowProps) {
  const controls = useDragControls();

  // Traffic light hover state (entire dot group)
  const [dotsHovered, setDotsHovered] = useState(false);

  // Resizable dimensions
  const [winWidth, setWinWidth] = useState(() => parseInitialWidth(width));
  const [winHeight, setWinHeight] = useState<number | null>(null); // null = auto/content height

  // Ref for reading current DOM dimensions on resize start
  const resizeOrigin = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const onResizeDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    const windowEl = handle.parentElement;
    resizeOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      w: windowEl?.offsetWidth ?? winWidth,
      h: windowEl?.offsetHeight ?? 400,
    };
  }, [winWidth]);

  const onResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeOrigin.current) return;
    setWinWidth(Math.max(MIN_W, resizeOrigin.current.w + e.clientX - resizeOrigin.current.x));
    setWinHeight(Math.max(MIN_H, resizeOrigin.current.h + e.clientY - resizeOrigin.current.y));
  }, []);

  const onResizeEnd = useCallback(() => {
    resizeOrigin.current = null;
  }, []);

  const defaultTitleBarBg = isActive
    ? "rgba(255,255,255,0.52)"
    : "rgba(255,255,255,0.32)";

  const bodyMaxHeight = winHeight
    ? `${winHeight - 38}px`
    : "calc(100vh - 160px)";

  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: initialX, y: initialY, rotate: initialRotate, opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: isActive ? SHADOW_ACTIVE : SHADOW_INACTIVE,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], boxShadow: { duration: 0.2 } }}
      onPointerDown={onFocus}
      style={{
        position: "absolute",
        width: winWidth,
        height: winHeight ?? "auto",
        zIndex,
      }}
      className={`glass-window rounded-xl overflow-hidden flex flex-col ${className}`}
    >
      {/* Title bar — drag handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className="flex items-center gap-2 px-4 cursor-grab active:cursor-grabbing select-none shrink-0"
        style={{
          height: "38px",
          borderBottom: isActive ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(0,0,0,0.04)",
          background: titleBarStyle?.background ?? defaultTitleBarBg,
          ...titleBarStyle,
        }}
      >
        {/* Traffic light dots */}
        <div
          className="flex items-center gap-[6px]"
          onMouseEnter={() => setDotsHovered(true)}
          onMouseLeave={() => setDotsHovered(false)}
        >
          {DOTS.map((dot, i) => (
            <button
              key={i}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (i === 0) onClose?.();
                if (i === 1) onMinimize?.();
              }}
              className="w-3 h-3 rounded-full focus:outline-none transition-colors duration-150 flex items-center justify-center"
              style={{ backgroundColor: isActive ? dot.activeColor : dot.inactiveColor }}
            >
              {dotsHovered && isActive && (
                <span
                  style={{
                    fontSize: "7px",
                    lineHeight: 1,
                    color: "rgba(0,0,0,0.5)",
                    fontWeight: 800,
                    fontFamily: "system-ui,-apple-system",
                    userSelect: "none",
                  }}
                >
                  {dot.symbol}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Window title */}
        <span
          className="flex-1 text-center font-sans text-[12px] font-medium truncate pr-14 transition-colors duration-200"
          style={{ color: isActive ? "#6B6B6B" : "#AAAAAA" }}
        >
          {title}
        </span>
      </div>

      {/* Scrollable body */}
      <div
        className="overflow-y-auto flex-1"
        style={{ maxHeight: bodyMaxHeight }}
      >
        {children}
      </div>

      {/* Resize handle — bottom-right corner */}
      <div
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        className="absolute bottom-0 right-0 z-10 cursor-nwse-resize"
        style={{ width: 20, height: 20 }}
      >
        {/* Subtle grip dots */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="absolute bottom-[3px] right-[3px] opacity-30 pointer-events-none"
        >
          <circle cx="8" cy="8" r="1.2" fill="#1A1A1A" />
          <circle cx="5" cy="8" r="1.2" fill="#1A1A1A" />
          <circle cx="8" cy="5" r="1.2" fill="#1A1A1A" />
        </svg>
      </div>
    </motion.div>
  );
}
