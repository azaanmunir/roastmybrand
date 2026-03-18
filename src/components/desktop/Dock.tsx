"use client";

import MacOSDock from "@/components/ui/mac-os-dock";

type DockIconId = "roast" | "terminal" | "history" | "wallpapers" | "pricing" | "contact" | "liveroasts";

interface DockProps {
  onIconClick: (id: DockIconId) => void;
  openWindows?: DockIconId[];
}

const DOCK_APPS = [
  { id: "roast",      name: "Roast My Brand", icon: "https://cdn.jim-nielsen.com/macos/1024/music-2021-05-25.png?rf=1024" },
  { id: "terminal",   name: "Terminal",        icon: "https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024" },
  { id: "history",    name: "History",         icon: "https://cdn.jim-nielsen.com/macos/1024/messages-2021-05-25.png?rf=1024" },
  { id: "wallpapers", name: "Wallpapers",      icon: "https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024" },
  { id: "pricing",    name: "Pricing",         icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024" },
  { id: "contact",    name: "Contact",         icon: "https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024" },
  { id: "divider-social", name: "", icon: "", divider: true },
  { id: "instagram",  name: "Instagram",       icon: "/icons/instagram.png", href: "https://www.instagram.com/aza4n/", iconPadding: 8 },
  { id: "linkedin",   name: "LinkedIn",        icon: "/icons/linkedin.png",  href: "https://www.linkedin.com/in/azaanism/", iconPadding: 8 },
];

export default function Dock({ onIconClick, openWindows = [] }: DockProps) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90]">
      <MacOSDock
        apps={DOCK_APPS}
        onAppClick={(id) => onIconClick(id as DockIconId)}
        openApps={openWindows}
      />
    </div>
  );
}
