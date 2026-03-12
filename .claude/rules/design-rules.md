---
description: Visual design standards for RoastMyBrand.wtf
---

## Core Concept
The entire website IS a macOS desktop experience. The user lands on a 
macOS desktop environment rendered in the browser. Everything lives 
inside mac windows. The dock at the bottom has app icons. The menu bar 
is at the top exactly like macOS. This is the entire UI metaphor.

## macOS Desktop Structure
- Menu bar at top: Apple logo, RoastMyBrand.wtf, File, View, Help — 
  all fake mac menus. Right side: wifi, battery, clock (real time)
- Desktop wallpaper: clean white or very subtle soft gradient — 
  NOT egg white, pure #FFFFFF or #FAFAFA max
- Dock at bottom: app icons with macOS-style magnification on hover. 
  Icons for: Roast (flame app), Terminal, About, Pricing
- All content lives inside draggable, resizable macOS windows with 
  frosted glass — backdrop-filter blur, rgba white panels, 
  red/yellow/green traffic light buttons

## Liquid Glass Effect (mandatory)
- Every window/panel: background rgba(255,255,255,0.55) 
  backdrop-filter blur(24px) saturate(180%)
- Window borders: 1px solid rgba(255,255,255,0.8)
- Subtle box-shadow: 0 8px 32px rgba(0,0,0,0.12)
- This must be visible and prominent — not subtle

## Typography Research Required
Before any code: search "best editorial website fonts 2025", 
"premium website typography combinations", "Fonts In Use editorial".
Pick a font pairing that feels premium and has personality.
Avoid: Inter, Roboto, Open Sans, Montserrat — too generic.
Consider: Instrument Serif, Editorial New, Playfair, Neue Haas Grotesk, 
Sohne, Cabinet Grotesk, Satoshi, General Sans, Chillax.
Mix a display serif with a clean geometric sans.

## Terminal Window
A dedicated terminal-style window on the desktop.
Dark glass panel, monospace font, green or amber cursor blink.
Shows a live chat — user types, AI (never called AI, call it 
"the roast engine" or just respond as RoastMyBrand) responds.
Opening line: "roastmybrand % ready to destroy your brand identity_"
This is also a lead capture — at end of chat conversation, 
offer to connect with Azaan directly.

## Windows on Desktop
1. Main Roast Window — brand submission form, hero headline inside
2. Terminal Window — chat interface
3. Preview Window — floating mock roast result (the mac window preview)
4. These windows should feel like they're sitting on a desktop, 
   with slight random rotation offsets (1-2deg) for personality

## Dock Icons
Real app-icon style squares with rounded corners (macOS radius).
Each icon should be a proper illustrated/designed icon not emoji.
Use Lucide icons styled inside colored rounded-rect backgrounds.
Magnify on hover exactly like macOS dock.

## Cursor
Default macOS arrow cursor. No custom cursor effects.

## Buttons
NO generic rounded rectangle buttons.
Use macOS-style buttons: pill shaped, subtle, system-like.
Primary action: matches accent color but refined.
Ghost buttons for secondary actions.

## Color Palette
- Desktop/base: #FFFFFF or #FAFAFA (pure white)
- Glass panels: rgba(255,255,255,0.55) with heavy blur
- Accent: #FF3B00 used sparingly — CTAs and scores only
- Text: #1A1A1A primary, #6B6B6B secondary
- Terminal: #1A1A1A background, #39FF14 or #FFB800 text
- Menu bar: rgba(255,255,255,0.72