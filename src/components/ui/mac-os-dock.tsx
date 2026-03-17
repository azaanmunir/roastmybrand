'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DockApp {
  id: string;
  name: string;
  icon: string;
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
  className = '',
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>(apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseIconSize: 64, maxScale: 1.6, effectWidth: 240 };
    }
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    if (smallerDimension < 480) {
      return { baseIconSize: Math.max(40, smallerDimension * 0.08), maxScale: 1.4, effectWidth: smallerDimension * 0.4 };
    } else if (smallerDimension < 768) {
      return { baseIconSize: Math.max(48, smallerDimension * 0.07), maxScale: 1.5, effectWidth: smallerDimension * 0.35 };
    } else if (smallerDimension < 1024) {
      return { baseIconSize: Math.max(56, smallerDimension * 0.06), maxScale: 1.6, effectWidth: smallerDimension * 0.3 };
    } else {
      return { baseIconSize: Math.max(68, Math.min(88, smallerDimension * 0.055)), maxScale: 1.9, effectWidth: 320 };
    }
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback((mousePosition: number | null) => {
    if (mousePosition === null) return apps.map(() => minScale);
    return apps.map((_, index) => {
      const normalIconCenter = index * (baseIconSize + baseSpacing) + baseIconSize / 2;
      const minX = mousePosition - effectWidth / 2;
      const maxX = mousePosition + effectWidth / 2;
      if (normalIconCenter < minX || normalIconCenter > maxX) return minScale;
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      return minScale + scaleFactor * (maxScale - minScale);
    });
  }, [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]);

  const calculatePositions = useCallback((scales: number[]) => {
    let currentX = 0;
    return scales.map((scale) => {
      const scaledWidth = baseIconSize * scale;
      const centerX = currentX + scaledWidth / 2;
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseIconSize, baseSpacing]);

  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    setCurrentScales(initialScales);
    setCurrentPositions(calculatePositions(initialScales));
  }, [apps, calculatePositions, minScale, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales(prevScales =>
      prevScales.map((s, i) => s + (targetScales[i] - s) * lerpFactor)
    );
    setCurrentPositions(prevPositions =>
      prevPositions.map((p, i) => p + (targetPositions[i] - p) * lerpFactor)
    );

    const scalesNeedUpdate = currentScales.some((s, i) => Math.abs(s - targetScales[i]) > 0.002);
    const positionsNeedUpdate = currentPositions.some((p, i) => Math.abs(p - targetPositions[i]) > 0.1);

    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animateToTarget);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [animateToTarget]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 16) return;
    lastMouseMoveTime.current = now;
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = 8;
      setMouseX(e.clientX - rect.left - padding);
    }
  }, [baseIconSize]);

  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  const handleAppClick = (appId: string, index: number) => {
    const el = iconRefs.current[index];
    if (el) {
      const bounceHeight = Math.max(-8, -baseIconSize * 0.15);
      el.style.transition = 'transform 0.2s ease-out';
      el.style.transform = `translateY(${bounceHeight}px)`;
      setTimeout(() => { el.style.transform = 'translateY(0px)'; }, 200);
    }
    onAppClick(appId);
  };

  const contentWidth =
    currentPositions.length > 0
      ? Math.max(...currentPositions.map((pos, index) =>
          pos + (baseIconSize * currentScales[index]) / 2
        ))
      : (apps.length * (baseIconSize + baseSpacing)) - baseSpacing;

  const padding = 8;

  return (
    <div
      ref={dockRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${contentWidth + padding * 2}px`,
        borderRadius: '24px',
        padding: `${padding}px`,
        boxShadow: '0 6px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.25)',
        transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Liquid glass layer 1 — distortion + blur */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '24px',
          backdropFilter: 'blur(3px)',
          filter: 'url(#glass-distortion)',
          isolation: 'isolate',
          overflow: 'hidden',
          zIndex: 0,
        }}
      />
      {/* Liquid glass layer 2 — white tint */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.22)',
          zIndex: 1,
        }}
      />
      {/* Liquid glass layer 3 — inner highlight edges */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '24px',
          boxShadow: 'inset 2px 2px 1px rgba(255,255,255,0.55), inset -1px -1px 1px rgba(255,255,255,0.45)',
          overflow: 'hidden',
          zIndex: 2,
        }}
      />
      {/* Icons */}
      <div className="relative" style={{ height: `${baseIconSize}px`, width: '100%', zIndex: 3 }}>
        {apps.map((app, index) => {
          const scale = currentScales[index] ?? 1;
          const position = currentPositions[index] ?? 0;
          const scaledSize = baseIconSize * scale;

          return (
            <div
              key={app.id}
              ref={el => { iconRefs.current[index] = el; }}
              className="absolute cursor-pointer group"
              title={app.name}
              onClick={() => handleAppClick(app.id, index)}
              style={{
                left: `${position - scaledSize / 2}px`,
                bottom: '0px',
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
                transformOrigin: 'bottom center',
                zIndex: Math.round(scale * 10),
              }}
            >
              {/* Tooltip */}
              <div
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  bottom: scaledSize + 8,
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
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                  zIndex: 999,
                }}
              >
                {app.name}
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={app.icon}
                alt={app.name}
                draggable={false}
                className="object-contain select-none w-full h-full"
                style={{
                  filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseIconSize * 0.05) : Math.max(1, baseIconSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseIconSize * 0.1) : Math.max(2, baseIconSize * 0.06)}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`,
                }}
              />

              {/* Running dot */}
              {openApps.includes(app.id) && (
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: `${Math.max(-2, -baseIconSize * 0.05)}px`,
                    width: `${Math.max(3, baseIconSize * 0.06)}px`,
                    height: `${Math.max(3, baseIconSize * 0.06)}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacOSDock;
