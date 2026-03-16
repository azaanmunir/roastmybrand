import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { RoastOutput } from "@/lib/types";

const client = new Anthropic();

// ── Rate limiting ──────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RESET_INTERVAL = 24 * 60 * 60 * 1000;

// ── System prompt ──────────────────────────────────────────
const SYSTEM_PROMPT = `You are a brutal brand identity critic. 10+ years experience. No fluff. No agency spin.

RULES:
- Famous/well-known brands (Nike, Apple, Notion, Airbnb etc): score 7-10, praise specifically what works, add one thing to sharpen
- Score honestly: destroy what's bad, praise what's good
- Tone: senior CD talking to a founder over coffee. Conversational, direct, occasionally funny. Use contractions. Vary sentence length.
- Never say 'AI', 'overall', 'in conclusion'
- Never generic praise — name the specific element

INDUSTRY SCORING BASELINE:
Score relative to industry standard not absolute perfection.
Below standard: 1-3. At standard (blends in): 4-5. Above standard: 6-7. Distinctive: 8-9. Category-defining: 10.

SCORE LABELS:
1-3: disaster. 4-5: needs work. 6: getting there. 7: pretty solid. 8: strong. 9: exceptional. 10: world class.

Respond ONLY in this JSON format, no other text:
{
  "score": [1-10],
  "categoryScores": {
    "logo": [1-10],
    "typography": [1-10],
    "color": [1-10],
    "voice": [1-10],
    "consistency": [1-10]
  },
  "headline": "[under 12 words, brutal and specific]",
  "whatsBroken": [
    "specific issue 1 — conversational tone",
    "specific issue 2 — conversational tone",
    "specific issue 3 — conversational tone"
  ],
  "whatsRedeemable": "one specific thing that genuinely works",
  "verdict": "two sentences — what brand communicates vs what it should"
}`;

export async function POST(request: Request) {
  // ── Rate limit check ──────────────────────────────────────
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (userLimit) {
    if (now > userLimit.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RESET_INTERVAL });
    } else if (userLimit.count >= RATE_LIMIT) {
      return Response.json(
        {
          error: "rate_limited",
          message: "You have used your 3 free roasts today. Come back tomorrow or upgrade for unlimited roasts.",
          upgradeUrl: "/upgrade",
        },
        { status: 429 }
      );
    } else {
      rateLimitMap.set(ip, { count: userLimit.count + 1, resetTime: userLimit.resetTime });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RESET_INTERVAL });
  }

  // ── Parse body ────────────────────────────────────────────
  const body = await request.json().catch(() => null);

  if (!body || !body.brandName?.trim()) {
    return NextResponse.json({ error: "Brand name required" }, { status: 400 });
  }

  const { brandName, url, file } = body as {
    brandName: string;
    url?: string;
    file?: { data: string; mediaType: string };
  };

  const userTextContent = `Brand submitted for roasting:
- Name: ${brandName}
${url ? `- URL / logo reference: ${url}` : "- No URL provided — roast based on the brand name alone, what it implies, and who likely built it."}
${file ? "- Brand asset attached. Analyze the visual identity from what you can see." : ""}

Be specific to this brand. No generic filler. Make it sting.`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userContent: any[] = [];

  if (file) {
    if (file.mediaType === "application/pdf") {
      userContent.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: file.data },
      });
    } else {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: file.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
          data: file.data,
        },
      });
    }
  }

  userContent.push({ type: "text", text: userTextContent });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in model response");

    const roast = JSON.parse(jsonMatch[0]) as RoastOutput;

    if (
      typeof roast.score !== "number" ||
      typeof roast.headline !== "string" ||
      !Array.isArray(roast.whatsBroken) ||
      roast.whatsBroken.length < 1 ||
      typeof roast.whatsRedeemable !== "string" ||
      typeof roast.verdict !== "string"
    ) {
      throw new Error("Schema validation failed");
    }

    roast.score = Math.max(1, Math.min(10, Math.round(roast.score)));

    if (!roast.categoryScores || typeof roast.categoryScores !== "object") {
      roast.categoryScores = { logo: roast.score, typography: roast.score, color: roast.score, voice: roast.score, consistency: roast.score };
    } else {
      const cs = roast.categoryScores;
      for (const key of ["logo", "typography", "color", "voice", "consistency"] as const) {
        cs[key] = Math.max(1, Math.min(10, Math.round(Number(cs[key]) || roast.score)));
      }
    }

    console.log(JSON.stringify({
      event: "roast_completed",
      timestamp: new Date().toISOString(),
      brandName: brandName,
      score: roast.score,
      hasFile: !!file,
      model: "claude-haiku-4-5-20251001",
      estimatedCost: "$0.001",
      ip: ip,
      headline: roast.headline,
    }));

    return NextResponse.json(roast);
  } catch (err) {
    console.error("[/api/roast] Error:", err);
    return NextResponse.json(
      { error: "The judges are unavailable. Try again in a moment." },
      { status: 500 }
    );
  }
}
