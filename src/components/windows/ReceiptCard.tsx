"use client";

import { forwardRef } from "react";
import type { RoastData } from "@/lib/types";

const scoreColor = (s: number) =>
  s <= 3 ? "#C0392B" : s <= 6 ? "#B7610A" : "#1A7A3A";

const dots = (score: number, max = 10) =>
  Array.from({ length: max }, (_, i) => (i < score ? "█" : "░")).join("");

const CATEGORY_LABELS: Record<string, string> = {
  logo: "LOGO",
  typography: "TYPOGRAPHY",
  color: "COLOR",
  voice: "VOICE",
  consistency: "CONSISTENCY",
};

const RECEIPT_FONT = "'Courier Prime', 'Courier New', Courier, monospace";

interface Props {
  data: RoastData;
  receiptId: string;
  date: string;
  time: string;
}

const ReceiptCard = forwardRef<HTMLDivElement, Props>(
  ({ data, receiptId, date, time }, ref) => {
    const {
      score,
      categoryScores,
      brandName,
      headline,
      whatsBroken,
      whatsRedeemable,
      verdict,
    } = data;

    const LINE = "─────────────────────────────────────────────────────────";
    const DASH = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - -";

    return (
      <div
        ref={ref}
        style={{
          width: "1080px",
          minHeight: "1350px",
          background: "#F9F6F0",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.035) 27px, rgba(0,0,0,0.035) 28px)",
          fontFamily: RECEIPT_FONT,
          color: "#1A1A1A",
          padding: "72px 110px 80px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Torn top edge */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "18px" }}
          viewBox="0 0 1080 18"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L0,8 Q20,18 40,8 Q60,0 80,8 Q100,18 120,8 Q140,0 160,8 Q180,18 200,8 Q220,0 240,8 Q260,18 280,8 Q300,0 320,8 Q340,18 360,8 Q380,0 400,8 Q420,18 440,8 Q460,0 480,8 Q500,18 520,8 Q540,0 560,8 Q580,18 600,8 Q620,0 640,8 Q660,18 680,8 Q700,0 720,8 Q740,18 760,8 Q780,0 800,8 Q820,18 840,8 Q860,0 880,8 Q900,18 920,8 Q940,0 960,8 Q980,18 1000,8 Q1020,0 1040,8 Q1060,18 1080,8 L1080,0 Z"
            fill="#F9F6F0"
          />
        </svg>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.35em", color: "#9B9B9B", marginBottom: "14px", fontFamily: RECEIPT_FONT }}>
            ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
          </p>
          <p style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "0.2em", fontFamily: RECEIPT_FONT, lineHeight: 1 }}>
            ROASTMYBRAND.WTF
          </p>
          <p style={{ fontSize: "17px", letterSpacing: "0.2em", marginTop: "10px", color: "#666", fontFamily: RECEIPT_FONT }}>
            BRAND IDENTITY ANALYSIS RECEIPT
          </p>
          <p style={{ fontSize: "14px", letterSpacing: "0.12em", marginTop: "6px", color: "#999", fontFamily: RECEIPT_FONT }}>
            BRUTAL · HONEST · ACCURATE
          </p>
          <p style={{ fontSize: "13px", letterSpacing: "0.35em", color: "#9B9B9B", marginTop: "14px", fontFamily: RECEIPT_FONT }}>
            ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
          </p>
        </div>

        <p style={{ fontSize: "12px", color: "#C0C0C0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "20px" }}>
          {LINE}
        </p>

        {/* METADATA */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "17px", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT }}>
              DATE: {date}
            </span>
            <span style={{ fontSize: "17px", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT }}>
              TIME: {time}
            </span>
          </div>
          <p style={{ fontSize: "17px", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "6px" }}>
            BRAND: {brandName.toUpperCase()}
          </p>
          <p style={{ fontSize: "17px", letterSpacing: "0.08em", color: "#888", fontFamily: RECEIPT_FONT }}>
            RECEIPT #: {receiptId}
          </p>
        </div>

        <p style={{ fontSize: "12px", color: "#C0C0C0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "28px" }}>
          {LINE}
        </p>

        {/* CATEGORY SCORES HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", letterSpacing: "0.18em", color: "#999", fontFamily: RECEIPT_FONT }}>
            CATEGORY
          </span>
          <span style={{ fontSize: "14px", letterSpacing: "0.18em", color: "#999", fontFamily: RECEIPT_FONT }}>
            SCORE
          </span>
        </div>

        <p style={{ fontSize: "11px", color: "#D0D0D0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "18px" }}>
          {DASH}
        </p>

        {/* CATEGORY SCORE ROWS */}
        {categoryScores &&
          (["logo", "typography", "color", "voice", "consistency"] as const).map((key) => {
            const val = categoryScores[key];
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.1em",
                    fontFamily: RECEIPT_FONT,
                    width: "240px",
                  }}
                >
                  {CATEGORY_LABELS[key]}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    letterSpacing: "0.04em",
                    fontFamily: RECEIPT_FONT,
                    color: scoreColor(val),
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  {dots(val)}
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    fontFamily: RECEIPT_FONT,
                    color: scoreColor(val),
                    width: "60px",
                    textAlign: "right",
                  }}
                >
                  {val}/10
                </span>
              </div>
            );
          })}

        <p style={{ fontSize: "11px", color: "#D0D0D0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "20px" }}>
          {DASH}
        </p>

        {/* OVERALL SCORE */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "36px",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              fontFamily: RECEIPT_FONT,
            }}
          >
            OVERALL SCORE
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 700,
                lineHeight: 1,
                color: scoreColor(score),
                fontFamily: RECEIPT_FONT,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: "24px",
                color: "#BBBBBB",
                fontFamily: RECEIPT_FONT,
              }}
            >
              /10
            </span>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#C0C0C0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "32px" }}>
          {LINE}
        </p>

        {/* VERDICT */}
        <div style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "0.18em",
              color: "#999",
              fontFamily: RECEIPT_FONT,
              marginBottom: "16px",
            }}
          >
            ROAST VERDICT:
          </p>
          <p
            style={{
              fontSize: "24px",
              fontStyle: "italic",
              lineHeight: 1.55,
              fontFamily: RECEIPT_FONT,
              marginBottom: "20px",
            }}
          >
            &ldquo;{headline}&rdquo;
          </p>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.65,
              color: "#444",
              fontFamily: RECEIPT_FONT,
            }}
          >
            {verdict}
          </p>
        </div>

        <p style={{ fontSize: "12px", color: "#C0C0C0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "28px" }}>
          {LINE}
        </p>

        {/* WHAT'S BROKEN */}
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "0.18em",
              color: "#999",
              fontFamily: RECEIPT_FONT,
              marginBottom: "18px",
            }}
          >
            CRITICAL ISSUES:
          </p>
          {whatsBroken.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "14px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  color: "#C0392B",
                  flexShrink: 0,
                  fontFamily: RECEIPT_FONT,
                  fontWeight: 700,
                }}
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span
                style={{
                  fontSize: "17px",
                  lineHeight: 1.55,
                  fontFamily: RECEIPT_FONT,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "11px", color: "#D0D0D0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "22px" }}>
          {DASH}
        </p>

        {/* REDEEMABLE */}
        <div style={{ marginBottom: "36px" }}>
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "0.18em",
              color: "#999",
              fontFamily: RECEIPT_FONT,
              marginBottom: "14px",
            }}
          >
            ONE THING GOING FOR YOU:
          </p>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span
              style={{
                fontSize: "17px",
                color: "#1A7A3A",
                flexShrink: 0,
                fontFamily: RECEIPT_FONT,
                fontWeight: 700,
              }}
            >
              [+]
            </span>
            <span
              style={{
                fontSize: "17px",
                lineHeight: 1.55,
                fontFamily: RECEIPT_FONT,
              }}
            >
              {whatsRedeemable}
            </span>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#C0C0C0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "36px" }}>
          {LINE}
        </p>

        {/* FOOTER */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "16px",
              letterSpacing: "0.15em",
              color: "#888",
              fontFamily: RECEIPT_FONT,
              marginBottom: "6px",
            }}
          >
            THANK YOU FOR YOUR SUBMISSION
          </p>
          <p
            style={{
              fontSize: "16px",
              letterSpacing: "0.15em",
              color: "#888",
              fontFamily: RECEIPT_FONT,
              marginBottom: "28px",
            }}
          >
            YOUR BRAND HAS BEEN JUDGED
          </p>

          {/* Barcode */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2px",
              marginBottom: "12px",
              height: "52px",
              alignItems: "flex-end",
            }}
          >
            {[3,1,2,4,1,3,2,1,4,2,3,1,2,3,1,4,2,1,3,2,4,1,3,1,2,4,1,3,2,1,3,4,2,1,3].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w * 2.2}px`,
                  height: `${38 + Math.abs(Math.sin(i * 0.7) * 14)}px`,
                  background: "#1A1A1A",
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>

          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.28em",
              color: "#AAAAAA",
              fontFamily: RECEIPT_FONT,
              marginBottom: "20px",
            }}
          >
            {receiptId}
          </p>

          <p
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              fontFamily: RECEIPT_FONT,
              marginBottom: "6px",
            }}
          >
            ROASTMYBRAND.WTF
          </p>
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "0.12em",
              color: "#888",
              fontFamily: RECEIPT_FONT,
              marginBottom: "28px",
            }}
          >
            FREE CONSULTATION: AZAAN ALI
          </p>

          <p style={{ fontSize: "12px", color: "#C0C0C0", letterSpacing: "0.08em", fontFamily: RECEIPT_FONT, marginBottom: "18px" }}>
            {LINE}
          </p>

          <p
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              fontFamily: RECEIPT_FONT,
            }}
          >
            * KEEP THIS RECEIPT *
          </p>
        </div>

        {/* Torn bottom edge */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "18px" }}
          viewBox="0 0 1080 18"
          preserveAspectRatio="none"
        >
          <path
            d="M0,18 L0,10 Q20,0 40,10 Q60,18 80,10 Q100,0 120,10 Q140,18 160,10 Q180,0 200,10 Q220,18 240,10 Q260,0 280,10 Q300,18 320,10 Q340,0 360,10 Q380,18 400,10 Q420,0 440,10 Q460,18 480,10 Q500,0 520,10 Q540,18 560,10 Q580,0 600,10 Q620,18 640,10 Q660,0 680,10 Q700,18 720,10 Q740,0 760,10 Q780,18 800,10 Q820,0 840,10 Q860,18 880,10 Q900,0 920,10 Q940,18 960,10 Q980,0 1000,10 Q1020,18 1040,10 Q1060,0 1080,10 L1080,18 Z"
            fill="#F9F6F0"
          />
        </svg>
      </div>
    );
  }
);

ReceiptCard.displayName = "ReceiptCard";
export default ReceiptCard;
