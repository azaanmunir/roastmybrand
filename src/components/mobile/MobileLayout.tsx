"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Printer } from "lucide-react";
import ReceiptCard from "@/components/windows/ReceiptCard";
import type { RoastData } from "@/lib/types";

/* ── helpers ── */
const scoreColor = (s: number) =>
  s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";

const scoreLabel = (s: number) =>
  ["", "Catastrophic", "Critical", "Needs Surgery", "Below Average", "Mediocre",
   "Passable", "Decent", "Strong", "Excellent", "Flawless"][s] ?? "";

/* ── Bottom Sheet ── */
function BottomSheet({
  open, onClose, title, children,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80]"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-[81] bg-white rounded-t-2xl overflow-hidden"
            style={{ height: "90vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-black/20" />
            </div>
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-black/[0.06]">
              <h2 className="font-sans text-[15px] font-semibold text-[#1A1A1A]">{title}</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.06]"
              >
                <X size={14} className="text-[#6B6B6B]" />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto" style={{ height: "calc(90vh - 88px)", paddingBottom: "env(safe-area-inset-bottom)" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── History sheet ── */
function HistorySheetContent({ onStartRoast }: { onStartRoast: () => void }) {
  const [entries, setEntries] = useState<Array<{
    id: number; brandName: string; score: number; headline: string; date: string;
  }>>([]);

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem("roastHistory") || "[]")); } catch {}
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center py-16">
        <p style={{ fontSize: "48px", lineHeight: 1 }} className="mb-4">🔥</p>
        <p className="font-sans text-[15px] font-semibold text-[#1A1A1A] mb-2">No roasts yet</p>
        <p className="font-sans text-[13px] text-[#9B9B9B] mb-6">Submit your first brand to start the hall of pain.</p>
        <button
          onClick={onStartRoast}
          className="font-sans text-[14px] font-semibold text-white bg-[#1A1A1A] px-6 py-3 rounded-xl"
        >
          Roast My Brand
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      {entries.map((e) => (
        <div key={e.id} className="rounded-xl border border-black/[0.07] p-4 bg-[#FAFAFA]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[14px] font-semibold text-[#1A1A1A]">{e.brandName}</span>
            <span className="font-sans text-[22px] font-bold" style={{ color: scoreColor(e.score) }}>{e.score}/10</span>
          </div>
          <p className="font-sans text-[12px] text-[#6B6B6B] italic leading-snug">&ldquo;{e.headline}&rdquo;</p>
          <p className="font-sans text-[11px] text-[#AAAAAA] mt-2">
            {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Portfolio sheet ── */
function PortfolioSheetContent() {
  const PROJECTS = [
    { title: "Diyar Furniture Brand",  category: "Branding",      gradient: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" },
    { title: "Solea Tanning UAE",      category: "Packaging",     gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
    { title: "TAKMEEL Real Estate",    category: "Branding",      gradient: "linear-gradient(135deg, #1c1c1c 0%, #2d6a4f 100%)" },
    { title: "Vinteeze Etsy Store",    category: "Social Media",  gradient: "linear-gradient(135deg, #833ab4 0%, #fcb045 100%)" },
  ];
  return (
    <div className="px-5 py-4">
      <div className="mb-5">
        <h3 className="font-display text-[1.3rem] italic text-[#1A1A1A] leading-tight">
          10+ Years. 1,300+ Clients.<br />Zero Generic Brands.
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {PROJECTS.map((p) => (
          <div key={p.title} className="rounded-xl overflow-hidden border border-black/[0.07]">
            <div className="w-full h-24" style={{ background: p.gradient }} />
            <div className="p-3">
              <p className="font-sans text-[12px] font-semibold text-[#1A1A1A] leading-tight mb-1">{p.title}</p>
              <span className="font-sans text-[10px] text-[#0071E3] font-semibold">{p.category}</span>
            </div>
          </div>
        ))}
      </div>
      <a
        href="https://behance.net"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full py-3 bg-[#0071E3] text-white font-sans text-[14px] font-semibold rounded-xl"
      >
        See Full Portfolio on Behance →
      </a>
    </div>
  );
}

/* ── Contact sheet ── */
function ContactSheetContent() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const subject = `Brand Consultation Request — ${name}`;
    const body    = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.open(`mailto:azaan@sevent3.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  return (
    <div className="px-5 py-4">
      <div className="rounded-2xl p-5 mb-5" style={{ background: "linear-gradient(135deg, #0071E3 0%, #0051A8 100%)" }}>
        <p className="font-sans text-[12px] text-white/70 mb-1 uppercase tracking-widest">Free 30-min call</p>
        <p className="font-sans text-[17px] font-semibold text-white mb-3">Book a brand audit session</p>
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 bg-white text-[#0071E3] font-sans text-[14px] font-semibold rounded-xl"
        >
          Book on Calendly →
        </a>
      </div>
      <div className="space-y-3">
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{ fontSize: "16px" }}
          className="w-full h-12 px-4 rounded-xl border border-black/[0.1] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none"
        />
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          style={{ fontSize: "16px" }}
          className="w-full h-12 px-4 rounded-xl border border-black/[0.1] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none"
        />
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your brand..."
          rows={4}
          style={{ fontSize: "16px" }}
          className="w-full px-4 py-3 rounded-xl border border-black/[0.1] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!name || !email || !message}
          className="w-full h-12 bg-[#1A1A1A] text-white font-sans text-[15px] font-semibold rounded-xl disabled:opacity-40"
        >
          Send Message →
        </button>
      </div>
      <p className="font-sans text-[11px] text-[#AAAAAA] text-center mt-4">
        Based in Pakistan · Works globally · Fiverr Top Rated · 1,300+ clients
      </p>
    </div>
  );
}

/* ── Main MobileLayout ── */
export default function MobileLayout() {
  const [mode, setMode]         = useState<"idle" | "loading" | "result">("idle");
  const [brandName, setBrandName] = useState("");
  const [url, setUrl]           = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mediaType: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [receiptMeta, setReceiptMeta] = useState<{ id: string; date: string; time: string }>({ id: "", date: "", time: "" });
  const [downloading, setDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);

  const [historyOpen, setHistoryOpen]     = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [contactOpen, setContactOpen]     = useState(false);

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
          brandName: brandName.trim(),
          url: url.trim(),
          ...(uploadedFile ? { file: { data: uploadedFile.data, mediaType: uploadedFile.mediaType } } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      const roastResult = { ...data, brandName: brandName.trim() };
      const now = new Date();
      setRoastData(roastResult);
      setReceiptMeta({
        id:   String(Date.now()).slice(-8).replace(/(.{4})/, "$1-"),
        date: now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      });
      // Save to localStorage history
      try {
        const existing = JSON.parse(localStorage.getItem("roastHistory") || "[]");
        const entry = { id: Date.now(), brandName: roastResult.brandName, score: roastResult.score,
          headline: roastResult.headline, whatsBroken: roastResult.whatsBroken,
          whatsRedeemable: roastResult.whatsRedeemable, verdict: roastResult.verdict,
          date: new Date().toISOString() };
        localStorage.setItem("roastHistory", JSON.stringify([entry, ...existing].slice(0, 10)));
      } catch {}
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

  const resetToForm = () => {
    setMode("idle"); setRoastData(null); setBrandName(""); setUrl("");
    setUploadedFile(null); setFileError(null); setError(null);
    setReceiptMeta({ id: "", date: "", time: "" });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}
    >
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-4 border-b border-black/[0.06]">
        <span className="font-sans text-[13px] text-[#999999]" style={{ letterSpacing: "0.2em" }}>
          ROASTMYBRAND.WTF
        </span>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {mode === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "52px", lineHeight: 1 }}
            >
              🔥
            </motion.div>
            <p className="font-sans text-[17px] font-semibold text-[#1A1A1A] mt-6 mb-2">Analyzing your brand...</p>
            <p className="font-sans text-[14px] text-[#9B9B9B] italic">This might hurt.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ── FORM ── */}
        {mode !== "result" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {/* Hero */}
            <div className="px-6 pt-8 pb-6">
              <h1
                className="font-display text-[#1A1A1A] leading-tight mb-3"
                style={{ fontSize: "36px", fontWeight: 800 }}
              >
                Submit your brand.
              </h1>
              <p className="font-display italic text-[#FF3B00] leading-snug" style={{ fontSize: "24px" }}>
                Find out what&rsquo;s actually wrong with it.
              </p>
              <p className="font-sans text-[15px] text-[#666666] leading-relaxed mt-3">
                No agency spin. No fluffy feedback. Just the truth from the roast engine.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 space-y-3 pb-8">
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
                required
                style={{ fontSize: "16px" }}
                className="w-full h-[52px] px-4 rounded-xl border border-[#E0E0E0] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Website or logo URL (optional)"
                style={{ fontSize: "16px" }}
                className="w-full h-[52px] px-4 rounded-xl border border-[#E0E0E0] bg-[#F5F5F5] font-sans text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
              />

              {/* File upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {uploadedFile ? (
                <div className="flex items-center gap-2 rounded-xl px-4 py-3 border border-[#C7DDF8] bg-[#F0F7FF]">
                  <span className="flex-1 font-sans text-[14px] font-medium text-[#1A1A1A] truncate">
                    {uploadedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="shrink-0 text-[#9B9B9B]"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[72px] rounded-xl flex flex-col items-center justify-center gap-1"
                  style={{ border: "1.5px dashed #D0D0D0" }}
                >
                  <span className="font-sans text-[14px] text-[#999999]">📎 Attach brand assets (optional)</span>
                  <span className="font-sans text-[11px] text-[#BBBBBB]">PNG, JPG, PDF up to 15MB</span>
                </button>
              )}
              {fileError && <p className="font-sans text-[12px] text-[#FF3B30]">{fileError}</p>}

              {error && (
                <div className="flex items-center gap-2 text-[#FF3B30] font-sans text-[13px]">
                  <AlertCircle size={13} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!brandName.trim() || mode === "loading"}
                style={{ fontSize: "18px" }}
                className="w-full h-[56px] bg-[#1A1A1A] text-white font-sans font-semibold rounded-[14px] disabled:opacity-40 flex items-center justify-center"
              >
                Roast My Brand →
              </button>
            </form>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {mode === "result" && roastData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 px-6 py-6"
          >
            {/* Score */}
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="font-display leading-none"
                style={{ fontSize: "80px", fontWeight: 900, color: scoreColor(roastData.score) }}
              >
                {roastData.score}
              </span>
              <span className="font-sans text-[22px] text-black/20 font-semibold">/10</span>
              <span
                className="font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full text-white ml-1"
                style={{ backgroundColor: scoreColor(roastData.score) }}
              >
                {scoreLabel(roastData.score)}
              </span>
            </div>

            {/* Score bar */}
            <div className="flex gap-1 mb-6 max-w-[260px]">
              {Array.from({ length: 10 }, (_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  initial={{ backgroundColor: "#E5E5E5" }}
                  animate={{ backgroundColor: i < roastData.score ? scoreColor(roastData.score) : "#E5E5E5" }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                />
              ))}
            </div>

            {/* Headline */}
            <div className="border-l-[3px] border-[#FF3B00] pl-4 mb-6">
              <p className="font-display italic text-[20px] text-[#1A1A1A] leading-snug">
                &ldquo;{roastData.headline}&rdquo;
              </p>
            </div>

            {/* What's broken */}
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">
              What&rsquo;s Actually Broken
            </p>
            <div className="space-y-2 mb-5">
              {roastData.whatsBroken.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl"
                  style={{ borderLeft: "3px solid #FF3B00", background: "rgba(255,59,0,0.05)" }}
                >
                  <p className="font-mono text-[13px] text-[#2A2A2A] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {/* Redeemable */}
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">
              The One Thing That Might Save You
            </p>
            <div
              className="px-4 py-3 rounded-xl mb-5"
              style={{ borderLeft: "3px solid #34C759", background: "rgba(52,199,89,0.08)" }}
            >
              <p className="font-mono text-[13px] text-[#1A1A1A] leading-relaxed">{roastData.whatsRedeemable}</p>
            </div>

            {/* Verdict */}
            <p className="font-sans text-[14px] text-[#666666] italic leading-relaxed text-center mb-6 px-2">
              {roastData.verdict}
            </p>

            {/* Hidden full-size ReceiptCard for html2canvas download */}
            <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none", overflow: "hidden", width: "1080px" }}>
              <ReceiptCard
                ref={cardRef}
                data={roastData}
                receiptId={receiptMeta.id}
                date={receiptMeta.date}
                time={receiptMeta.time}
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pb-4">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full h-[52px] bg-[#1A1A1A] text-white font-sans text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Printer size={16} />
                {downloading ? "Generating…" : "Download Receipt"}
              </button>
              <p className="font-sans text-[11px] text-[#AAAAAA] text-center">
                Perfect for Instagram · 1080×1350px
              </p>
              <button
                onClick={resetToForm}
                className="w-full h-[52px] font-sans text-[15px] font-semibold text-[#1A1A1A] rounded-xl"
                style={{ border: "1.5px solid rgba(0,0,0,0.12)" }}
              >
                Roast Another Brand
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Fixed Bottom Nav ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/[0.08]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16">
          {[
            { icon: "🔥", label: "Roast",     action: () => resetToForm() },
            { icon: "🕐", label: "History",   action: () => setHistoryOpen(true) },
            { icon: "💼", label: "Portfolio", action: () => setPortfolioOpen(true) },
            { icon: "✉️", label: "Contact",   action: () => setContactOpen(true) },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center gap-1 px-4 py-2"
            >
              <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
              <span className="font-sans text-[10px] text-[#6B6B6B]" style={{ letterSpacing: "0.04em" }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom Sheets ── */}
      <BottomSheet open={historyOpen} onClose={() => setHistoryOpen(false)} title="Roast History">
        <HistorySheetContent onStartRoast={() => { setHistoryOpen(false); resetToForm(); }} />
      </BottomSheet>
      <BottomSheet open={portfolioOpen} onClose={() => setPortfolioOpen(false)} title="Azaan's Portfolio">
        <PortfolioSheetContent />
      </BottomSheet>
      <BottomSheet open={contactOpen} onClose={() => setContactOpen(false)} title="Contact Azaan">
        <ContactSheetContent />
      </BottomSheet>
    </div>
  );
}
