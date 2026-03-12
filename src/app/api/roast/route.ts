import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { RoastOutput } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !body.brandName?.trim()) {
    return NextResponse.json({ error: "Brand name required" }, { status: 400 });
  }

  const { brandName, url } = body as { brandName: string; url?: string };

  const prompt = `You are a brutally honest brand consultant who roasts brand identities. Think Gordon Ramsay meets senior brand strategist. You are direct, cutting, and funny — but always specific and constructive. Never vague. End every roast with exactly one redemption arc.

Brand submitted for roasting:
- Name: ${brandName}
${url ? `- URL / logo: ${url}` : "- No URL provided — roast based on the brand name alone, what it implies, and who likely built it."}

Respond ONLY with a valid JSON object. No prose before or after. No markdown. No code block. Raw JSON only.

{
  "score": <integer 1–10, where 1 is catastrophic and 10 is genuinely exceptional — be harsh, most brands are 3–6>,
  "headline": "<one brutal roast sentence, max 15 words, punchy and specific>",
  "whatsBroken": [
    "<specific issue 1 — name the exact problem>",
    "<specific issue 2>",
    "<specific issue 3>"
  ],
  "whatsRedeemable": "<one thing genuinely worth saving — be specific, not generic>",
  "verdict": "<closing 2-sentence verdict — brutally honest, ends with a real path forward>"
}

Be specific to this brand. No generic filler like 'needs improvement'. Make it sting.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in model response");
    }

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

    return NextResponse.json(roast);
  } catch (err) {
    console.error("[/api/roast] Error:", err);
    return NextResponse.json(
      { error: "The judges are unavailable. Try again in a moment." },
      { status: 500 }
    );
  }
}
