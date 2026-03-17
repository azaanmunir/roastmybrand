---
name: Roast Engine
description: Builds and tests the Claude API roast generation logic. Use when wiring the AI roast functionality.
tools: bash, web_search
---

## Goal
Build a reliable, funny, and constructive brand roast generator.

## Roast Prompt Template to Build
The prompt sent to Claude API should include:
- Brand name
- Industry/niche
- What was submitted (URL or logo description)
- Instruction to be brutally honest, funny, but end with one redemption arc

## Output Schema (strict JSON)
{
  "score": 4,
  "headline": "Your brand looks like it was designed during a power outage.",
  "whatsBroken": [
    "Logo has no visual hierarchy",
    "Color palette belongs in a 2009 WordPress theme",
    "Typography is having an identity crisis"
  ],
  "whatsRedeemable": "The core concept is actually solid — it just needs a designer.",
  "verdict": "Right now this brand is actively losing you clients. The good news? That's fixable."
}

## Testing
After building the API route:
1. Test with a fake brand name
2. Verify JSON parses correctly
3. Verify each field renders in the UI
4. Test edge cases: empty input, very long brand names, non-English names
```

---

## Phase 3: The Build Prompt

Once your folder and all files above are in place, open Antigravity, point Claude Code at the `roastmybrand/` folder, set to **Bypass Permissions**, and paste this as your first message:
```
I want to build RoastMyBrand.wtf — a viral AI-powered brand roasting tool.

Before writing any code, run the research-design skill to find the best 
dark premium UI design patterns, animations, and typography in use right now. 
Build a DESIGN_BRIEF.md from that research.

Once the brief is done, initialize the Next.js 14 project with TypeScript, 
Tailwind, and Framer Motion. Then build the full site in this order:

1. Landing page hero — bold headline, submission form (brand name + URL or 
   logo upload), strong CTA. Should feel like a premium tool, not a toy.
   
2. Roast results page — animated reveal of the roast score, the brutal 
   one-liner headline, the breakdown, and the redemption arc. Include a 
   shareable card component the user can download.

3. Pricing/upgrade CTA — shown after the free roast, before the full PDF 
   report is unlocked.

After each section, screenshot it, compare against your DESIGN_BRIEF.md, 
list what's off, and fix it before moving on.

Microcopy should be witty and on-brand — think Gordon Ramsay meets brand 
consultant. No generic SaaS copy.

The roast API route should call Claude claude-sonnet-4-6 and return structured 
JSON per the roast-engine skill spec.

Do not use any example site for design — research and define the aesthetic 
yourself based on current best practices.
```

---

## Phase 4: Deploy Prompt

Once the build looks solid locally, paste this:
```
The site looks good locally. Now deploy it to Netlify.

1. Initialize a Git repo if not already done
2. Create a Netlify project called roastmybrand (live at www.roastmybrand.wtf)
3. Set up environment variables: ANTHROPIC_API_KEY, NEXT_PUBLIC_SITE_URL
4. Add Stripe or LemonSqueezy for the $7 paid report — wire the 
   /api/checkout route
5. Deploy and confirm the live URL works end to end
6. Test the full roast flow on the live URL