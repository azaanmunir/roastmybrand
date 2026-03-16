"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import MenuBar from "@/components/desktop/MenuBar";
import Dock from "@/components/desktop/Dock";
import RoastWindow from "@/components/windows/RoastWindow";
import LiveRoastsWindow from "@/components/windows/LiveRoastsWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import WallpapersWindow from "@/components/windows/WallpapersWindow";
import HistoryWindow from "@/components/windows/HistoryWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import PortfolioWindow from "@/components/windows/PortfolioWindow";
import HallOfShameWindow from "@/components/windows/HallOfShameWindow";
import ChecklistWindow from "@/components/windows/ChecklistWindow";
import DesktopFolder from "@/components/desktop/DesktopFolder";
import { WALLPAPERS, DEFAULT_WALLPAPER_ID } from "@/lib/wallpapers";
import MobileLayout from "@/components/mobile/MobileLayout";

type WindowId = "roast" | "liveroasts" | "terminal" | "wallpapers" | "history" | "contact";

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
  history:     { isOpen: false, isMinimized: false, zIndex: 10 },
  contact:     { isOpen: false, isMinimized: false, zIndex: 10 },
};

/* ── Desktop ── */
export default function Page() {
  const [isMobile, setIsMobile]         = useState(false);
  const [mounted, setMounted]           = useState(false);
  const [windows, setWindows]           = useState<Record<WindowId, WinState>>(DEFAULT_WINDOWS);
  const [topZ, setTopZ]                 = useState(14);
  const [focusedWindow, setFocused]     = useState<WindowId>("roast");
  const [wallpaperId, setWallpaperId]   = useState(DEFAULT_WALLPAPER_ID);
  const [shutDown, setShutDown]         = useState(false);
  const [toast, setToast]               = useState<string | null>(null);
  const [aboutOpen, setAboutOpen]       = useState(false);
  const [resetKey, setResetKey]         = useState(0);
  const toastTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPortfolio, setShowPortfolio]     = useState(false);
  const [showHallOfShame, setShowHallOfShame] = useState(false);
  const [showChecklist, setShowChecklist]     = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
    const maps: Record<string, WindowId> = {
      roast: "roast", terminal: "terminal", wallpapers: "wallpapers",
      history: "history", contact: "contact",
      about: "roast", pricing: "roast",
    };
    const wid = maps[id] as WindowId | undefined;
    if (!wid) return;
    openWindow(wid);
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

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
    if (action === "contact") openWindow("contact");
    if (action === "close-window") closeWindow(focusedWindow);
    if (action === "export-report") showToast("📄 Full PDF reports are coming soon. Stay tuned.");
    if (action === "undo") document.execCommand("undo");
    if (action === "redo") document.execCommand("redo");
    if (action === "clear-form") { openWindow("roast"); setResetKey((k) => k + 1); }
    if (action === "about") setAboutOpen(true);
    if (action === "report-bug") window.open("https://github.com/issues", "_blank");
  };

  const wallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];

  const vw = mounted ? window.innerWidth  : 1440;
  const vh = mounted ? window.innerHeight : 900;

  // RoastWindow: centered, 62vw wide
  const roastW = Math.min(vw * 0.62, 820);
  const positions = {
    roast:      { x: Math.max(20, (vw - roastW) / 2), y: 130 },
    liveroasts: { x: Math.max(20, vw - 380),           y: 310 },
    terminal:   { x: Math.max(20, vw * 0.04),          y: Math.max(150, vh - 540) },
    wallpapers: { x: Math.max(20, (vw - 460) / 2),     y: Math.max(80, (vh - 380) / 2) },
    history:    { x: Math.max(20, (vw - 520) / 2),     y: Math.max(80, vh * 0.15) },
    contact:    { x: Math.max(20, vw * 0.62),           y: Math.max(80, vh * 0.12) },
  };

  const openWinIds = (Object.entries(windows) as [WindowId, WinState][])
    .filter(([, s]) => s.isOpen)
    .map(([id]) => id);

  // Render mobile layout for screens under 768px
  if (isMobile) return <MobileLayout />;

  return (
    <>
      {/* ── Desktop ── */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={
          wallpaper.image
            ? { backgroundImage: `url(${wallpaper.image})`, backgroundSize: "cover", backgroundPosition: "center", transition: "background 0.7s ease" }
            : { background: wallpaper.gradient, transition: "background 0.7s ease" }
        }
      >
        {/* Spotlight — above wallpaper, below all windows */}

        <MenuBar onMenuAction={handleMenuAction} />

        <div className="absolute inset-0 pt-7 pb-24">

          {/* ── Desktop Folders ── */}
          {mounted && (
            <>
              <DesktopFolder
                label="Azaan's Portfolio"
                position={{ x: 40, y: 80 }}
                onClick={() => setShowPortfolio(true)}
              />
              <DesktopFolder
                label="Hall of Shame"
                position={{ x: 40, y: 200 }}
                onClick={() => setShowHallOfShame(true)}
              />
              <DesktopFolder
                label="Free Checklist"
                position={{ x: 40, y: 320 }}
                onClick={() => setShowChecklist(true)}
              />
            </>
          )}

          {mounted && windows.roast.isOpen && !windows.roast.isMinimized && (
            <RoastWindow
              zIndex={windows.roast.zIndex}
              isActive={focusedWindow === "roast"}
              onFocus={() => bringToFront("roast")}
              onClose={() => closeWindow("roast")}
              onMinimize={() => minimizeWindow("roast")}
              initialX={positions.roast.x}
              initialY={positions.roast.y}
              resetKey={resetKey}
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

          {mounted && windows.history.isOpen && !windows.history.isMinimized && (
            <HistoryWindow
              zIndex={windows.history.zIndex}
              isActive={focusedWindow === "history"}
              onFocus={() => bringToFront("history")}
              onClose={() => closeWindow("history")}
              onMinimize={() => minimizeWindow("history")}
              initialX={positions.history.x}
              initialY={positions.history.y}
              onOpenRoast={() => { openWindow("roast"); closeWindow("history"); }}
            />
          )}

          {mounted && windows.contact.isOpen && !windows.contact.isMinimized && (
            <ContactWindow
              zIndex={windows.contact.zIndex}
              isActive={focusedWindow === "contact"}
              onFocus={() => bringToFront("contact")}
              onClose={() => closeWindow("contact")}
              onMinimize={() => minimizeWindow("contact")}
              initialX={positions.contact.x}
              initialY={positions.contact.y}
            />
          )}

          {mounted && showPortfolio && (
            <PortfolioWindow
              zIndex={topZ + 1}
              isActive
              onFocus={() => {}}
              onClose={() => setShowPortfolio(false)}
              onMinimize={() => setShowPortfolio(false)}
              initialX={Math.max(20, (vw - 500) / 2)}
              initialY={100}
              onOpenContact={() => { openWindow("contact"); setShowPortfolio(false); }}
            />
          )}

          {mounted && showHallOfShame && (
            <HallOfShameWindow
              zIndex={topZ + 1}
              isActive
              onFocus={() => {}}
              onClose={() => setShowHallOfShame(false)}
              onMinimize={() => setShowHallOfShame(false)}
              initialX={Math.max(20, (vw - 420) / 2)}
              initialY={100}
              onOpenRoast={() => { openWindow("roast"); setShowHallOfShame(false); }}
            />
          )}

          {mounted && showChecklist && (
            <ChecklistWindow
              zIndex={topZ + 1}
              isActive
              onFocus={() => {}}
              onClose={() => setShowChecklist(false)}
              onMinimize={() => setShowChecklist(false)}
              initialX={Math.max(20, (vw - 420) / 2)}
              initialY={80}
              onOpenContact={() => { openWindow("contact"); setShowChecklist(false); }}
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

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[500] pointer-events-none"
            >
              <div className="glass-window rounded-xl px-4 py-2.5 font-sans text-[13px] text-[#1A1A1A] shadow-lg whitespace-nowrap">
                {toast}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* About modal */}
        <AnimatePresence>
          {aboutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[490] flex items-center justify-center"
              onClick={() => setAboutOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="glass-window rounded-2xl p-8 w-80 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Flame size={32} className="text-white" />
                </div>
                <h2 className="font-display text-xl italic text-[#1A1A1A] mb-1">RoastMyBrand.wtf</h2>
                <p className="font-sans text-[12px] text-[#9B9B9B] mb-4">Version 1.0 — Built to hurt feelings</p>
                <div className="border-t border-black/[0.07] pt-4 space-y-1">
                  <p className="font-sans text-[12px] text-[#6B6B6B]">Made with rage and love by</p>
                  <p className="font-sans text-[13px] font-semibold text-[#1A1A1A]">Azaan Ali</p>
                </div>
                <button
                  onClick={() => setAboutOpen(false)}
                  className="mt-5 w-full py-2 rounded-lg bg-black/[0.05] hover:bg-black/[0.09] font-sans text-[13px] text-[#1A1A1A] transition-colors"
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
