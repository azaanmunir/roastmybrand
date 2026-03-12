"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Link2, Tag, AlertCircle } from "lucide-react";
import MenuBar from "@/components/desktop/MenuBar";
import Dock from "@/components/desktop/Dock";
import RoastWindow from "@/components/windows/RoastWindow";
import LiveRoastsWindow from "@/components/windows/LiveRoastsWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import WallpapersWindow from "@/components/windows/WallpapersWindow";
import { WALLPAPERS, DEFAULT_WALLPAPER_ID } from "@/lib/wallpapers";

type WindowId = "roast" | "liveroasts" | "terminal" | "wallpapers";

interface WinState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

const DEFAULT_WINDOWS: Record<WindowId, WinState> = {
  roast:       { isOpen: true,  isMinimized: false, zIndex: 14 },
  liveroasts:  { isOpen: true,  isMinimized: false, zIndex: 11 },
  terminal:    { isOpen: true,  isMinimized: false, zIndex: 12 },
  wallpapers:  { isOpen: false, isMinimized: false, zIndex: 10 },
};

const CYCLING_WORDS = [
  "wrong", "broken", "embarrassing", "holding you back", "costing you clients",
  "screaming mediocre", "turning people off", "killing your credibility",
  "leaving money on the table", "making you invisible", "scaring away investors",
];

/* ── Mobile fallback form ── */
function MobileRoastForm() {
  const [brandName, setBrandName] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const wordTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      wordTimer.current = setTimeout(() => { setWordIndex((i) => (i + 1) % CYCLING_WORDS.length); setWordVisible(true); }, 300);
    }, 2200);
    return () => { clearInterval(interval); if (wordTimer.current) clearTimeout(wordTimer.current); };
  }, []);
  const [url, setUrl]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [result, setResult]       = useState<Record<string, unknown> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName: brandName.trim(), url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult({ ...data, brandName: brandName.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const sc = result
    ? (result.score as number) <= 3 ? "#FF3B30" : (result.score as number) <= 6 ? "#FF9500" : "#34C759"
    : "#FF3B00";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 50% 30%, #FFF8F4 0%, #FFFFFF 60%, #F8F8F8 100%)" }}>
      <div className="glass-menu flex items-center justify-center px-5 py-3">
        <span className="font-display italic text-lg text-[#1A1A1A]">RoastMyBrand.wtf</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-window rounded-2xl p-7 w-full max-w-sm"
            >
              <h1 className="font-display text-3xl italic text-[#1A1A1A] leading-tight mb-2">
                Submit your brand.<br />
                <span className="text-accent">
                  Find out what&rsquo;s{" "}
                  <span style={{ display: "inline-block", opacity: wordVisible ? 1 : 0, transform: wordVisible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
                    {CYCLING_WORDS[wordIndex]}.
                  </span>
                </span>
              </h1>
              <p className="font-sans text-[#6B6B6B] text-sm leading-relaxed mb-6">
                No agency spin. No fluffy feedback. Just the truth.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                  <input type="text" placeholder="Acme Corp" value={brandName} onChange={(e) => setBrandName(e.target.value)} required className="w-full bg-white/70 border border-black/[0.1] rounded-lg pl-9 pr-4 py-3 font-sans text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all" />
                </div>
                <div className="relative">
                  <Link2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                  <input type="text" placeholder="acme.com or logo URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-white/70 border border-black/[0.1] rounded-lg pl-9 pr-4 py-3 font-sans text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all" />
                </div>
                {error && <div className="flex items-center gap-2 text-[#FF3B30] font-sans text-xs"><AlertCircle size={12} /> {error}</div>}
                <button type="submit" disabled={loading || !brandName.trim()} className="relative overflow-hidden flex items-center justify-center gap-2 bg-accent text-white font-sans font-semibold text-sm py-3.5 rounded-lg disabled:opacity-40 shadow-[0_4px_16px_rgba(0,113,227,0.35)] btn-shimmer">
                  <Flame size={15} />
                  {loading ? "Summoning the judges…" : "Roast My Brand"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-window rounded-2xl p-7 w-full max-w-sm">
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="font-display leading-none" style={{ fontSize: "5rem", color: sc }}>{result.score as number}</span>
                <span className="font-sans text-xl text-black/20 font-semibold">/10</span>
              </div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">Brand Brutality Score™</p>
              <blockquote className="border-l-2 border-accent pl-3 mb-4">
                <p className="font-display italic text-base text-[#1A1A1A] leading-snug">&ldquo;{result.headline as string}&rdquo;</p>
              </blockquote>
              <div className="space-y-2 mb-4">
                {(result.whatsBroken as string[]).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-[#FF3B30] font-bold shrink-0 mt-0.5">✕</span>
                    <span className="font-mono text-[#2A2A2A]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 bg-[#34C759]/10 rounded-lg px-3 py-2.5 mb-5">
                <span className="text-[#34C759] font-bold text-xs shrink-0">✓</span>
                <span className="font-mono text-xs text-[#1A1A1A]">{result.whatsRedeemable as string}</span>
              </div>
              <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed mb-5">{result.verdict as string}</p>
              <button onClick={() => { setResult(null); setBrandName(""); setUrl(""); }} className="font-sans text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition-colors">← Roast another</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Desktop ── */
export default function Page() {
  const [mounted, setMounted]           = useState(false);
  const [windows, setWindows]           = useState<Record<WindowId, WinState>>(DEFAULT_WINDOWS);
  const [topZ, setTopZ]                 = useState(14);
  const [focusedWindow, setFocused]     = useState<WindowId>("roast");
  const [wallpaperId, setWallpaperId]   = useState(DEFAULT_WALLPAPER_ID);
  const [shutDown, setShutDown]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const bringToFront = useCallback((id: WindowId) => {
    const z = topZ + 1;
    setTopZ(z);
    setFocused(id);
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], zIndex: z } }));
  }, [topZ]);

  const openWindow    = (id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: true, isMinimized: false } }));
    bringToFront(id);
  };
  const closeWindow   = (id: WindowId) => setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
  const minimizeWindow= (id: WindowId) => setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));

  const handleIconClick = (id: string) => {
    const validIds: WindowId[] = ["roast", "liveroasts", "terminal", "wallpapers"];
    const maps: Record<string, WindowId> = {
      roast: "roast", terminal: "terminal", wallpapers: "wallpapers",
      about: "roast", pricing: "roast", contact: "roast",
    };
    const wid = maps[id] as WindowId | undefined;
    if (!wid) return;
    openWindow(wid);
  };

  const handleMenuAction = (action: string) => {
    if (action === "wallpapers") openWindow("wallpapers");
    if (action === "toggle-terminal") {
      const s = windows.terminal;
      s.isOpen && !s.isMinimized ? minimizeWindow("terminal") : openWindow("terminal");
    }
    if (action === "toggle-liveroasts") {
      const s = windows.liveroasts;
      s.isOpen && !s.isMinimized ? minimizeWindow("liveroasts") : openWindow("liveroasts");
    }
    if (action === "new-roast") openWindow("roast");
    if (action === "restart") { window.location.reload(); }
    if (action === "shutdown") {
      setShutDown(true);
      setTimeout(() => { setShutDown(false); window.location.reload(); }, 2200);
    }
    if (action === "contact") { window.open("https://calendly.com", "_blank"); }
  };

  const wallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];

  const vw = mounted ? window.innerWidth  : 1440;
  const vh = mounted ? window.innerHeight : 900;

  // RoastWindow: centered, 62vw wide
  const roastW = Math.min(vw * 0.62, 820);
  const positions = {
    roast:      { x: Math.max(20, (vw - roastW) / 2), y: 40 },
    liveroasts: { x: Math.max(20, vw - 300),           y: 80 },
    terminal:   { x: Math.max(20, vw * 0.04),          y: Math.max(150, vh - 420) },
    wallpapers: { x: Math.max(20, (vw - 460) / 2),     y: Math.max(80, (vh - 380) / 2) },
  };

  const openWinIds = (Object.entries(windows) as [WindowId, WinState][])
    .filter(([, s]) => s.isOpen)
    .map(([id]) => id);

  return (
    <>
      {/* ── Mobile ── */}
      <div className="block md:hidden">
        <MobileRoastForm />
      </div>

      {/* ── Desktop ── */}
      <div
        className="hidden md:block fixed inset-0 overflow-hidden"
        style={
          wallpaper.image
            ? { backgroundImage: `url(${wallpaper.image})`, backgroundSize: "cover", backgroundPosition: "center", transition: "background 0.7s ease" }
            : { background: wallpaper.gradient, transition: "background 0.7s ease" }
        }
      >
        {/* Spotlight — above wallpaper, below all windows */}

        <MenuBar onMenuAction={handleMenuAction} />

        <div className="absolute inset-0 pt-7 pb-24">
          {mounted && windows.roast.isOpen && !windows.roast.isMinimized && (
            <RoastWindow
              zIndex={windows.roast.zIndex}
              isActive={focusedWindow === "roast"}
              onFocus={() => bringToFront("roast")}
              onClose={() => closeWindow("roast")}
              onMinimize={() => minimizeWindow("roast")}
              initialX={positions.roast.x}
              initialY={positions.roast.y}
            />
          )}

          {mounted && windows.liveroasts.isOpen && !windows.liveroasts.isMinimized && (
            <LiveRoastsWindow
              zIndex={windows.liveroasts.zIndex}
              isActive={focusedWindow === "liveroasts"}
              onFocus={() => bringToFront("liveroasts")}
              onClose={() => closeWindow("liveroasts")}
              onMinimize={() => minimizeWindow("liveroasts")}
              initialX={positions.liveroasts.x}
              initialY={positions.liveroasts.y}
            />
          )}

          {mounted && windows.terminal.isOpen && !windows.terminal.isMinimized && (
            <TerminalWindow
              zIndex={windows.terminal.zIndex}
              isActive={focusedWindow === "terminal"}
              onFocus={() => bringToFront("terminal")}
              onClose={() => closeWindow("terminal")}
              onMinimize={() => minimizeWindow("terminal")}
              initialX={positions.terminal.x}
              initialY={positions.terminal.y}
            />
          )}

          {mounted && windows.wallpapers.isOpen && !windows.wallpapers.isMinimized && (
            <WallpapersWindow
              zIndex={windows.wallpapers.zIndex}
              isActive={focusedWindow === "wallpapers"}
              activeWallpaper={wallpaperId}
              onSelect={(id) => { setWallpaperId(id); }}
              onFocus={() => bringToFront("wallpapers")}
              onClose={() => closeWindow("wallpapers")}
              onMinimize={() => minimizeWindow("wallpapers")}
              initialX={positions.wallpapers.x}
              initialY={positions.wallpapers.y}
            />
          )}
        </div>

        <Dock
          onIconClick={handleIconClick}
          openWindows={openWinIds as (typeof openWinIds[number] & Parameters<typeof handleIconClick>[0])[]}
        />

        {/* Shutdown effect */}
        <AnimatePresence>
          {shutDown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-black z-[999] flex items-center justify-center"
            >
              <p className="font-sans text-white/30 text-sm">🔊 Shutting down…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
