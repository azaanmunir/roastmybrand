"use client";

import Window from "./Window";

const SECTIONS = [
  {
    title: "LOGO",
    items: [
      "Works in black and white",
      "Readable at 16px favicon size",
      "No gradients that break on embroidery/print",
      "Doesn't resemble another brand in your industry",
      "Has a horizontal and stacked version",
    ],
  },
  {
    title: "TYPOGRAPHY",
    items: [
      "Maximum 2 typefaces in the system",
      "Clear hierarchy: heading, subheading, body, caption",
      "Fonts licensed for commercial use",
      "Readable at small sizes on mobile",
      "Font personality matches brand personality",
    ],
  },
  {
    title: "COLOR",
    items: [
      "Primary, secondary, and neutral palette defined",
      "All combinations pass WCAG AA contrast",
      "Works on both light and dark backgrounds",
      "No more than 4 colors in the core palette",
      "Emotional reasoning documented for each color",
    ],
  },
  {
    title: "VOICE",
    items: [
      "One-sentence brand positioning statement exists",
      "Tagline is specific, not generic",
      "Tone of voice guide written down",
      `No "innovative", "passionate", or "solutions" in copy`,
      "A stranger can describe the brand after 5 seconds",
    ],
  },
  {
    title: "CONSISTENCY",
    items: [
      "Brand guidelines document exists",
      "All social profiles use same logo/colors",
      "Email signature matches brand",
      "Business cards exist and are on-brand",
      "Someone other than you can apply the brand correctly",
    ],
  },
];

const SECTION_COLORS: Record<string, string> = {
  LOGO:        "#0071E3",
  TYPOGRAPHY:  "#9B59B6",
  COLOR:       "#FF9500",
  VOICE:       "#FF3B30",
  CONSISTENCY: "#34C759",
};

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
  onOpenContact: () => void;
}

export default function ChecklistWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, onOpenContact,
}: Props) {
  return (
    <Window
      title="Brand Identity Checklist"
      initialX={initialX}
      initialY={initialY}
      width={420}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div style={{ maxHeight: 520, overflowY: "auto" }}>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-black/[0.06]">
          <h2 className="font-sans text-[14px] font-bold text-[#1A1A1A]">Brand Identity Checklist</h2>
          <p className="font-sans text-[12px] text-[#9B9B9B] mt-0.5">25 things your brand needs to not look amateur</p>
        </div>

        {/* Sections */}
        <div className="px-5 py-4 space-y-5">
          {SECTIONS.map((section) => {
            const color = SECTION_COLORS[section.title] ?? "#0071E3";
            return (
              <div key={section.title}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span
                    className="font-sans text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color }}
                  >
                    {section.title}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {section.items.map((item) => (
                    <label
                      key={item}
                      className="flex items-start gap-2.5 cursor-pointer group"
                    >
                      {/* Checkbox visual */}
                      <div
                        className="shrink-0 w-4 h-4 rounded mt-0.5 border flex items-center justify-center"
                        style={{ borderColor: "rgba(0,0,0,0.2)", background: "white" }}
                      />
                      <span className="font-sans text-[12.5px] text-[#3A3A3A] leading-snug">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="px-5 pb-5 border-t border-black/[0.06] pt-4">
          <button
            onClick={onOpenContact}
            className="flex items-center justify-center w-full py-2.5 bg-accent text-white font-sans text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Want a real audit? Book a session with Azaan →
          </button>
        </div>

      </div>
    </Window>
  );
}
