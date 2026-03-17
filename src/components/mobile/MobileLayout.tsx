"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Printer, Flame, Share2, CheckCircle2 } from "lucide-react";
import ReceiptCard from "@/components/windows/ReceiptCard";
import { WALLPAPERS, DEFAULT_WALLPAPER_ID } from "@/lib/wallpapers";
import type { RoastData } from "@/lib/types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONSTANTS & HELPERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CYCLING_WORDS = [
  "wrong", "broken", "embarrassing", "holding you back", "costing you clients",
  "screaming mediocre", "turning people off", "killing your credibility",
  "making you invisible", "scaring away investors",
];

const MOCK_ROASTS = [
  { brand: "A***e C**p",    score: 3, emoji: "💀", age: "2m ago" },
  { brand: "B****r F****s", score: 6, emoji: "🔥", age: "5m ago" },
  { brand: "S***p St***o",  score: 2, emoji: "☠️", age: "8m ago" },
  { brand: "T***h S*****t", score: 7, emoji: "✅", age: "11m ago" },
  { brand: "C***c T**e",    score: 4, emoji: "🥴", age: "14m ago" },
  { brand: "N***t V****n",  score: 1, emoji: "💀", age: "17m ago" },
];

const scoreColor = (s: number) =>
  s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";
const scoreLabel = (s: number) =>
  ["", "Brand Disaster", "Brand Disaster", "Brand Disaster", "Needs Work", "Needs Work",
   "Getting There", "Pretty Solid", "Strong Brand", "Exceptional", "World Class"][s] ?? "";
const scoreBgMuted = (s: number) =>
  s <= 3 ? "rgba(255,59,48,0.08)" : s <= 6 ? "rgba(255,149,0,0.08)" : "rgba(52,199,89,0.08)";

const GLASS_WINDOW = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(32px) saturate(200%)",
  WebkitBackdropFilter: "blur(32px) saturate(200%)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
} as React.CSSProperties;

const GLASS_PANEL = {
  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.8)",
} as React.CSSProperties;

const DOCK_APPS = [
  { id: "roast",      name: "Roast",     icon: "https://cdn.jim-nielsen.com/macos/1024/music-2021-05-25.png?rf=1024" },
  { id: "terminal",   name: "Terminal",  icon: "https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024" },
  { id: "history",    name: "History",   icon: "https://cdn.jim-nielsen.com/macos/1024/messages-2021-05-25.png?rf=1024" },
  { id: "wallpapers", name: "Wallpapers",icon: "https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024" },
  { id: "contact",    name: "Contact",   icon: "https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024" },
];

const FOLDER_SVG_NORMAL = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 564.77 442.19" width="44" height="44">
    <path fill="#19c0fc" d="M535.64,95.99h-216.7c-10.16,0-19.95-3.79-27.45-10.63L209.43,10.63c-7.51-6.84-17.3-10.63-27.45-10.63H29.13C13.04,0,0,13.04,0,29.13v383.94c0,16.09,13.04,29.13,29.13,29.13h506.51c16.09,0,29.13-13.04,29.13-29.13V125.12c0-16.09-13.04-29.13-29.13-29.13Z"/>
  </svg>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MENU BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MobileMenuBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit", hour12: true,
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-4"
      style={{ ...GLASS_PANEL, height: "44px" }}
    >
      {/* Apple logo */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#1A1A1A]">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
      </svg>
      {/* Title */}
      <span className="font-display italic text-[15px] text-[#1A1A1A]">RoastMyBrand.wtf</span>
      {/* Clock */}
      <span className="font-sans text-[12px] font-medium text-[#1A1A1A]">{time}</span>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MACOS WINDOW CARD SHELL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MobileWindowCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...GLASS_WINDOW, borderRadius: "16px", overflow: "hidden" }}>
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4"
        style={{ height: "36px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-[6px]">
          <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span className="flex-1 text-center font-sans text-[11px] text-[#6B6B6B] truncate pr-12">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BOTTOM SHEET WRAPPER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MobileBottomSheet({
  open, onClose, title, children,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[210]"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            className="fixed bottom-0 left-0 right-0 z-[211] bg-white overflow-hidden"
            style={{ height: "85vh", borderRadius: "20px 20px 0 0" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-[4px] rounded-full bg-black/20" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 border-b border-black/[0.06]">
              <h2 className="font-sans text-[15px] font-semibold text-[#1A1A1A]">{title}</h2>
              <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.06]">
                <X size={13} className="text-[#6B6B6B]" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(85vh - 88px)", paddingBottom: "env(safe-area-inset-bottom)" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TERMINAL SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
type TerminalMsg = { role: "user" | "assistant"; content: string };

function TerminalSheetContent() {
  const [messages, setMessages] = useState<TerminalMsg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [introText, setIntroText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const INTRO = "roastmybrand % ready to destroy your brand identity_";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setIntroText(INTRO.slice(0, ++i));
      if (i >= INTRO.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: TerminalMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res  = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.response }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "roastmybrand % [signal lost — engine offline]" }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0D0D0D" }}>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="font-mono text-[13px] mb-4" style={{ color: "#39FF14", lineHeight: 1.6 }}>
          {introText}
          {introText.length < INTRO.length && <span className="animate-pulse">█</span>}
        </p>
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            {m.role === "user" ? (
              <p className="font-mono text-[12px]" style={{ color: "#AAAAAA" }}>
                <span style={{ color: "#39FF14" }}>$</span> {m.content}
              </p>
            ) : (
              <p className="font-mono text-[12px] whitespace-pre-wrap" style={{ color: "#39FF14", lineHeight: 1.6 }}>
                {m.content}
              </p>
            )}
          </div>
        ))}
        {loading && (
          <p className="font-mono text-[12px] animate-pulse" style={{ color: "#39FF14" }}>
            roastmybrand % <span className="animate-pulse">█</span>
          </p>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 px-4 py-3 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a command..."
          style={{ fontSize: "16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFFFFF", caretColor: "#39FF14" }}
          className="flex-1 rounded-lg px-3 py-2 font-mono text-[13px] placeholder-white/20 focus:outline-none"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="px-3 py-2 rounded-lg font-mono text-[12px] font-semibold disabled:opacity-30"
          style={{ background: "#39FF14", color: "#0D0D0D" }}
        >
          ↵
        </button>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HISTORY SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HistorySheetContent({ onStartRoast }: { onStartRoast: () => void }) {
  const [entries, setEntries] = useState<Array<{
    id: number; brandName: string; score: number; headline: string; date: string;
  }>>([]);

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem("roastHistory") || "[]")); } catch {}
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="text-[48px] mb-4">🔥</div>
        <p className="font-sans text-[15px] font-semibold text-[#1A1A1A] mb-2">No roasts yet</p>
        <p className="font-sans text-[13px] text-[#9B9B9B] mb-6 leading-relaxed">
          Submit your first brand to start the hall of pain.
        </p>
        <button onClick={onStartRoast} className="font-sans text-[14px] font-semibold text-white bg-[#1A1A1A] px-6 py-3 rounded-xl">
          Roast My Brand
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      {entries.map((e) => (
        <div key={e.id} className="rounded-xl p-4" style={{ background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[14px] font-semibold text-[#1A1A1A]">{e.brandName}</span>
            <span className="font-sans text-[20px] font-bold" style={{ color: scoreColor(e.score) }}>{e.score}/10</span>
          </div>
          <p className="font-sans text-[12px] text-[#6B6B6B] italic leading-snug mb-2">&ldquo;{e.headline}&rdquo;</p>
          <p className="font-sans text-[11px] text-[#AAAAAA]">
            {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   WALLPAPERS SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function WallpapersSheetContent({
  activeId, onSelect,
}: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-2 gap-3">
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className="relative rounded-xl overflow-hidden h-28 flex items-end p-2.5"
            style={w.mobileImage ? { backgroundImage: `url("${w.mobileImage}")`, backgroundSize: "cover", backgroundPosition: "center" } : { background: w.gradient }}
          >
            {activeId === w.id && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,113,227,0.25)" }}>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 rounded-full bg-[#0071E3]" />
                </div>
              </div>
            )}
            <span className="relative font-sans text-[11px] font-semibold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              {w.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ContactSheetContent() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const subject = encodeURIComponent(
      `Brand Inquiry from RoastMyBrand.wtf — ${name}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from roastmybrand.wtf`
    );
    window.open(
      `mailto:azaanmunirpk@gmail.com?subject=${subject}&body=${body}`,
      '_blank'
    );
  };

  return (
    <div className="px-5 py-4">
      <div className="rounded-2xl p-5 mb-5" style={{ background: "linear-gradient(135deg, #0071E3 0%, #0051A8 100%)" }}>
        <p className="font-sans text-[12px] text-white/70 mb-1 uppercase tracking-widest">Free 30-min call</p>
        <p className="font-sans text-[17px] font-semibold text-white mb-3">Book a brand audit session</p>
        <a href="https://calendly.com/azaanmunirpk" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 bg-white text-[#0071E3] font-sans text-[14px] font-semibold rounded-xl">
          Book on Calendly →
        </a>
      </div>
      <div className="space-y-3">
        {[
          { value: name, setter: setName, placeholder: "Your name", type: "text" },
          { value: email, setter: setEmail, placeholder: "Your email", type: "email" },
        ].map(({ value, setter, placeholder, type }) => (
          <input key={placeholder} type={type} value={value} onChange={(e) => setter(e.target.value)}
            placeholder={placeholder} style={{ fontSize: "16px" }}
            className="w-full h-12 px-4 rounded-xl border border-black/[0.1] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none"
          />
        ))}
        <textarea value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your brand..." rows={4} style={{ fontSize: "16px" }}
          className="w-full px-4 py-3 rounded-xl border border-black/[0.1] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none resize-none"
        />
        <button onClick={handleSend} disabled={!name || !email || !message}
          className="w-full h-12 bg-[#1A1A1A] text-white font-sans text-[15px] font-semibold rounded-xl disabled:opacity-40">
          Send Message →
        </button>
      </div>
      <p className="font-sans text-[11px] text-[#AAAAAA] text-center mt-4">
        Based in Pakistan · Works globally · Fiverr Top Rated · 1,300+ clients
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PORTFOLIO SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const KOFEE_IMAGES = Array.from({ length: 22 }, (_, i) => `/portfolio/Kofee/Kofee-${String(i + 1).padStart(2, "0")}.jpg`);

const PORTFOLIO_PROJECTS = [
  { title: "Kofee", category: "Branding", thumbnail: KOFEE_IMAGES[0], images: KOFEE_IMAGES },
  { title: "Solea Tanning UAE",   category: "Packaging",    thumbnail: null, images: [], gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
  { title: "TAKMEEL Real Estate", category: "Branding",     thumbnail: null, images: [], gradient: "linear-gradient(135deg, #1c1c1c 0%, #2d6a4f 100%)" },
  { title: "Vinteeze Etsy Store", category: "Social Media", thumbnail: null, images: [], gradient: "linear-gradient(135deg, #833ab4 0%, #fcb045 100%)" },
];

function PortfolioSheetContent() {
  const [gallery, setGallery] = useState<{ images: string[]; index: number; title: string } | null>(null);

  if (gallery) {
    return (
      <div className="flex flex-col h-full" style={{ background: "#000", minHeight: "calc(85vh - 88px)" }}>
        {/* Gallery header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <span className="font-sans text-[14px] font-semibold text-white">{gallery.title}</span>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[12px] text-white/50">{gallery.index + 1} / {gallery.images.length}</span>
            <button onClick={() => setGallery(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Main image */}
        <div className="relative flex-1 mx-4 rounded-xl overflow-hidden" style={{ minHeight: 280 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery.images[gallery.index]}
            alt={`${gallery.title} ${gallery.index + 1}`}
            className="w-full h-full object-contain"
          />
          {/* Prev / Next tap zones */}
          <button
            className="absolute left-0 top-0 bottom-0 w-1/3"
            onClick={() => setGallery((g) => g ? { ...g, index: (g.index - 1 + g.images.length) % g.images.length } : g)}
          />
          <button
            className="absolute right-0 top-0 bottom-0 w-1/3"
            onClick={() => setGallery((g) => g ? { ...g, index: (g.index + 1) % g.images.length } : g)}
          />
          {/* Arrow hints */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center pointer-events-none">
            <span className="text-white text-[12px]">‹</span>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center pointer-events-none">
            <span className="text-white text-[12px]">›</span>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0">
          {gallery.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setGallery((g) => g ? { ...g, index: i } : g)}
              className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === gallery.index ? "border-white" : "border-transparent opacity-40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <h3 className="font-display text-[1.3rem] italic text-[#1A1A1A] leading-tight mb-5">
        10+ Years. 1,300+ Clients.<br />Zero Generic Brands.
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {PORTFOLIO_PROJECTS.map((p) => (
          <div
            key={p.title}
            className={`rounded-xl overflow-hidden border border-black/[0.07] ${p.images.length > 0 ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
            style={{ background: "#FAFAFA" }}
            onClick={() => p.images.length > 0 && setGallery({ images: p.images, index: 0, title: p.title })}
          >
            <div className="w-full h-24 relative overflow-hidden">
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: (p as { gradient?: string }).gradient }} />
              )}
            </div>
            <div className="p-3">
              <p className="font-sans text-[12px] font-semibold text-[#1A1A1A] leading-tight mb-1">{p.title}</p>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] text-[#0071E3] font-semibold">{p.category}</span>
                {p.images.length > 0 && <span className="font-sans text-[10px] text-[#AAAAAA]">{p.images.length} slides</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <a href="https://behance.net/azaanali" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center w-full py-3 bg-[#0071E3] text-white font-sans text-[14px] font-semibold rounded-xl">
        See Full Portfolio on Behance →
      </a>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HALL OF SHAME SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SHAME_ENTRIES = [
  { score: 2, category: "SaaS Startup",    critique: "Logo looks like a stock icon with a gradient slapped on it." },
  { score: 3, category: "Local Restaurant",critique: "Four different fonts. One menu. Zero personality." },
  { score: 1, category: "Fashion Brand",   critique: "Trying to be luxury. Achieving clipart." },
  { score: 4, category: "Fitness App",     critique: "The color palette belongs in a 2009 energy drink ad." },
  { score: 2, category: "Law Firm",        critique: "Comic Sans is illegal. This is close." },
];
function HallOfShameSheetContent({ onRoast }: { onRoast: () => void }) {
  return (
    <div className="px-5 py-4">
      <p className="font-sans text-[13px] text-[#9B9B9B] mb-4">Real brands. Anonymized. Brutally scored.</p>
      <div className="space-y-3 mb-5">
        {SHAME_ENTRIES.map((e, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: scoreBgMuted(e.score), border: `1px solid ${scoreColor(e.score)}20` }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${scoreColor(e.score)}20`, border: `1.5px solid ${scoreColor(e.score)}40` }}>
                <span className="font-sans font-bold text-[16px]" style={{ color: scoreColor(e.score) }}>{e.score}</span>
              </div>
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B6B6B]">{e.category}</span>
                <p className="font-sans text-[13px] text-[#1A1A1A] leading-snug mt-0.5">{e.critique}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onRoast}
        className="w-full h-12 bg-[#FF3B30] text-white font-sans text-[14px] font-semibold rounded-xl">
        Submit Your Brand
      </button>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CHECKLIST SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CHECKLIST_SECTIONS = [
  { title: "LOGO",        color: "#0071E3", items: ["Works in black and white","Readable at 16px favicon","No gradients that break on print","Doesn't resemble a competitor","Has horizontal and stacked versions"] },
  { title: "TYPOGRAPHY",  color: "#9B59B6", items: ["Maximum 2 typefaces","Clear heading/body hierarchy","Fonts licensed for commercial use","Readable at small sizes on mobile","Font matches brand personality"] },
  { title: "COLOR",       color: "#FF9500", items: ["Primary, secondary, neutral defined","All combos pass WCAG AA","Works on light and dark backgrounds","No more than 4 core colors","Emotional reasoning documented"] },
  { title: "VOICE",       color: "#FF3B30", items: ["One-sentence positioning exists","Tagline is specific, not generic","Tone of voice guide written down","No 'innovative' or 'solutions' in copy","A stranger can describe it in 5 sec"] },
  { title: "CONSISTENCY", color: "#34C759", items: ["Brand guidelines document exists","All socials use same logo/colors","Email signature matches brand","Business cards are on-brand","Someone else can apply the brand"] },
];
function ChecklistSheetContent() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (key: string) => setChecked((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
  const total = CHECKLIST_SECTIONS.reduce((a, s) => a + s.items.length, 0);
  const done  = checked.size;
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-sans text-[13px] text-[#9B9B9B]">25 things your brand needs</p>
        <span className="font-sans text-[12px] font-semibold text-[#1A1A1A]">{done}/{total}</span>
      </div>
      <div className="space-y-5 pb-4">
        {CHECKLIST_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: section.color }} />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: section.color }}>
                {section.title}
              </span>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => {
                const key = `${section.title}-${item}`;
                return (
                  <button key={key} onClick={() => toggle(key)}
                    className="w-full flex items-start gap-3 text-left py-1">
                    <div className="shrink-0 w-4 h-4 rounded mt-0.5 border flex items-center justify-center"
                      style={{ borderColor: checked.has(key) ? section.color : "rgba(0,0,0,0.2)", background: checked.has(key) ? section.color : "white" }}>
                      {checked.has(key) && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="font-sans text-[13px] text-[#3A3A3A] leading-snug"
                      style={{ textDecoration: checked.has(key) ? "line-through" : "none", opacity: checked.has(key) ? 0.5 : 1 }}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LIVE ROASTS WIDGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let nextId = 1;
function LiveRoastsWidget() {
  const [feed, setFeed] = useState(() => MOCK_ROASTS.slice(0, 4).map((r) => ({ ...r, id: nextId++ })));
  const [cursor, setCursor] = useState(4);

  useEffect(() => {
    const id = setInterval(() => {
      const next = MOCK_ROASTS[cursor % MOCK_ROASTS.length];
      setFeed((prev) => [{ ...next, id: nextId++, age: "just now" }, ...prev].slice(0, 5));
      setCursor((c) => c + 1);
    }, 4500);
    return () => clearInterval(id);
  }, [cursor]);

  return (
    <div style={{ ...GLASS_WINDOW, borderRadius: "16px", overflow: "hidden" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <motion.div className="w-2 h-2 rounded-full bg-[#FF3B30]"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.13em] text-[#6B6B6B]">Live</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/[0.04] rounded-full px-2.5 py-1">
          <Flame size={10} className="text-[#FF9500]" />
          <span className="font-sans text-[11px] font-semibold text-[#1A1A1A]">1,247 roasted</span>
        </div>
      </div>
      {/* Feed */}
      <AnimatePresence mode="popLayout" initial={false}>
        {feed.map((entry) => (
          <motion.div key={entry.id} layout
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="px-4 py-3 border-b border-black/[0.05] last:border-0 flex items-center gap-3"
            style={{ background: scoreBgMuted(entry.score) }}
          >
            <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${scoreColor(entry.score)}18`, border: `1.5px solid ${scoreColor(entry.score)}30` }}>
              <span className="font-display font-bold text-[14px]" style={{ color: scoreColor(entry.score) }}>{entry.score}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-sans text-[12px] font-semibold text-[#1A1A1A] truncate">{entry.brand}</p>
                <span className="font-sans text-[10px] text-[#AAAAAA] shrink-0 ml-2">{entry.age}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[3px] rounded-full bg-black/[0.07] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: scoreColor(entry.score) }}
                    initial={{ width: 0 }} animate={{ width: `${entry.score * 10}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
                </div>
                <span className="font-sans text-[9px] font-medium shrink-0" style={{ color: scoreColor(entry.score) }}>
                  {entry.score <= 3 ? "Destroyed" : entry.score <= 6 ? "Rough" : "Decent"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="px-4 py-2.5 flex items-center justify-between border-t border-black/[0.06]">
        <span className="font-sans text-[10px] text-[#C0C0C0]">Names anonymized</span>
        <span className="font-sans text-[10px] text-[#AAAAAA] font-medium">Roast yours →</span>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MobileDock({ onPress }: { onPress: (id: string) => void }) {
  const [pressed, setPressed] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setPressed(id);
    setTimeout(() => setPressed(null), 150);
    onPress(id);
  };

  return (
    <div
      className="fixed z-[200] left-1/2 -translate-x-1/2"
      style={{
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        boxShadow: "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)",
        borderRadius: 28,
      }}
    >
      {/* Glass layer 1 — distortion + blur */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          borderRadius: 28,
          backdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      {/* Glass layer 2 — white tint */}
      <div
        className="absolute inset-0 z-10"
        style={{ borderRadius: 28, background: "rgba(255,255,255,0.25)" }}
      />
      {/* Glass layer 3 — inner highlight */}
      <div
        className="absolute inset-0 z-20 overflow-hidden"
        style={{
          borderRadius: 28,
          boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)",
        }}
      />

      {/* Icons */}
      <div className="relative z-30 flex items-end gap-3 px-5 py-2">
        {DOCK_APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => handlePress(app.id)}
            className="flex flex-col items-center gap-1"
            style={{
              transform: pressed === app.id ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 2.2)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.icon}
              alt={app.name}
              width={48}
              height={48}
              className="select-none"
              style={{ width: 48, height: 48, objectFit: "contain" }}
            />
            <span className="font-sans text-[9px] text-[#1A1A1A] font-medium" style={{ letterSpacing: "0.02em" }}>
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MobileLayout() {
  /* ── Wallpaper ── */
  const [wallpaperId, setWallpaperId] = useState(DEFAULT_WALLPAPER_ID);
  const wallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
  const bgStyle: React.CSSProperties = wallpaper.mobileImage
    ? { backgroundImage: `url("${wallpaper.mobileImage}")`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: wallpaper.gradient };

  /* ── Roast form ── */
  const [mode, setMode]           = useState<"idle" | "loading" | "result">("idle");
  const [rateLimited, setRateLimited] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [url, setUrl]             = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mediaType: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [roastId, setRoastId]     = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const [receiptMeta, setReceiptMeta] = useState<{ id: string; date: string; time: string }>({ id: "", date: "", time: "" });
  const [downloading, setDownloading] = useState(false);

  /* ── Cycling headline ── */
  const [wordIndex, setWordIndex]   = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => { setWordIndex((i) => (i + 1) % CYCLING_WORDS.length); setWordVisible(true); }, 300);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  /* ── Sheets ── */
  const [terminalOpen, setTerminalOpen]   = useState(false);
  const [historyOpen, setHistoryOpen]     = useState(false);
  const [wallpapersOpen, setWallpapersOpen] = useState(false);
  const [contactOpen, setContactOpen]     = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [shameOpen, setShameOpen]         = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    if (file.size > 15 * 1024 * 1024) { setFileError("File too large — max 15MB."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setUploadedFile({ name: file.name, data: base64, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setMode("loading");
    setError(null);
    try {
      const res  = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(), url: url.trim(),
          ...(uploadedFile ? { file: { data: uploadedFile.data, mediaType: uploadedFile.mediaType } } : {}),
        }),
      });
      const data = await res.json();
      if (data.error === "rate_limited") {
        setRateLimited(true);
        setMode("idle");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      const roastResult = { ...data, brandName: brandName.trim() };
      const now = new Date();
      setRoastData(roastResult);
      if (data.roastId) setRoastId(data.roastId);
      setReceiptMeta({
        id:   String(Date.now()).slice(-8).replace(/(.{4})/, "$1-"),
        date: now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      });
      try {
        const existing = JSON.parse(localStorage.getItem("roastHistory") || "[]");
        const entry = { id: Date.now(), brandName: roastResult.brandName, score: roastResult.score,
          headline: roastResult.headline, whatsBroken: roastResult.whatsBroken,
          whatsRedeemable: roastResult.whatsRedeemable, verdict: roastResult.verdict,
          date: new Date().toISOString() };
        localStorage.setItem("roastHistory", JSON.stringify([entry, ...existing].slice(0, 10)));
      } catch {}
      setMode("result");
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The engine went offline. Try again.");
      setMode("idle");
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !roastData) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = cardRef.current;
      const canvas = await html2canvas(el, {
        scale: 1, backgroundColor: "#F9F6F0", logging: false, useCORS: true,
        width: 1080, height: el.scrollHeight, windowWidth: 1080,
      });
      const link = document.createElement("a");
      link.download = `receipt-${roastData.brandName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally { setDownloading(false); }
  };

  const resetToForm = useCallback(() => {
    setMode("idle"); setRoastData(null); setRoastId(null); setCopied(false); setBrandName(""); setUrl("");
    setUploadedFile(null); setFileError(null); setError(null);
    setReceiptMeta({ id: "", date: "", time: "" });
  }, []);

  const handleDockPress = (id: string) => {
    if (id === "roast")      { resetToForm(); contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }
    if (id === "terminal")   setTerminalOpen(true);
    if (id === "history")    setHistoryOpen(true);
    if (id === "wallpapers") setWallpapersOpen(true);
    if (id === "contact")    setContactOpen(true);
  };

  const windowTitle = mode === "result" && roastData
    ? `RoastMyBrand.wtf — ${roastData.brandName}`
    : "RoastMyBrand.wtf — New Roast";

  return (
    <div className="fixed inset-0" style={{ ...bgStyle, overflow: "hidden" }}>

      {/* ── Menu bar ── */}
      <MobileMenuBar />

      {/* ── Scrollable content ── */}
      <div
        ref={contentRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ paddingTop: "52px", paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}
      >
        <div className="px-4 py-3 space-y-4">

          {/* ── Main Window Card ── */}
          <MobileWindowCard title={windowTitle}>

            {/* Loading */}
            <AnimatePresence>
              {mode === "loading" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16">
                  <motion.div animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "48px", lineHeight: 1 }}>
                    🔥
                  </motion.div>
                  <p className="font-sans text-[16px] font-semibold text-[#1A1A1A] mt-5 mb-1">Analyzing your brand...</p>
                  <p className="font-sans text-[13px] text-[#9B9B9B] italic">This might hurt.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">

              {/* ── RATE LIMITED ── */}
              {rateLimited && (
                <motion.div key="ratelimit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-5 flex flex-col items-center text-center">
                  <div style={{ fontSize: "48px", lineHeight: 1 }} className="mb-4">🔥</div>
                  <h2 className="font-sans font-extrabold text-[20px] text-[#1A1A1A] mb-2">
                    You&rsquo;ve used your 3 free roasts today.
                  </h2>
                  <p className="font-sans text-[14px] text-[#6B6B6B] mb-5">
                    Come back tomorrow for more brutality.
                  </p>
                  <div className="w-full h-px bg-black/[0.07] mb-5" />
                  <a href="/upgrade"
                    className="flex items-center justify-center w-full h-[50px] bg-[#1A1A1A] text-white font-sans font-semibold rounded-[12px] mb-3"
                    style={{ fontSize: "15px" }}>
                    Get Unlimited Roasts — $7
                  </a>
                  <p className="font-sans text-[12px] text-[#AAAAAA]">
                    Or wait 24 hours for 3 more free roasts.
                  </p>
                </motion.div>
              )}

              {/* ── FORM ── */}
              {!rateLimited && mode === "idle" && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }} className="p-5">
                  <h1 className="font-display text-[#1A1A1A] leading-tight mb-1" style={{ fontSize: "28px", fontWeight: 800 }}>
                    Submit your brand.
                  </h1>
                  <p className="font-display italic leading-snug mb-2" style={{ fontSize: "22px", color: "#0071E3" }}>
                    Find out what&rsquo;s{" "}
                    <span style={{ display: "inline-block", opacity: wordVisible ? 1 : 0, transform: wordVisible ? "translateY(0)" : "translateY(5px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
                      {CYCLING_WORDS[wordIndex]}.
                    </span>
                  </p>
                  <p className="font-sans text-[14px] text-[#6B6B6B] leading-relaxed mb-5">
                    No agency spin. No fluffy feedback. Just the truth from the roast engine.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Your brand name" required style={{ fontSize: "16px" }}
                      className="w-full h-[48px] px-4 rounded-[10px] border border-[#E0E0E0] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15"
                    />
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                      placeholder="Website or logo URL (optional)" style={{ fontSize: "16px" }}
                      className="w-full h-[48px] px-4 rounded-[10px] border border-[#E0E0E0] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15"
                    />

                    {/* File upload */}
                    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                    {uploadedFile ? (
                      <div className="flex items-center gap-2 rounded-[10px] px-4 py-3 border border-[#C7DDF8] bg-[#F0F7FF]">
                        <span className="flex-1 font-sans text-[14px] font-medium text-[#1A1A1A] truncate">{uploadedFile.name}</span>
                        <button type="button" onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                          <X size={14} className="text-[#9B9B9B]" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-full h-16 rounded-[10px] flex flex-col items-center justify-center gap-1"
                        style={{ border: "1.5px dashed #AAAAAA", background: "rgba(0,0,0,0.03)" }}>
                        <span className="font-sans text-[13px] text-[#999]">📎 Attach brand assets (optional)</span>
                        <span className="font-sans text-[11px] text-[#BBBBBB]">PNG, JPG, PDF up to 15MB</span>
                      </button>
                    )}
                    {fileError && <p className="font-sans text-[12px] text-[#FF3B30]">{fileError}</p>}

                    {error && (
                      <div className="flex items-center gap-2 text-[#FF3B30] font-sans text-[13px]">
                        <AlertCircle size={13} /> {error}
                      </div>
                    )}

                    <motion.button type="submit" disabled={!brandName.trim()}
                      whileTap={{ scale: 0.97 }}
                      className="w-full h-[52px] bg-[#0071E3] text-white font-sans font-semibold rounded-[12px] disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,113,227,0.35)]"
                      style={{ fontSize: "16px" }}>
                      <Flame size={15} />
                      Roast My Brand →
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* ── RESULT ── */}
              {mode === "result" && roastData && (
                <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }} className="p-5">

                  {/* Score */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display leading-none" style={{ fontSize: "72px", fontWeight: 900, color: scoreColor(roastData.score) }}>
                      {roastData.score}
                    </span>
                    <span className="font-sans text-[20px] text-black/20 font-semibold">/10</span>
                    <span className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ml-1"
                      style={{ backgroundColor: scoreColor(roastData.score) }}>
                      {scoreLabel(roastData.score)}
                    </span>
                  </div>

                  {/* Score bar */}
                  <div className="flex gap-1 mb-5 max-w-[240px]">
                    {Array.from({ length: 10 }, (_, i) => (
                      <motion.div key={i} className="h-[5px] flex-1 rounded-full"
                        initial={{ backgroundColor: "#E5E5E5" }}
                        animate={{ backgroundColor: i < roastData.score ? scoreColor(roastData.score) : "#E5E5E5" }}
                        transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                      />
                    ))}
                  </div>

                  {/* Headline */}
                  <div className="border-l-[3px] pl-4 mb-5" style={{ borderColor: "#0071E3" }}>
                    <p className="font-display italic text-[18px] text-[#1A1A1A] leading-snug">
                      &ldquo;{roastData.headline}&rdquo;
                    </p>
                  </div>

                  {/* What's broken */}
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-2">What&rsquo;s Broken</p>
                  <div className="space-y-2 mb-4">
                    {roastData.whatsBroken.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                        style={{ borderLeft: "3px solid #FF3B30", background: "rgba(255,59,48,0.05)" }}>
                        <X size={12} className="text-[#FF3B30] shrink-0 mt-0.5" />
                        <p className="font-mono text-[12px] text-[#2A2A2A] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Redeemable */}
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-2">One Thing Going For You</p>
                  <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-4"
                    style={{ borderLeft: "3px solid #34C759", background: "rgba(52,199,89,0.08)" }}>
                    <span className="text-[#34C759] font-bold text-sm shrink-0">✓</span>
                    <p className="font-mono text-[12px] text-[#1A1A1A] leading-relaxed">{roastData.whatsRedeemable}</p>
                  </div>

                  {/* Verdict */}
                  <p className="font-sans text-[13px] text-[#6B6B6B] italic leading-relaxed text-center mb-5 px-1">
                    {roastData.verdict}
                  </p>

                  {/* Hidden full-size receipt for download */}
                  <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none", width: "1080px", overflow: "hidden" }}>
                    <ReceiptCard ref={cardRef} data={roastData} receiptId={receiptMeta.id} date={receiptMeta.date} time={receiptMeta.time} />
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <motion.button onClick={handleDownload} disabled={downloading} whileTap={{ scale: 0.97 }}
                      className="w-full h-[50px] bg-[#1A1A1A] text-white font-sans font-semibold rounded-[12px] flex items-center justify-center gap-2 disabled:opacity-40 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                      style={{ fontSize: "15px" }}>
                      <Printer size={15} />
                      {downloading ? "Generating…" : "Download Receipt"}
                    </motion.button>
                    {roastId && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={async () => {
                          await navigator.clipboard.writeText(`https://roastmybrand.wtf/roast/${roastId}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2500);
                        }}
                        className="w-full h-[50px] font-sans font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-colors"
                        style={{ fontSize: "15px", background: copied ? "#34C759" : "rgba(0,113,227,0.09)", color: copied ? "white" : "#0071E3" }}>
                        {copied ? <CheckCircle2 size={15} /> : <Share2 size={15} />}
                        {copied ? "Link Copied!" : "Share Roast"}
                      </motion.button>
                    )}
                    <p className="font-sans text-[11px] text-[#AAAAAA] text-center">Perfect for Instagram · 1080×1350px</p>
                    <button onClick={resetToForm}
                      className="w-full h-[50px] font-sans font-semibold text-[#1A1A1A] rounded-[12px]"
                      style={{ fontSize: "15px", border: "1.5px solid rgba(0,0,0,0.12)" }}>
                      Roast Another →
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </MobileWindowCard>

          {/* ── Desktop Folders Row ── */}
          <div>
            <p className="font-sans text-[11px] text-white/70 mb-2 px-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              Quick Links
            </p>
            <div className="flex gap-4">
              {[
                { label: "Portfolio",    action: () => setPortfolioOpen(true) },
                { label: "Hall of Shame",action: () => setShameOpen(true) },
                { label: "Free Checklist", action: () => setChecklistOpen(true) },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} className="flex flex-col items-center gap-1" style={{ width: "72px" }}>
                  {FOLDER_SVG_NORMAL}
                  <span className="font-sans text-[10px] text-center text-white leading-tight"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)", wordBreak: "break-word" }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Live Roasts Widget ── */}
          <LiveRoastsWidget />

        </div>
      </div>

      {/* ── Dock ── */}
      <MobileDock onPress={handleDockPress} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM SHEETS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <MobileBottomSheet open={terminalOpen} onClose={() => setTerminalOpen(false)} title="Terminal">
        <TerminalSheetContent />
      </MobileBottomSheet>

      <MobileBottomSheet open={historyOpen} onClose={() => setHistoryOpen(false)} title="Roast History">
        <HistorySheetContent onStartRoast={() => { setHistoryOpen(false); resetToForm(); }} />
      </MobileBottomSheet>

      <MobileBottomSheet open={wallpapersOpen} onClose={() => setWallpapersOpen(false)} title="Wallpapers">
        <WallpapersSheetContent activeId={wallpaperId} onSelect={(id) => { setWallpaperId(id); setWallpapersOpen(false); }} />
      </MobileBottomSheet>

      <MobileBottomSheet open={contactOpen} onClose={() => setContactOpen(false)} title="Contact Azaan">
        <ContactSheetContent />
      </MobileBottomSheet>

      <MobileBottomSheet open={portfolioOpen} onClose={() => setPortfolioOpen(false)} title="Azaan's Portfolio">
        <PortfolioSheetContent />
      </MobileBottomSheet>

      <MobileBottomSheet open={shameOpen} onClose={() => setShameOpen(false)} title="Hall of Shame 💀">
        <HallOfShameSheetContent onRoast={() => { setShameOpen(false); resetToForm(); }} />
      </MobileBottomSheet>

      <MobileBottomSheet open={checklistOpen} onClose={() => setChecklistOpen(false)} title="Brand Identity Checklist">
        <ChecklistSheetContent />
      </MobileBottomSheet>

    </div>
  );
}
