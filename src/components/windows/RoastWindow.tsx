"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Link2, Flame, X, CheckCircle2, AlertCircle, Download, Lock, ArrowRight, UploadCloud } from "lucide-react";
import Window from "./Window";
import type { RoastData } from "@/lib/types";

type Mode = "idle" | "loading" | "result";

const CYCLING_WORDS = [
  "wrong",
  "broken",
  "embarrassing",
  "holding you back",
  "costing you clients",
  "screaming mediocre",
  "turning people off",
  "killing your credibility",
  "leaving money on the table",
  "making you invisible",
  "scaring away investors",
];


/* ── Score colors ── */
const scoreColor = (s: number) =>
  s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";

const scoreLabel = (s: number) =>
  ["", "Catastrophic", "Critical", "Needs Surgery", "Below Average", "Mediocre",
   "Passable", "Decent", "Strong", "Excellent", "Flawless"][s] ?? "";

/* ── Roadmap items (blurred teaser) ── */
const ROADMAP = [
  { label: "Visual Identity Overhaul", desc: "Logo, color system, typography — a full rebrand strategy." },
  { label: "Brand Voice & Messaging",  desc: "Tagline, tone, positioning language that actually lands." },
  { label: "Competitive Differentiation", desc: "How to stop competing on price and own your market position." },
];

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
  resetKey?: number;
}

export default function RoastWindow({ zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, resetKey }: Props) {
  const [mode, setMode]         = useState<Mode>("idle");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);
  const [brandName, setBrandName] = useState("");
  const [url, setUrl]           = useState("");
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mediaType: string } | null>(null);
  const [fileError, setFileError]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!resetKey) return;
    setMode("idle");
    setBrandName("");
    setUrl("");
    setRoastData(null);
    setError(null);
    setUploadedFile(null);
    setFileError(null);
  }, [resetKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    if (file.size > 15 * 1024 * 1024) {
      setFileError("File too large — max 15MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setUploadedFile({ name: file.name, data: base64, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const cardRef                 = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const title =
    mode === "result" && roastData
      ? `RoastMyBrand.wtf — ${roastData.brandName}`
      : "RoastMyBrand.wtf — New Roast";

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
          brandName: brandName.trim(),
          url: url.trim(),
          ...(uploadedFile ? { file: { data: uploadedFile.data, mediaType: uploadedFile.mediaType } } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setRoastData({ ...data, brandName: brandName.trim() });
      setMode("result");
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
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#FFFFFF", logging: false });
      const link = document.createElement("a");
      link.download = `roast-${roastData.brandName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const resetToForm = () => { setMode("idle"); setRoastData(null); setBrandName(""); setUrl(""); setUploadedFile(null); setFileError(null); };

  return (
    <Window
      title={title}
      initialX={initialX}
      initialY={initialY}
      width="min(62vw, 820px)"
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <AnimatePresence mode="wait">

        {/* ── FORM ── */}
        {mode === "idle" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-7"
          >
            <h1
              className="font-display text-[#1A1A1A] leading-tight mb-2"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: "-0.025em" }}
            >
              Submit your brand.<br />
              <span className="italic text-accent">
                Find out what&rsquo;s{" "}
                <span
                  style={{
                    display: "inline-block",
                    opacity: wordVisible ? 1 : 0,
                    transform: wordVisible ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {CYCLING_WORDS[wordIndex]}.
                </span>
              </span>
            </h1>
            <p className="font-sans text-[#6B6B6B] leading-relaxed mb-7 max-w-sm" style={{ fontSize: "15px", letterSpacing: "-0.01em" }}>
              No agency spin. No fluffy feedback. Just the unvarnished truth from the roast engine.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  className="w-full rounded-lg pl-9 pr-4 py-3 font-sans text-sm text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all duration-200" style={{ background: '#F5F5F5', border: '1px solid #E0E0E0' }}
                />
              </div>

              <div className="relative">
                <Link2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                <input
                  type="text"
                  placeholder="acme.com or logo URL (optional)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg pl-9 pr-4 py-3 font-sans text-sm text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all duration-200" style={{ background: '#F5F5F5', border: '1px solid #E0E0E0' }}
                />
              </div>

              {/* File upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadedFile ? (
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-sans text-[12px]" style={{ background: "#F0F7FF", border: "1px solid #C7DDF8" }}>
                    <UploadCloud size={13} className="text-accent shrink-0" />
                    <span className="flex-1 truncate text-[#1A1A1A] font-medium">{uploadedFile.name}</span>
                    <button type="button" onClick={removeFile} className="shrink-0 text-[#9B9B9B] hover:text-[#FF3B30] transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors duration-150 hover:bg-black/[0.03]"
                    style={{ border: "1.5px dashed #D0D0D0", background: "transparent" }}
                  >
                    <UploadCloud size={18} className="text-[#AAAAAA]" />
                    <span className="font-sans text-[12px] text-[#6B6B6B]">Drop your brand assets here — logo, guidelines, mockups</span>
                    <span className="font-sans text-[10px] text-[#AAAAAA]">PNG, JPG, PDF up to 15MB</span>
                  </button>
                )}
                {fileError && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[#FF3B30] font-sans text-[11px]">
                    <AlertCircle size={11} /> {fileError}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-[#FF3B30] font-sans text-xs">
                  <AlertCircle size={12} /> {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={!brandName.trim()}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative overflow-hidden flex items-center justify-center gap-2 bg-accent text-white font-sans font-semibold text-sm py-3.5 rounded-lg disabled:opacity-40 shadow-[0_4px_16px_rgba(0,113,227,0.35)] hover:shadow-[0_8px_28px_rgba(0,113,227,0.4)] transition-shadow duration-200 btn-shimmer"
              >
                <Flame size={15} />
                Roast My Brand
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {mode === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-10 flex flex-col items-center justify-center gap-4 min-h-[200px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              🔥
            </motion.div>
            <p className="font-sans text-[#6B6B6B] text-sm">Summoning the judges…</p>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {mode === "result" && roastData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-7"
          >
            {/* Score */}
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="font-display leading-none"
                style={{ fontSize: "clamp(4rem,12vw,7rem)", color: scoreColor(roastData.score) }}
              >
                {roastData.score}
              </span>
              <span className="font-sans text-2xl text-black/20 font-semibold mb-1">/10</span>
              <span
                className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full text-white mb-1 ml-1"
                style={{ backgroundColor: scoreColor(roastData.score) }}
              >
                {scoreLabel(roastData.score)}
              </span>
            </div>

            {/* Score bar */}
            <div className="flex gap-1 mb-5 max-w-xs">
              {Array.from({ length: 10 }, (_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  initial={{ backgroundColor: "#E5E5E5" }}
                  animate={{ backgroundColor: i < roastData.score ? scoreColor(roastData.score) : "#E5E5E5" }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                />
              ))}
            </div>

            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-1">
              Brand Brutality Score™
            </p>

            {/* Headline */}
            <blockquote className="border-l-2 border-accent pl-4 mt-5 mb-6">
              <p className="font-display italic text-lg text-[#1A1A1A] leading-snug">
                &ldquo;{roastData.headline}&rdquo;
              </p>
            </blockquote>

            {/* What's broken */}
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">
              What&rsquo;s Actually Broken
            </p>
            <div className="space-y-2 mb-5">
              {roastData.whatsBroken.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-[#FF3B30]/[0.05] border border-[#FF3B30]/10 rounded-lg px-3 py-2.5">
                  <X size={13} className="text-[#FF3B30] shrink-0 mt-[2px]" />
                  <span className="font-mono text-xs text-[#2A2A2A] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* Redemption */}
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">
              The One Thing That Might Save You
            </p>
            <div className="flex items-start gap-2.5 bg-[#34C759]/[0.08] border border-[#34C759]/20 rounded-lg px-3 py-2.5 mb-5">
              <CheckCircle2 size={14} className="text-[#34C759] shrink-0 mt-[1px]" />
              <span className="font-mono text-xs text-[#1A1A1A] leading-relaxed">{roastData.whatsRedeemable}</span>
            </div>

            {/* Verdict */}
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-2">
              Verdict
            </p>
            <p className="font-sans text-sm text-[#1A1A1A] leading-relaxed mb-6">{roastData.verdict}</p>

            {/* Share card (downloadable) */}
            <div className="border-t border-black/[0.06] pt-5 mb-6">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">
                Shareable Card
              </p>
              <div
                ref={cardRef}
                style={{
                  background: "linear-gradient(135deg, #FDFCFA 0%, #F0EBE3 100%)",
                  borderRadius: "12px",
                  padding: "22px",
                  border: "1px solid rgba(0,0,0,0.07)",
                  position: "relative",
                  fontFamily: "system-ui, sans-serif",
                  marginBottom: "10px",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: scoreColor(roastData.score), borderRadius: "12px 12px 0 0" }} />
                <p style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9B9B9B", marginBottom: "10px" }}>ROASTMYBRAND.WTF</p>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>{roastData.brandName}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1, color: scoreColor(roastData.score) }}>{roastData.score}</span>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "#C8C8C8" }}>/10</span>
                </div>
                <p style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#3A3A3A", fontStyle: "italic", lineHeight: 1.4, marginBottom: "10px" }}>
                  &ldquo;{roastData.headline}&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "10px" }}>
                  {roastData.whatsBroken.slice(0, 3).map((item, i) => (
                    <p key={i} style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#6B6B6B", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span style={{ color: "#FF3B30", marginRight: "5px" }}>✕</span>{item}
                    </p>
                  ))}
                </div>
                <p style={{ position: "absolute", bottom: "14px", right: "16px", fontSize: "7px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C0C0C0" }}>roastmybrand.wtf</p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 glass border border-black/[0.08] text-[#1A1A1A] font-sans font-semibold text-xs px-4 py-2.5 rounded-lg disabled:opacity-40"
                >
                  <Download size={12} />
                  {downloading ? "Generating…" : "Download Card"}
                </motion.button>
                <button onClick={resetToForm} className="font-sans text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition-colors">
                  ← Roast another
                </button>
              </div>
            </div>

            {/* Improvement Roadmap */}
            <div className="border-t border-black/[0.06] pt-5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-2">
                Full Brand Fix Strategy
              </p>
              <h3 className="font-display text-[#1A1A1A] text-2xl italic mb-1">
                Your Brand Fix Roadmap
              </h3>
              <p className="font-sans text-[#6B6B6B] text-xs leading-relaxed mb-5 max-w-sm">
                We found the problems. Here&rsquo;s how to fix them — available in a free consultation with Azaan.
              </p>

              <div className="space-y-2 mb-5">
                {ROADMAP.map((item, i) => (
                  <div key={i} className="glass rounded-lg px-4 py-3 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock size={11} className="text-[#9B9B9B] shrink-0" />
                      <span className="font-sans font-semibold text-sm text-[#1A1A1A]">{item.label}</span>
                    </div>
                    <p className="font-sans text-xs text-[#6B6B6B]" style={{ filter: "blur(3.5px)", userSelect: "none" }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white font-sans font-semibold text-sm px-6 py-3 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-200"
              >
                Book a Session with Azaan
                <ArrowRight size={14} />
              </motion.a>

              <p className="font-sans text-xs text-[#C0C0C0] mt-3">
                Free · No pitch · No pressure
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </Window>
  );
}
