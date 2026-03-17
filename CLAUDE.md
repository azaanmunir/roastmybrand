# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

RoastMyBrand.wtf — A viral AI-powered brand roasting tool. Users submit a brand name and optional URL; Claude brutally but constructively roasts their brand identity. The UI is a fully interactive macOS desktop simulation running in the browser.

**Brand Personality:** Brutal. Funny. Smart. Think Gordon Ramsay meets brand consultant. Microcopy must be witty and on-brand — never generic SaaS copy.

## Stack

- **Next.js 14** (App Router, server components by default)
- **TypeScript**
- **Tailwind CSS** (all styling — no inline styles or CSS modules)
- **Framer Motion** (all animations and window dragging)
- **Claude API** — `claude-sonnet-4-6` for roast generation and terminal chat
- **next/font** (Instrument Serif, Inter, JetBrains Mono — never raw `@import`)
- **Netlify** (deployment target — live at www.roastmybrand.wtf)

## Commands

```bash
npm run dev         # Start development server
npm run build       # Production build
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
```

## Environment Variables

```
ANTHROPIC_API_KEY        # Required — Claude API access
NEXT_PUBLIC_SITE_URL     # Public URL for og/share links
```

## Architecture

### UI Metaphor
The entire site is a **macOS desktop simulation**. On desktop (`md:` breakpoint and above), users see a full macOS environment: menu bar, desktop wallpaper, draggable windows with liquid glass effects, and a dock. On mobile (`< md`), a simplified `MobileRoastForm` component renders instead — defined inline in `src/app/page.tsx`.

### Window System (`src/app/page.tsx`)
All window state lives in the root `Page` component. `WindowId = "roast" | "liveroasts" | "terminal" | "wallpapers"`. Each window tracks `{ isOpen, isMinimized, zIndex }`. `bringToFront` increments a shared `topZ` counter. Windows only render when `mounted` (avoids SSR hydration mismatches with `window.innerWidth`).

### Desktop Component Layering
`src/components/desktop/` contains thin wrappers (`MenuBar.tsx`, `Dock.tsx`) that configure and delegate to the lower-level primitives in `src/components/ui/` (`mac-os-menu-bar.tsx`, `mac-os-dock.tsx`, `spotlight-background.tsx`). Edit the `ui/` primitives for behavior/layout; edit the `desktop/` wrappers for app-specific menu items or dock icons. Shared desktop types live in `src/components/ui/types.ts`.

### Base Window Component (`src/components/windows/Window.tsx`)
Reusable draggable macOS window shell. Drag activates only from the title bar (`dragListener={false}`, `dragControls.start(e)` on title bar `onPointerDown`). Traffic light buttons: index 0 = close, index 1 = minimize. `isActive` prop controls shadow depth and dot colors.

### Windows
| Component | Purpose |
|---|---|
| `RoastWindow` | Brand submission form + roast results display |
| `TerminalWindow` | Live chat with roast engine via `/api/terminal` |
| `LiveRoastsWindow` | Feed of recent roasts (currently simulated) |
| `WallpapersWindow` | Desktop wallpaper picker (sourced from `src/lib/wallpapers.ts`) |

### API Routes
- **`/api/roast`** — POST `{ brandName, url? }` → calls Claude, returns `RoastOutput` JSON. Extracts JSON via regex (`/\{[\s\S]*\}/`) then validates schema fields before responding.
- **`/api/terminal`** — POST `{ messages: AnthropicMessage[] }` → stateless multi-turn chat. Claude plays "the roast engine" terminal character; never breaks character, never says "AI".

### Types (`src/lib/types.ts`)
```ts
RoastOutput { score: number; headline: string; whatsBroken: string[]; whatsRedeemable: string; verdict: string; }
RoastData extends RoastOutput { brandName: string; }
```

## Design System

**Liquid glass** is mandatory for all panels. CSS utility classes in `src/app/globals.css`:
- `.glass-window` — window bodies (strongest blur: `blur(32px) saturate(200%)`)
- `.glass-menu` — menu bar
- `.glass-dock` — dock
- `.glass-dropdown` — menu bar dropdowns

**Tailwind custom colors** (`tailwind.config.ts`):
- `accent` = `#0071E3` (Apple blue — primary CTAs only)
- `macos-red/yellow/green` — traffic light dots
- `apple-green` / `apple-red` — roast result indicators

**Fonts** (CSS variables set in layout):
- `font-display` → Instrument Serif (headlines, italic)
- `font-sans` → Inter (body, UI)
- `font-mono` → JetBrains Mono (terminal output)

**Never:**
- Dark mode backgrounds (desktop is `#FFFFFF`/`#FAFAFA`)
- Generic SaaS blue other than `accent` (`#0071E3`)
- Lorem ipsum or placeholder copy anywhere

## File Naming

- Components: `PascalCase` → `RoastWindow.tsx`
- Utilities: `camelCase` → `wallpapers.ts`
- One file per component — keep modular

## What's Not Built Yet

- `/pricing`, `/report` routes
- Payments (Stripe/LemonSqueezy)
- html2canvas shareable card export
- Persistent roast history / database
- Real "Live Roasts" feed (currently simulated)

## Workflow

**Screenshot loop rule:** After every major section — screenshot → compare against `DESIGN_BRIEF.md` → list gaps → fix → repeat. Do not advance until the section looks premium.

**Self-review checklist before declaring done:**
- Does it look like it was made by a senior designer?
- Is the microcopy witty and on-brand?
- Do animations feel smooth, not gimmicky?
- Is mobile tested?

**Error handling:** If an approach fails twice, research an alternative. Document what failed in `NOTES.md`.
