# REDESIGN_BRIEF.md — RoastMyBrand.wtf v2

Research from mariavareva.com, gucduck.com, and Apple glass morphism patterns.

---

## Reference Site Takeaways

### mariavareva.com
- **Font**: DM Sans, weights 400–900, negative letter-spacing (-0.03em), tight line-height (1.2em)
- **Color restraint**: ~5 colors max — near-black, white, soft background (#F8F8F7), one accent blue
- **Fixed navigation**: sticky, always readable, no clutter
- **Micro-details that signal quality**: `mix-blend-mode: difference` on specific elements, custom cursor states per interaction context, pointer-events carefully managed
- **Editorial quality**: typographic decisions are intentional — nothing generic

### gucduck.com
- **Big idea**: macOS desktop metaphor as the entire UI skin — dock, windows, desktop wallpaper
- **Custom mascot**: not stock, not generic — instantly distinctive
- **Full-bleed background imagery**: the wallpaper IS the design
- **OS interface = instant recognition** — users already know how to read it

### Key synthesis
The premium sites share one thing: **a strong metaphor, executed consistently**. Our metaphor is macOS. It should permeate every element — glass panels, window chrome, system typography weight, traffic light dots, system-like buttons.

---

## Color Palette

| Role | Value | Usage |
|---|---|---|
| Page base | `#FDFCFA` | Background base (warm white) |
| Background gradient end | `#EDE8E3` | Subtle radial gradient |
| Glass panel | `rgba(255,255,255,0.72)` | All card/panel surfaces |
| Glass border | `rgba(255,255,255,0.85)` | Panel borders |
| Hairline | `rgba(0,0,0,0.07)` | Subtle dividers |
| Text primary | `#1A1A1A` | All body + UI text |
| Text secondary | `#6B6B6B` | Labels, captions |
| Text placeholder | `rgba(0,0,0,0.28)` | Input placeholders |
| Accent | `#FF3B00` | CTAs, score, marquee strip BG |
| macOS red dot | `#FF5F57` | Window close |
| macOS yellow dot | `#FEBC2E` | Window minimise |
| macOS green dot | `#28C840` | Window maximise |
| Redeem green | `#34C759` | Redemption arc (Apple system green) |
| Broken red | `#FF3B30` | Broken items (Apple system red) |

---

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Hero display | Bebas Neue | 400 (visually ~900) | All caps, condensed, massive |
| UI / body | Inter | 400, 500, 600, 700 | System-clean, readable |
| Roast output / mono | JetBrains Mono | 400, 500 | Verdict, breakdown text |

**Rules**:
- Display headline in Bebas Neue: 100px+ on desktop, fluid with `clamp()`
- All-caps headline is intentional — punch over elegance
- Letter-spacing on Inter: `-0.01em` for headings, `0` for body
- NEVER use font-weight above 700 for Inter (no 800/900 available)

---

## Glass Morphism Implementation

```css
/* Standard glass panel */
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Window chrome — heavier blur */
.glass-window {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.14), 0 8px 24px rgba(0, 0, 0, 0.07);
}

/* Header bar */
.glass-header {
  background: rgba(253, 252, 250, 0.85);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
```

---

## macOS Window Anatomy

```
┌─────────────────────────────────────────────┐
│  ● ● ●   RoastMyBrand.wtf — Acme Corp      │  ← title bar
│  red yel grn                                │
├─────────────────────────────────────────────┤
│                                             │
│  [Window content — roast result]            │
│                                             │
└─────────────────────────────────────────────┘
```

- Title bar height: 40px
- Dots: 12px diameter, 8px gap, 14px from left
- Window: `border-radius: 12px` (macOS standard)
- Drop shadow: multilayer (far soft shadow + close sharp shadow)
- Floating animation: gentle y oscillation, amplitude 12px, period 4s

---

## Animations

| Element | Animation |
|---|---|
| macOS window hero mock | Gentle float: y ±12px, 4s ease-in-out infinite |
| Marquee strip | translateX 0 → -50%, 30s linear infinite |
| Custom cursor | Flame emoji, spring follows mouse (stiffness 150, damping 18) |
| Page entrance | opacity 0→1 + y 20px→0, 0.5s ease |
| Button hover | scale 1.02, shadow lift |
| Button click | scale 0.98 |
| Input focus | border accent + 3px ring |
| Score bar fill | width 0% → score%, 1.2s ease-out, delay 0.4s |
| Breakdown items | stagger 0.1s, x -10→0, opacity 0→1 |
| Locked roadmap items | blur filter on text, lock icon pulsing |

---

## Hero Layout (Desktop)

```
[HEADER — frosted glass, sticky]
[MARQUEE — accent strip, scrolling roasts]

[   HERO SECTION                                          ]
[                                                         ]
[  AI-POWERED BRAND CRITIQUE    |  ┌──────────────────┐  ]
[                               |  │ ● ● ●  Acme Corp │  ]
[  YOUR BRAND IS                |  │                  │  ]
[  GETTING ROASTED.             |  │  4/10            │  ]
[                               |  │  "Your logo..."  │  ]
[  Submit your brand. We'll     |  │  ✕ No hierarchy  │  ]
[  tell you what's wrong.       |  │  ✕ Wrong palette │  ]
[                               |  └──────────────────┘  ]
[  [🏷 Brand name        ]      |                         ]
[  [🔗 URL or logo URL  ]       |                         ]
[  [🔥 Roast My Brand   ]       |                         ]
```

---

## Microcopy v2

| Context | Copy |
|---|---|
| Header CTA | "Get Roasted →" |
| Hero label | "AI-Powered Brand Critique" |
| Hero headline | "YOUR BRAND IS GETTING ROASTED." |
| Hero subtext | "Submit your brand. We'll tell you exactly what's wrong with it — no agency spin, no fluff." |
| Input: brand name | Placeholder: "Acme Corp" |
| Input: URL | Placeholder: "acme.com or paste a logo URL" |
| Loading state | "Summoning the judges…" |
| Score label | "Brand Brutality Score™" |
| Roadmap header | "Your Brand Fix Roadmap" |
| Roadmap sub | "We found the problems. Here's how to fix them." |
| Roadmap CTA | "Talk to Azaan →" |
| Roadmap locked note | "Unlock the full roadmap with a free consultation" |

---

## Self-Review Checklist

- [ ] All text contrast ≥ 4.5:1 (dark text on glass backgrounds)
- [ ] macOS window metaphor feels authentic (correct dots, typography, shadows)
- [ ] Marquee strip content is witty, not filler
- [ ] Mobile layout is tested and readable
- [ ] Glass panels don't break without backdrop-filter support
- [ ] Cursor effect doesn't interfere with usability
- [ ] No generic SaaS-blue color appears anywhere
- [ ] Every piece of copy is witty and on-brand
