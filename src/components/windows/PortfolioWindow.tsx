"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Window from "./Window";

const KOFEE_IMAGES = Array.from({ length: 22 }, (_, i) => ({
  src: `/portfolio/Kofee/Kofee-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Kofee Brand Identity — Slide ${i + 1}`,
}));

const PROJECTS = [
  {
    title: "Kofee",
    category: "Branding",
    images: KOFEE_IMAGES,
    thumbnail: KOFEE_IMAGES[0].src,
  },
  {
    title: "Solea Tanning UAE",
    category: "Packaging",
    images: [],
    thumbnail: null,
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  {
    title: "TAKMEEL Real Estate",
    category: "Branding",
    images: [],
    thumbnail: null,
    gradient: "linear-gradient(135deg, #1c1c1c 0%, #2d6a4f 100%)",
  },
  {
    title: "Vinteeze Etsy Store",
    category: "Social Media",
    images: [],
    thumbnail: null,
    gradient: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Branding:       { bg: "rgba(0,113,227,0.12)",  text: "#0071E3" },
  Packaging:      { bg: "rgba(255,149,0,0.12)",   text: "#E08600" },
  "Social Media": { bg: "rgba(52,199,89,0.12)",   text: "#1E9944" },
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

export default function PortfolioWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY, onOpenContact,
}: Props) {
  const [gallery, setGallery] = useState<{ images: typeof KOFEE_IMAGES; index: number; title: string } | null>(null);

  const openGallery = (project: typeof PROJECTS[0]) => {
    if (project.images.length === 0) return;
    setGallery({ images: project.images, index: 0, title: project.title });
  };

  const prev = () => setGallery((g) => g ? { ...g, index: (g.index - 1 + g.images.length) % g.images.length } : g);
  const next = () => setGallery((g) => g ? { ...g, index: (g.index + 1) % g.images.length } : g);

  return (
    <Window
      title="Azaan's Portfolio"
      initialX={initialX}
      initialY={initialY}
      width={500}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="p-5" style={{ maxHeight: 520, overflowY: "auto" }}>

        {/* Header */}
        <div className="mb-5">
          <h2 className="font-display text-[1.4rem] italic text-[#1A1A1A] leading-tight">
            10+ Years. 1,300+ Clients.<br />Zero Generic Brands.
          </h2>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {PROJECTS.map((p) => {
            const cat = CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS["Branding"];
            const hasImages = p.images.length > 0;
            return (
              <div
                key={p.title}
                className={`rounded-xl overflow-hidden border border-black/[0.07] ${hasImages ? "cursor-pointer" : ""}`}
                style={{ background: "#FAFAFA" }}
                onClick={() => openGallery(p)}
              >
                {/* Image / gradient area */}
                <div className="w-full h-28 rounded-t-xl overflow-hidden relative">
                  {p.thumbnail ? (
                    <Image
                      src={p.thumbnail}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: (p as { gradient?: string }).gradient }} />
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="font-sans text-[12.5px] font-semibold text-[#1A1A1A] mb-1.5 leading-tight">{p.title}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cat.bg, color: cat.text }}
                    >
                      {p.category}
                    </span>
                    {hasImages && (
                      <span className="font-sans text-[10px] text-[#AAAAAA]">{p.images.length} slides</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <motion.a
            href="https://behance.net/azaanali"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-white font-sans text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <ExternalLink size={13} />
            See Full Portfolio on Behance →
          </motion.a>
          <button
            onClick={onOpenContact}
            className="flex items-center justify-center w-full py-2.5 bg-black/[0.05] hover:bg-black/[0.09] font-sans text-[13px] font-semibold text-[#1A1A1A] rounded-lg transition-colors"
          >
            Work with Azaan →
          </button>
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col rounded-b-xl overflow-hidden"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
          >
            {/* Lightbox header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0">
              <span className="font-sans text-[13px] font-semibold text-white">{gallery.title}</span>
              <div className="flex items-center gap-3">
                <span className="font-sans text-[11px] text-white/50">{gallery.index + 1} / {gallery.images.length}</span>
                <button onClick={() => setGallery(null)} className="text-white/60 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex-1 mx-4 mb-4 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={gallery.index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={gallery.images[gallery.index].src}
                    alt={gallery.images[gallery.index].alt}
                    fill
                    className="object-contain"
                    sizes="480px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-1.5 px-4 pb-4 overflow-x-auto shrink-0">
              {gallery.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGallery((g) => g ? { ...g, index: i } : g)}
                  className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                    i === gallery.index ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="48px" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Window>
  );
}
