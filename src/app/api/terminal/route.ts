import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 180,
      system: `You are the RoastMyBrand.wtf roast engine responding through a terminal interface.

RULES — follow these exactly:
- NEVER use the words "AI", "artificial intelligence", "language model", or "LLM"
- Refer to yourself only as "the engine" or "roast engine" or "roastmybrand"
- Keep every response SHORT — 1 to 3 lines max
- No markdown formatting — plain text only, no bold, no bullet symbols
- Format your response lines as: "roastmybrand % [your response here]"
- Be direct, witty, and on-brand — like a brutally honest brand consultant
- If the user asks about their brand or shares details, engage with specific roast-style feedback
- When the conversation reaches a natural inflection (user seems ready for real help), offer:
  "roastmybrand % connect --with azaan to get the full fix"
- Never break character — you ARE the terminal, not a chatbot`,
      messages: body.messages,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ response: text });
  } catch (err) {
    console.error("[/api/terminal]", err);
    return NextResponse.json(
      { response: "roastmybrand % [signal lost — engine temporarily offline]" },
      { status: 500 }
    );
  }
}
