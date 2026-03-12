# DESIGN_BRIEF.md — RoastMyBrand.wtf

Generated from research into top dark premium SaaS sites, Framer Motion production patterns, and viral tool landing pages. Use this as the single source of truth before touching any UI.

---

## Color Palette

| Role | Hex | Usage |
|---|---|---|
| Background base | `#0a0a0a` | Page background |
| Surface | `#111111` | Cards, inputs |
| Surface elevated | `#1a1a1a` | Hover states, modals |
| Border | `#222222` | Subtle dividers |
| Accent | `#FF3B00` | Primary CTAs, score highlights, roast headline |
| Accent glow | `#FF3B0033` | Glow behind accent elements |
| Text primary | `#F5F5F5` | Headlines, body |
| Text muted | `#6B6B6B` | Subtext, labels |
| Text dimmed | `#333333` | Placeholder text |
| Destructive hint | `#FF3B00` | Score 1–3 |
| Warning hint | `#FF8800` | Score 4–6 |
| Redeem green | `#00E87A` | "What's Redeemable" section |

**Accent is electric orange-red (`#FF3B00`).** One accent only — never layer two accent colors. Use it for: score number, CTA buttons, roast headline underline, and watermark.

---

## Typography

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Hero headline | Space Grotesk | 800 | clamp(3rem, 8vw, 7rem) | Tight tracking (-0.03em) |
| Section headlines | Space Grotesk | 700 | 2rem–3rem | |
| Score number | Space Grotesk | 900 | 6rem–9rem | Tabular nums |
| Body / breakdown | Inter | 400 | 1rem | Max width 65ch |
| Roast output text | JetBrains Mono | 400 | 0.95rem | Distinct from UI — makes roast feel like a verdict |
| Microcopy / labels | Space Grotesk | 500 | 0.75rem | Uppercase, letter-spacing 0.1em |
| CTA button | Space Grotesk | 700 | 1rem | |

Load via `next/font/google`. Primary: Space Grotesk. Mono: JetBrains Mono. Fallback: Inter.

---

## Animation Patterns (Framer Motion)

### Page Transition
```tsx
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
```

### Stagger Children (breakdown list, card items)
```tsx
// Parent
variants={{ show: { transition: { staggerChildren: 0.08 } } }}

// Child
variants={{
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}}
```

### Score Counter Reveal
- Animate from 0 → final score over 1.2s with spring physics
- Use `useMotionValue` + `useTransform` to drive the displayed number
- Scale + opacity on enter: `initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}`

### Roast Text Line-by-Line Reveal
- Each line: `initial={{ opacity: 0, x: -8 }}` → `animate={{ opacity: 1, x: 0 }}`
- Stagger 0.12s per line
- Use `AnimatePresence` to gate reveal until API response arrives

### CTA Button Hover
```tsx
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
transition={{ type: "spring", stiffness: 400, damping: 25 }}
```
No bounce. Spring feels physical, not bouncy.

### Card Entrance (shareable roast card)
```tsx
initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
animate={{ opacity: 1, scale: 1, rotateX: 0 }}
transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
```

### Input Focus Glow
Border transitions from `#222222` → `#FF3B00` with a `boxShadow: 0 0 0 2px #FF3B0044` using Framer Motion's `animate` on focus state.

---

## Layout Principles

- **Hero**: Centered, full viewport height. Headline above fold. Input below. CTA below input. No distractions in first viewport.
- **Roast results**: Split layout on desktop — score + headline left, breakdown right. Stack on mobile.
- **Shareable card**: Isolated, centered, 1:1 aspect ratio. Everything else fades.
- **Upgrade CTA**: Full-width band directly below roast card. High contrast. Unmissable.
- **Sections**: Never crowded. Use `py-24` minimum between sections.
- **Max content width**: `max-w-4xl` centered. Never full bleed for text content.

---

## Card Design (Shareable Output)

```
┌─────────────────────────────────┐
│  ROASTMYBRAND.WTF               │ ← muted label, top left
│                                 │
│  [Brand Name]                   │ ← large, bold
│                                 │
│  ████  4/10                     │ ← score in accent color, dominant
│                                 │
│  "Your brand looks like it was  │ ← mono font, italic, roast headline
│   designed during a power       │
│   outage."                      │
│                                 │
│  ─────────────────────────────  │
│  • No visual hierarchy          │ ← whatsBroken, compact
│  • Color palette belongs in     │
│    a 2009 WordPress theme       │
│  • Typography crisis            │
│                                 │
│                  roastmybrand.wtf│ ← watermark, bottom right, muted
└─────────────────────────────────┘
```

- Background: `#111111` + grain texture overlay (CSS `filter: url(#noise)` or SVG data URI)
- Grain opacity: 0.04 — subtle, premium
- Border: 1px solid `#222222`
- Corner radius: `rounded-2xl`
- Export via html2canvas at 2x pixel ratio for retina

---

## Microcopy Tone — Examples

These set the voice. All microcopy in the app should match this register:

| Context | Copy |
|---|---|
| Hero headline | "Your brand is getting roasted." |
| Hero subhead | "Submit your logo or URL. We'll tell you what's actually wrong with it." |
| Input placeholder | "acme.com or paste a logo URL" |
| CTA | "Roast My Brand" |
| Loading state | "Summoning the judges…" |
| Score label | "Brand Brutality Score™" |
| Breakdown header | "What's Actually Broken" |
| Redemption header | "The One Thing That Might Save You" |
| Upgrade CTA headline | "Want the full autopsy?" |
| Upgrade CTA sub | "Get the complete brand teardown — PDF report, no watermark, actionable fixes." |
| Upgrade button | "Get the Full Report — $7" |
| Watermark CTA | "Get yours roasted → roastmybrand.wtf" |

---

## What to Never Build

- No gradients spanning the full page (accent glows only, localized)
- No light mode toggle
- No stock icons (Lucide or Heroicons are fine for functional UI icons)
- No `#0070f3` anywhere
- No lorem ipsum
- No bouncy spring animations (stiffness ≥ 300)
- No more than one accent color on screen at a time
