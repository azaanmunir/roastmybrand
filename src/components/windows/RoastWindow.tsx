"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Link2, Flame, X, CheckCircle2, AlertCircle, Printer, Lock, ArrowRight, UploadCloud, Share2 } from "lucide-react";
import Window from "./Window";
import ReceiptCard from "./ReceiptCard";
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
  ["", "Brand Disaster", "Brand Disaster", "Brand Disaster", "Needs Work", "Needs Work",
   "Getting There", "Pretty Solid", "Strong Brand", "Exceptional", "World Class"][s] ?? "";

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
  preloadedRoast?: RoastData | null;
}

export default function RoastWindow({ zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, resetKey, preloadedRoast }: Props) {
  const [mode, setMode]         = useState<Mode>("idle");
  const [rateLimited, setRateLimited] = useState(false);
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
  const [roastId, setRoastId]   = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [receiptMeta, setReceiptMeta] = useState<{ id: string; date: string; time: string }>({ id: "", date: "", time: "" });
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mediaType: string } | null>(null);
  const [fileError, setFileError]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!resetKey) return;
    setMode("idle");
    setBrandName("");
    setUrl("");
    setRoastData(null);
    setRoastId(null);
    setCopied(false);
    setError(null);
    setUploadedFile(null);
    setFileError(null);
  }, [resetKey]);

  useEffect(() => {
    if (!preloadedRoast) return;
    setRoastData(preloadedRoast);
    setRoastId(preloadedRoast.roastId ?? null);
    setCopied(false);
    const now = new Date();
    setReceiptMeta({
      id: String(Date.now()).slice(-8).replace(/(.{4})/, "$1-"),
      date: now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    });
    setMode("result");
  }, [preloadedRoast]);

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

  const saveToHistory = (data: RoastData) => {
    try {
      const existing = JSON.parse(localStorage.getItem("roastHistory") || "[]");
      const entry = {
        id: Date.now(),
        brandName: data.brandName,
        score: data.score,
        headline: data.headline,
        whatsBroken: data.whatsBroken,
        whatsRedeemable: data.whatsRedeemable,
        verdict: data.verdict,
        categoryScores: data.categoryScores,
        roastId: data.roastId,
        date: new Date().toISOString(),
      };
      const updated = [entry, ...existing].slice(0, 10);
      localStorage.setItem("roastHistory", JSON.stringify(updated));
    } catch { /* localStorage unavailable */ }
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
          brandName: brandName.trim(),
          url: url.trim(),
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
      setRoastData(roastResult);
      if (data.roastId) setRoastId(data.roastId);
      const now = new Date();
      setReceiptMeta({
        id: String(Date.now()).slice(-8).replace(/(.{4})/, "$1-"),
        date: now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      });
      setMode("result");
      saveToHistory(roastResult);
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
      // Capture the full-size receipt (1080px wide) at scale 1
      const el = cardRef.current;
      const canvas = await html2canvas(el, {
        scale: 1,
        backgroundColor: "#F9F6F0",
        logging: false,
        useCORS: true,
        width: 1080,
        height: el.scrollHeight,
        windowWidth: 1080,
      });
      const link = document.createElement("a");
      link.download = `receipt-${roastData.brandName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const resetToForm = () => { setMode("idle"); setRoastData(null); setRoastId(null); setCopied(false); setBrandName(""); setUrl(""); setUploadedFile(null); setFileError(null); setReceiptMeta({ id: "", date: "", time: "" }); };

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

        {/* ── RATE LIMITED ── */}
        {rateLimited && (
          <motion.div
            key="ratelimit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-7 flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-4">🔥</div>
            <h2 className="font-sans font-extrabold text-[20px] text-[#1A1A1A] mb-2">
              You&rsquo;ve used your 3 free roasts today.
            </h2>
            <p className="font-sans text-[14px] text-[#6B6B6B] mb-5">
              Come back tomorrow for more brutality.
            </p>
            <div className="w-full h-px bg-black/[0.07] mb-5" />
            <motion.a
              href="/upgrade"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center w-full py-3 bg-[#1A1A1A] text-white font-sans font-semibold text-sm rounded-lg mb-3"
            >
              Get Unlimited Roasts — $7
            </motion.a>
            <p className="font-sans text-[12px] text-[#AAAAAA]">
              Or wait 24 hours for 3 more free roasts.
            </p>
          </motion.div>
        )}

        {/* ── FORM ── */}
        {!rateLimited && mode === "idle" && (
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
            {/* Score + Category grid */}
            <div className="flex gap-6 mb-6 items-start">
              {/* Big score */}
              <div className="shrink-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display leading-none" style={{ fontSize: "clamp(4rem,10vw,6rem)", color: scoreColor(roastData.score) }}>
                    {roastData.score}
                  </span>
                  <span className="font-sans text-xl text-black/20 font-semibold">/10</span>
                </div>
                <span className="font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full text-white inline-block" style={{ backgroundColor: scoreColor(roastData.score) }}>
                  {scoreLabel(roastData.score)}
                </span>
                <div className="flex gap-0.5 mt-3 w-32">
                  {Array.from({ length: 10 }, (_, i) => (
                    <motion.div key={i} className="h-1.5 flex-1 rounded-full"
                      initial={{ backgroundColor: "#E5E5E5" }}
                      animate={{ backgroundColor: i < roastData.score ? scoreColor(roastData.score) : "#E5E5E5" }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                    />
                  ))}
                </div>
                <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#BBBBBB] mt-1.5">
                  Brand Brutality Score™
                </p>
              </div>

              {/* Category scores */}
              {roastData.categoryScores && (
                <div className="flex-1 rounded-xl p-4" style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#BBBBBB] mb-3">Category Breakdown</p>
                  <div className="space-y-2.5">
                    {(["logo", "typography", "color", "voice", "consistency"] as const).map((key) => {
                      const val = roastData.categoryScores[key];
                      const labels: Record<string, string> = { logo: "Logo", typography: "Type", color: "Color", voice: "Voice", consistency: "Consistency" };
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-sans text-[10px] text-[#9B9B9B] w-20 shrink-0">{labels[key]}</span>
                          <div className="flex gap-0.5 flex-1">
                            {Array.from({ length: 10 }, (_, i) => (
                              <motion.div key={i} className="h-1.5 flex-1 rounded-full"
                                initial={{ backgroundColor: "#E5E5E5" }}
                                animate={{ backgroundColor: i < val ? scoreColor(val) : "#E5E5E5" }}
                                transition={{ delay: 0.3 + i * 0.04, duration: 0.25 }}
                              />
                            ))}
                          </div>
                          <span className="font-sans text-[10px] font-bold w-7 text-right shrink-0" style={{ color: scoreColor(val) }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Headline */}
            <div className="rounded-xl px-5 py-4 mb-6" style={{ background: "rgba(0,0,0,0.02)", borderLeft: "3px solid #1A1A1A" }}>
              <p className="font-display italic text-[1.15rem] text-[#1A1A1A] leading-snug">
                &ldquo;{roastData.headline}&rdquo;
              </p>
            </div>

            {/* What's broken */}
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#BBBBBB] mb-2.5">
              What&rsquo;s Actually Broken
            </p>
            <div className="space-y-1.5 mb-5">
              {roastData.whatsBroken.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg px-3 py-2.5" style={{ borderLeft: "2px solid #FF3B30", background: "rgba(255,59,48,0.04)" }}>
                  <span className="font-mono text-[10px] font-bold text-[#FF3B30] shrink-0 mt-[1px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-xs text-[#2A2A2A] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* Redemption */}
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#BBBBBB] mb-2.5">
              One Thing That Might Save You
            </p>
            <div className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 mb-5" style={{ borderLeft: "2px solid #34C759", background: "rgba(52,199,89,0.05)" }}>
              <CheckCircle2 size={13} className="text-[#34C759] shrink-0 mt-[1px]" />
              <span className="font-mono text-xs text-[#1A1A1A] leading-relaxed">{roastData.whatsRedeemable}</span>
            </div>

            {/* Verdict */}
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#BBBBBB] mb-2">Verdict</p>
            <p className="font-sans text-sm text-[#3A3A3A] leading-relaxed mb-6 italic">{roastData.verdict}</p>

            {/* Thermal Receipt Card */}
            <div className="border-t border-black/[0.06] pt-5 mb-6">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">
                Download Receipt
              </p>

              {/* Scaled preview */}
              <div
                style={{
                  width: "400px",
                  height: "500px",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "4px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  marginBottom: "14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                }}
              >
                <div style={{ transform: "scale(0.3704)", transformOrigin: "top left" }}>
                  <ReceiptCard
                    ref={cardRef}
                    data={roastData}
                    receiptId={receiptMeta.id}
                    date={receiptMeta.date}
                    time={receiptMeta.time}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#1A1A1A] text-white font-sans font-semibold text-xs px-5 py-2.5 rounded-lg disabled:opacity-40 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                >
                  <Printer size={12} />
                  {downloading ? "Generating…" : "Download Receipt"}
                </motion.button>

                {roastId && (
                  <motion.button
                    onClick={async () => {
                      await navigator.clipboard.writeText(`https://roastmybrand.wtf/roast/${roastId}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 font-sans font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors"
                    style={{
                      background: copied ? "#34C759" : "rgba(0,113,227,0.1)",
                      color: copied ? "white" : "#0071E3",
                    }}
                  >
                    {copied ? <CheckCircle2 size={12} /> : <Share2 size={12} />}
                    {copied ? "Link Copied!" : "Share Roast"}
                  </motion.button>
                )}

                <button onClick={resetToForm} className="font-sans text-xs text-[#9B9B9B] hover:text-[#1A1A1A] transition-colors ml-auto">
                  ← Roast another
                </button>
              </div>
              {roastId && (
                <p className="font-sans text-[10px] text-[#9B9B9B] mt-2">
                  Public link: roastmybrand.wtf/roast/{roastId}
                </p>
              )}
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
