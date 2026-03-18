'use client';

import React from 'react';

interface DockApp {
  id: string;
  name: string;
  icon: string;
  href?: string;
  divider?: boolean;
  iconSizePx?: number;
}

interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

const MacOSDock: React.FC<MacOSDockProps> = ({
  apps,
  onAppClick,
  openApps = [],
}) => {
  return (
    <div
      className="relative flex font-semibold text-black cursor-pointer transition-all duration-700 rounded-3xl"
      style={{
        boxShadow: '0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)',
        transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)',
      }}
    >
      {/* Glass layer 1 — distortion + blur */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
        style={{
          backdropFilter: 'blur(3px)',
          filter: 'url(#glass-distortion)',
          isolation: 'isolate',
        }}
      />
      {/* Glass layer 2 — white tint */}
      <div
        className="absolute inset-0 z-10 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      />
      {/* Glass layer 3 — inner highlight edges */}
      <div
        className="absolute inset-0 z-20 rounded-3xl overflow-hidden"
        style={{
          boxShadow:
            'inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)',
        }}
      />

      {/* Icons */}
      <div className="relative z-30 flex items-end gap-2 px-3 py-2">
        {apps.map((app) => app.divider ? (
          <div
            key={app.id}
            className="self-stretch flex items-center mx-1"
          >
            <div className="w-px h-10 rounded-full" style={{ background: "rgba(0,0,0,0.15)" }} />
          </div>
        ) : (
          <div
            key={app.id}
            className="relative flex flex-col items-center group/icon cursor-pointer"
            onClick={() => app.href ? window.open(app.href, "_blank", "noopener noreferrer") : onAppClick(app.id)}
          >
            {/* Tooltip */}
            <div
              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-0 group-hover/icon:opacity-100 transition-opacity duration-150 whitespace-nowrap"
              style={{
                background: 'rgba(24,24,24,0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                letterSpacing: '-0.01em',
                zIndex: 999,
              }}
            >
              {app.name}
            </div>

            {/* Icon image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.icon}
              alt={app.name}
              draggable={false}
              className="select-none transition-all duration-700 group-hover/icon:scale-110"
              style={{
                width: app.iconSizePx ?? 64,
                height: app.iconSizePx ?? 64,
                transformOrigin: 'bottom center',
                transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)',
              }}
            />

            {/* Running dot */}
            {openApps.includes(app.id) && (
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacOSDock;
