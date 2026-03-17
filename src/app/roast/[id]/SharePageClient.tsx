"use client";

import { useState } from "react";
import { CheckCircle2, X, Flame, Link2 } from "lucide-react";

interface StoredRoast {
  score: number;
  categoryScores: { logo: number; typography: number; color: number; voice: number; consistency: number };
  headline: string;
  whatsBroken: string[];
  whatsRedeemable: string;
  verdict: string;
  brandName: string;
  createdAt: string;
  receiptId: string;
  date: string;
  time: string;
}

const scoreColor = (s: number) => s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#34C759";
const scoreLabel = (s: number) =>
  ["", "Brand Disaster", "Brand Disaster", "Brand Disaster", "Needs Work", "Needs Work",
   "Getting There", "Pretty Solid", "Strong Brand", "Exceptional", "World Class"][s] ?? "";

const CATEGORY_LABELS: Record<string, string> = {
  logo: "Logo", typography: "Typography", color: "Color", voice: "Voice", consistency: "Consistency",
};

export default function SharePageClient({ data, id }: { data: StoredRoast; id: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://roastmybrand.wtf/roast/${id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.07]" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}>
        <a href="/" className="font-mono text-sm font-bold tracking-widest text-[#1A1A1A] hover:opacity-70 transition-opacity">
          ROASTMYBRAND.WTF
        </a>
        <a
          href="/"
          className="flex items-center gap-1.5 font-sans text-xs font-semibold text-white px-3.5 py-2 rounded-full"
          style={{ background: "#1A1A1A" }}
        >
          <Flame size={11} />
          Roast Your Brand
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Brand + Score */}
        <div className="mb-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9B9B9B] mb-2">Brand Roast</p>
          <h1 className="font-display text-5xl text-[#1A1A1A] leading-tight mb-1">{data.brandName}</h1>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-display leading-none" style={{ fontSize: "5rem", color: scoreColor(data.score) }}>
              {data.score}
            </span>
            <span className="font-sans text-xl text-black/20 font-semibold">/10</span>
            <span
              className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full text-white ml-1"
              style={{ backgroundColor: scoreColor(data.score) }}
            >
              {scoreLabel(data.score)}
            </span>
          </div>

          {/* Score bar */}
          <div className="flex gap-1 mt-3 max-w-xs">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ backgroundColor: i < data.score ? scoreColor(data.score) : "#E5E5E5" }}
              />
            ))}
          </div>
        </div>

        {/* Headline */}
        <blockquote className="border-l-2 border-[#0071E3] pl-4 mb-8">
          <p className="font-display italic text-xl text-[#1A1A1A] leading-snug">
            &ldquo;{data.headline}&rdquo;
          </p>
        </blockquote>

        {/* Category Scores */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-4">Category Breakdown</p>
          <div className="space-y-3">
            {(["logo", "typography", "color", "voice", "consistency"] as const).map((key) => {
              const val = data.categoryScores[key];
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="font-sans text-xs text-[#6B6B6B] w-24 shrink-0">{CATEGORY_LABELS[key]}</span>
                  <div className="flex gap-0.5 flex-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-full"
                        style={{ backgroundColor: i < val ? scoreColor(val) : "#E5E5E5" }}
                      />
                    ))}
                  </div>
                  <span className="font-sans text-xs font-bold w-8 text-right" style={{ color: scoreColor(val) }}>{val}/10</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* What's broken */}
        <div className="mb-6">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">What&rsquo;s Actually Broken</p>
          <div className="space-y-2">
            {data.whatsBroken.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl px-3.5 py-3" style={{ background: "rgba(255,59,48,0.05)", border: "1px solid rgba(255,59,48,0.1)" }}>
                <X size={12} className="text-[#FF3B30] shrink-0 mt-[2px]" />
                <span className="font-mono text-xs text-[#2A2A2A] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption */}
        <div className="mb-6">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-3">The One Thing That Might Save You</p>
          <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3" style={{ background: "rgba(52,199,89,0.07)", border: "1px solid rgba(52,199,89,0.18)" }}>
            <CheckCircle2 size={13} className="text-[#34C759] shrink-0 mt-[1px]" />
            <span className="font-mono text-xs text-[#1A1A1A] leading-relaxed">{data.whatsRedeemable}</span>
          </div>
        </div>

        {/* Verdict */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B9B9B] mb-2">Verdict</p>
          <p className="font-sans text-sm text-[#1A1A1A] leading-relaxed">{data.verdict}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 font-sans text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
            style={{
              background: copied ? "#34C759" : "#1A1A1A",
              color: "white",
            }}
          >
            {copied ? <CheckCircle2 size={12} /> : <Link2 size={12} />}
            {copied ? "Link Copied!" : "Copy Share Link"}
          </button>
          <a
            href="/"
            className="font-sans text-xs font-semibold px-4 py-2.5 rounded-full transition-all hover:opacity-80"
            style={{ background: "rgba(0,113,227,0.1)", color: "#0071E3" }}
          >
            Roast Your Brand →
          </a>
        </div>

        {/* Footer */}
        <div className="border-t border-black/[0.06] pt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] text-[#C0C0C0] uppercase tracking-widest">
            Roasted on {data.date} · #{data.receiptId}
          </p>
          <a href="/" className="font-mono text-[10px] text-[#C0C0C0] uppercase tracking-widest hover:text-[#1A1A1A] transition-colors">
            roastmybrand.wtf
          </a>
        </div>
      </div>
    </div>
  );
}
