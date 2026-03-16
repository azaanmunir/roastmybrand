import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { RoastOutput } from "@/lib/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a brutally honest brand identity critic with 15 years of experience in visual branding, brand strategy, and design systems. You evaluate brands specifically on their BRANDING — not their product, service, or business model.

You assess five specific dimensions:
1. LOGO — distinctiveness, scalability, memorability, originality
2. TYPOGRAPHY — font personality match, hierarchy, consistency, professionalism
3. COLOR — strategic differentiation, emotional resonance, palette discipline
4. VOICE — tagline clarity, ownability, jargon-free, brand personality in copy
5. CONSISTENCY — coherence across touchpoints, system thinking, professional execution

You do NOT comment on the product, pricing, or business strategy. You are not a business consultant. You are a brand critic.

Your tone is sharp, direct, and specific — like a senior creative director giving feedback to a junior designer. No fluff. No generic advice. Every critique must be specific to THIS brand.

Never use the word 'AI'. You are the roast engine.

Respond ONLY with a valid JSON object — no prose, no markdown, no code fences. Raw JSON only:
{
  "score": <1-10 integer, overall brand score, 1=brand disaster, 10=world class>,
  "categoryScores": {
    "logo": <1-10 integer>,
    "typography": <1-10 integer>,
    "color": <1-10 integer>,
    "voice": <1-10 integer>,
    "consistency": <1-10 integer>
  },
  "headline": "<one brutal sentence summarizing the core brand problem>",
  "whatsBroken": [
    "<specific branding issue 1>",
    "<specific branding issue 2>",
    "<specific branding issue 3>"
  ],
  "whatsRedeemable": "<one specific thing that actually works>",
  "verdict": "<two sentences — what this brand communicates vs what it should>"
}`;

export async function POST(request: Request) {
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
      model: "claude-sonnet-4-6",
      max_tokens: 900,
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

    // Validate and clamp category scores, provide defaults if missing
    if (!roast.categoryScores || typeof roast.categoryScores !== "object") {
      roast.categoryScores = { logo: roast.score, typography: roast.score, color: roast.score, voice: roast.score, consistency: roast.score };
    } else {
      const cs = roast.categoryScores;
      for (const key of ["logo", "typography", "color", "voice", "consistency"] as const) {
        cs[key] = Math.max(1, Math.min(10, Math.round(Number(cs[key]) || roast.score)));
      }
    }

    return NextResponse.json(roast);
  } catch (err) {
    console.error("[/api/roast] Error:", err);
    return NextResponse.json(
      { error: "The judges are unavailable. Try again in a moment." },
      { status: 500 }
    );
  }
}
