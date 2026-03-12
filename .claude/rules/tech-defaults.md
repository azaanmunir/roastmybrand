---
description: Technical standards and defaults
---

## Framework Defaults
- Next.js 14 with App Router
- TypeScript preferred
- Tailwind for all styling
- Framer Motion for all animations
- Use server components where possible, client only when needed

## API Integration
- Claude API: claude-sonnet-4-6 for roast generation
- Structured prompt → JSON output → render dynamically
- Roast output schema:
  {
    score: number (1-10),
    headline: string (brutal one-liner),
    whatsBroken: string[3],
    whatsRedeemable: string[1],
    verdict: string (2 sentences max)
  }

## File Naming
- Components: PascalCase (RoastCard.tsx)
- Pages: kebab-case (roast-results)
- Utilities: camelCase (generateRoast.ts)

## Performance
- Images: next/image always
- Fonts: next/font always
- No unused dependencies