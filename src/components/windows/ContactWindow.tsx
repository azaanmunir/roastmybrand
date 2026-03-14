"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Send, MapPin } from "lucide-react";
import Window from "./Window";

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
}

export default function ContactWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY,
}: Props) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Brand Inquiry from RoastMyBrand.wtf");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:azaan@sevent3.com?subject=${subject}&body=${body}`;
  };

  const inputCls = "w-full rounded-lg px-3 py-2.5 font-sans text-[13px] text-[#1A1A1A] placeholder-[rgba(0,0,0,0.28)] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all duration-200";
  const inputStyle = { background: "#F5F5F5", border: "1px solid #E0E0E0" };

  return (
    <Window
      title="Talk to Azaan"
      initialX={initialX}
      initialY={initialY}
      width={380}
      zIndex={zIndex}
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="p-5 space-y-5">

        {/* Section 1 — Book a session */}
        <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #EBF4FF 0%, #F0F7FF 100%)", border: "1px solid rgba(0,113,227,0.12)" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Calendar size={14} className="text-white" />
            </div>
            <div>
              <h3 className="font-sans text-[13px] font-semibold text-[#1A1A1A]">Get a real brand audit</h3>
              <p className="font-sans text-[11.5px] text-[#6B6B6B] leading-relaxed mt-0.5">
                Not a roast. A full strategic brand review with actionable fixes from a designer with 10+ years experience.
              </p>
            </div>
          </div>
          <motion.a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-white font-sans text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Calendar size={13} />
            Book a Free Call →
          </motion.a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-black/[0.07]" />
          <span className="font-sans text-[11px] text-[#C0C0C0]">or</span>
          <div className="flex-1 h-px bg-black/[0.07]" />
        </div>

        {/* Section 2 — Quick message */}
        <form onSubmit={handleSend} className="space-y-2.5">
          <h3 className="font-sans text-[13px] font-semibold text-[#1A1A1A]">Send a message</h3>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputCls}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputCls}
            style={inputStyle}
          />
          <textarea
            placeholder="What can I help you with?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className={`${inputCls} resize-none`}
            style={inputStyle}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1A1A1A] text-white font-sans text-[13px] font-semibold rounded-lg hover:opacity-85 transition-opacity"
          >
            <Send size={12} />
            Send →
          </motion.button>
        </form>

        {/* Footer */}
        <div className="pt-1 border-t border-black/[0.06]">
          <p className="flex items-center gap-1.5 font-sans text-[10.5px] text-[#AAAAAA] justify-center text-center">
            <MapPin size={9} className="shrink-0" />
            Based in Pakistan · Works globally · Fiverr Top Rated · 1,300+ clients
          </p>
        </div>

      </div>
    </Window>
  );
}
