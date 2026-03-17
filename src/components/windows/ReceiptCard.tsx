"use client";

import { forwardRef } from "react";
import type { RoastData } from "@/lib/types";

const scoreColor = (s: number) =>
  s <= 3 ? "#FF3B30" : s <= 6 ? "#FF9500" : "#1A9E45";

const CATEGORY_LABELS: Record<string, string> = {
  logo: "LOGO",
  typography: "TYPOGRAPHY",
  color: "COLOR",
  voice: "VOICE / MESSAGING",
  consistency: "CONSISTENCY",
};

const RECEIPT_FONT = "'Courier Prime', 'Courier New', Courier, monospace";

interface Props {
  data: RoastData;
  receiptId: string;
  date: string;
  time: string;
}

const ScoreBar = ({ val, max = 10 }: { val: number; max?: number }) => (
  <div style={{ display: "flex", gap: "5px", flex: 1, alignItems: "center" }}>
    {Array.from({ length: max }, (_, i) => (
      <div
        key={i}
        style={{
          height: "10px",
          flex: 1,
          borderRadius: "3px",
          background: i < val ? scoreColor(val) : "rgba(0,0,0,0.1)",
        }}
      />
    ))}
  </div>
);

const ReceiptCard = forwardRef<HTMLDivElement, Props>(
  ({ data, receiptId, date, time }, ref) => {
    const { score, categoryScores, brandName, headline, whatsBroken, whatsRedeemable, verdict } = data;

    const LINE = "─────────────────────────────────────────────────────────────────";
    const DASH = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";

    return (
      <div
        ref={ref}
        style={{
          width: "1080px",
          minHeight: "1350px",
          background: "#F8F5EE",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(0,0,0,0.025) 29px, rgba(0,0,0,0.025) 30px)",
          fontFamily: RECEIPT_FONT,
          color: "#1A1A1A",
          padding: "72px 120px 90px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Torn top edge */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "20px" }} viewBox="0 0 1080 20" preserveAspectRatio="none">
          <path d="M0,0 L0,8 Q18,20 36,8 Q54,0 72,8 Q90,20 108,8 Q126,0 144,8 Q162,20 180,8 Q198,0 216,8 Q234,20 252,8 Q270,0 288,8 Q306,20 324,8 Q342,0 360,8 Q378,20 396,8 Q414,0 432,8 Q450,20 468,8 Q486,0 504,8 Q522,20 540,8 Q558,0 576,8 Q594,20 612,8 Q630,0 648,8 Q666,20 684,8 Q702,0 720,8 Q738,20 756,8 Q774,0 792,8 Q810,20 828,8 Q846,0 864,8 Q882,20 900,8 Q918,0 936,8 Q954,20 972,8 Q990,0 1008,8 Q1026,20 1044,8 Q1062,0 1080,8 L1080,0 Z" fill="#F8F5EE" />
        </svg>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.4em", color: "#BBBBBB", marginBottom: "18px", fontFamily: RECEIPT_FONT }}>
            ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
          </p>
          <p style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "0.22em", fontFamily: RECEIPT_FONT, lineHeight: 1 }}>
            ROASTMYBRAND.WTF
          </p>
          <p style={{ fontSize: "16px", letterSpacing: "0.22em", marginTop: "12px", color: "#888", fontFamily: RECEIPT_FONT }}>
            BRAND IDENTITY ANALYSIS RECEIPT
          </p>
          <p style={{ fontSize: "13px", letterSpacing: "0.16em", marginTop: "8px", color: "#AAAAAA", fontFamily: RECEIPT_FONT }}>
            BRUTAL · HONEST · ACCURATE
          </p>
          <p style={{ fontSize: "12px", letterSpacing: "0.4em", color: "#BBBBBB", marginTop: "18px", fontFamily: RECEIPT_FONT }}>
            ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
          </p>
        </div>

        <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "24px" }}>{LINE}</p>

        {/* METADATA */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "16px", letterSpacing: "0.1em", fontFamily: RECEIPT_FONT }}>DATE: {date}</span>
            <span style={{ fontSize: "16px", letterSpacing: "0.1em", fontFamily: RECEIPT_FONT }}>TIME: {time}</span>
          </div>
          <p style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "0.1em", fontFamily: RECEIPT_FONT, marginBottom: "6px" }}>
            BRAND: {brandName.toUpperCase()}
          </p>
          <p style={{ fontSize: "14px", letterSpacing: "0.1em", color: "#999", fontFamily: RECEIPT_FONT }}>
            RECEIPT #: {receiptId}
          </p>
        </div>

        <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "36px" }}>{LINE}</p>

        {/* OVERALL SCORE — prominent */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "8px" }}>OVERALL BRAND SCORE</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "96px", fontWeight: 700, lineHeight: 1, color: scoreColor(score), fontFamily: RECEIPT_FONT }}>{score}</span>
              <span style={{ fontSize: "32px", color: "#CCCCCC", fontFamily: RECEIPT_FONT }}>/10</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "0.08em", color: scoreColor(score), fontFamily: RECEIPT_FONT }}>
              {score <= 3 ? "BRAND DISASTER" : score <= 5 ? "NEEDS WORK" : score <= 6 ? "GETTING THERE" : score <= 7 ? "PRETTY SOLID" : score <= 8 ? "STRONG BRAND" : score <= 9 ? "EXCEPTIONAL" : "WORLD CLASS"}
            </p>
            <div style={{ display: "flex", gap: "5px", marginTop: "10px", justifyContent: "flex-end" }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ width: "28px", height: "12px", borderRadius: "3px", background: i < score ? scoreColor(score) : "rgba(0,0,0,0.1)" }} />
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "32px" }}>{LINE}</p>

        {/* CATEGORY SCORES */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "20px" }}>CATEGORY BREAKDOWN</p>
          {categoryScores && (["logo", "typography", "color", "voice", "consistency"] as const).map((key) => {
            const val = categoryScores[key];
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
                <span style={{ fontSize: "15px", letterSpacing: "0.1em", fontFamily: RECEIPT_FONT, width: "260px", flexShrink: 0 }}>
                  {CATEGORY_LABELS[key]}
                </span>
                <ScoreBar val={val} />
                <span style={{ fontSize: "20px", fontWeight: 700, color: scoreColor(val), fontFamily: RECEIPT_FONT, width: "70px", textAlign: "right", flexShrink: 0 }}>
                  {val}/10
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "36px" }}>{LINE}</p>

        {/* VERDICT / HEADLINE */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "16px" }}>ROAST VERDICT</p>
          <p style={{ fontSize: "28px", fontStyle: "italic", lineHeight: 1.5, fontFamily: RECEIPT_FONT, marginBottom: "20px", borderLeft: "4px solid #1A1A1A", paddingLeft: "20px" }}>
            &ldquo;{headline}&rdquo;
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#444", fontFamily: RECEIPT_FONT }}>
            {verdict}
          </p>
        </div>

        <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "32px" }}>{LINE}</p>

        {/* CRITICAL ISSUES */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "20px" }}>CRITICAL ISSUES</p>
          {whatsBroken.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "18px", alignItems: "flex-start", borderLeft: "3px solid #FF3B30", paddingLeft: "18px" }}>
              <span style={{ fontSize: "16px", color: "#FF3B30", flexShrink: 0, fontFamily: RECEIPT_FONT, fontWeight: 700 }}>
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span style={{ fontSize: "17px", lineHeight: 1.6, fontFamily: RECEIPT_FONT }}>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "10px", color: "#DDDDDD", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "28px" }}>{DASH}</p>

        {/* REDEEMABLE */}
        <div style={{ marginBottom: "44px", borderLeft: "3px solid #1A9E45", paddingLeft: "18px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "14px" }}>ONE THING GOING FOR YOU</p>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "18px", color: "#1A9E45", flexShrink: 0, fontFamily: RECEIPT_FONT, fontWeight: 700 }}>[+]</span>
            <span style={{ fontSize: "17px", lineHeight: 1.6, fontFamily: RECEIPT_FONT }}>{whatsRedeemable}</span>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "44px" }}>{LINE}</p>

        {/* FOOTER */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "15px", letterSpacing: "0.18em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "6px" }}>
            THANK YOU FOR YOUR SUBMISSION
          </p>
          <p style={{ fontSize: "15px", letterSpacing: "0.18em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "32px" }}>
            YOUR BRAND HAS BEEN JUDGED
          </p>

          {/* Barcode */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "14px", height: "56px", alignItems: "flex-end" }}>
            {[3,1,2,4,1,3,2,1,4,2,3,1,2,3,1,4,2,1,3,2,4,1,3,1,2,4,1,3,2,1,3,4,2,1,3,2,1,4,2,3].map((w, i) => (
              <div key={i} style={{ width: `${w * 2}px`, height: `${36 + Math.abs(Math.sin(i * 0.7) * 18)}px`, background: "#1A1A1A", borderRadius: "1px" }} />
            ))}
          </div>

          <p style={{ fontSize: "13px", letterSpacing: "0.3em", color: "#BBBBBB", fontFamily: RECEIPT_FONT, marginBottom: "24px" }}>{receiptId}</p>

          <p style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "0.2em", fontFamily: RECEIPT_FONT, marginBottom: "6px" }}>ROASTMYBRAND.WTF</p>
          <p style={{ fontSize: "14px", letterSpacing: "0.14em", color: "#999", fontFamily: RECEIPT_FONT, marginBottom: "32px" }}>
            FREE CONSULTATION: AZAAN ALI
          </p>

          <p style={{ fontSize: "11px", color: "#CCCCCC", letterSpacing: "0.06em", fontFamily: RECEIPT_FONT, marginBottom: "20px" }}>{LINE}</p>
          <p style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "0.24em", fontFamily: RECEIPT_FONT }}>* KEEP THIS RECEIPT *</p>
        </div>

        {/* Torn bottom edge */}
        <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "20px" }} viewBox="0 0 1080 20" preserveAspectRatio="none">
          <path d="M0,20 L0,12 Q18,0 36,12 Q54,20 72,12 Q90,0 108,12 Q126,20 144,12 Q162,0 180,12 Q198,20 216,12 Q234,0 252,12 Q270,20 288,12 Q306,0 324,12 Q342,20 360,12 Q378,0 396,12 Q414,20 432,12 Q450,0 468,12 Q486,20 504,12 Q522,0 540,12 Q558,20 576,12 Q594,0 612,12 Q630,20 648,12 Q666,0 684,12 Q702,20 720,12 Q738,0 756,12 Q774,20 792,12 Q810,0 828,12 Q846,20 864,12 Q882,0 900,12 Q918,20 936,12 Q954,0 972,12 Q990,20 1008,12 Q1026,0 1044,12 Q1062,20 1080,12 L1080,20 Z" fill="#F8F5EE" />
        </svg>
      </div>
    );
  }
);

ReceiptCard.displayName = "ReceiptCard";
export default ReceiptCard;
