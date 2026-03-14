"use client";

import MacOSMenuBar from "@/components/ui/mac-os-menu-bar";

interface MenuBarProps {
  onMenuAction?: (action: string) => void;
}

const ROAST_MENUS = [
  {
    label: "File",
    items: [
      { label: "New Roast", action: "new-roast", shortcut: "⌘N" },
      { type: "separator" as const },
      { label: "Export Report…", action: "export-report", shortcut: "⌘E" },
      { type: "separator" as const },
      { label: "Close Window", action: "close-window", shortcut: "⌘W" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", action: "undo", shortcut: "⌘Z" },
      { label: "Redo", action: "redo", shortcut: "⌘⇧Z" },
      { type: "separator" as const },
      { label: "Clear Form", action: "clear-form", shortcut: "⌘⇧K" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Toggle Terminal", action: "toggle-terminal", shortcut: "⌘T" },
      { label: "Toggle Live Roasts", action: "toggle-liveroasts", shortcut: "⌘L" },
      { type: "separator" as const },
      { label: "Change Wallpaper…", action: "wallpapers", shortcut: "⌘⇧W" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "About RoastMyBrand.wtf", action: "about" },
      { type: "separator" as const },
      { label: "Talk to Azaan →", action: "contact" },
      { label: "Report a Bug", action: "report-bug" },
    ],
  },
];

export default function MenuBar({ onMenuAction }: MenuBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <MacOSMenuBar
        appName="RoastMyBrand.wtf"
        menus={ROAST_MENUS}
        onMenuAction={onMenuAction}
      />
    </div>
  );
}
