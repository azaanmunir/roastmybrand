"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Window from "./Window";

type LineType = "system" | "user" | "engine";

interface Line {
  id: number;
  type: LineType;
  content: string;
}

let lineId = 0;
const mkLine = (type: LineType, content: string): Line => ({ id: lineId++, type, content });

const PROMPT = "roastmybrand %";

/* Terminal text colors — macOS Terminal authentic palette */
const LINE_COLOR: Record<LineType, string> = {
  system: "rgba(255,255,255,0.38)", // dim — login shell output
  user:   "#FFFFFF",                 // bright white
  engine: "#FFB800",                 // amber — engine responses
};

interface Props {
  zIndex: number;
  isActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  initialX: number;
  initialY: number;
}

export default function TerminalWindow({
  zIndex, isActive, onFocus, onClose, onMinimize, initialX, initialY,
}: Props) {
  const [lines, setLines]       = useState<Line[]>([]);
  const [input, setInput]       = useState("");
  const [thinking, setThinking] = useState(false);
  const [ready, setReady]       = useState(false);
  const endRef                  = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);
  const history                 = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const addLine = (line: Line) => setLines((prev) => [...prev, line]);

  useEffect(() => {
    const now = new Date().toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const t1 = setTimeout(() => addLine(mkLine("system", `Last login: ${now} on ttys001`)), 300);
    const t2 = setTimeout(() => addLine(mkLine("system", `${PROMPT} initializing roast engine...`)), 950);
    const t3 = setTimeout(() => addLine(mkLine("system", `${PROMPT} loading brand analysis modules...`)), 1700);
    const t4 = setTimeout(() => {
      addLine(mkLine("engine", `${PROMPT} ready to destroy your brand identity_`));
      setReady(true);
    }, 2500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, thinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    addLine(mkLine("user", `${PROMPT} ${text}`));
    history.current.push({ role: "user", content: text });
    setThinking(true);
    try {
      const res   = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.current }),
      });
      const data  = await res.json();
      const reply: string = data.response ?? `${PROMPT} [signal lost]`;
      reply.split("\n").filter(Boolean).forEach((l) => addLine(mkLine("engine", l)));
      history.current.push({ role: "assistant", content: reply });
    } catch {
      addLine(mkLine("engine", `${PROMPT} [connection error — engine temporarily offline]`));
    } finally {
      setThinking(false);
    }
  };

  return (
    <Window
      title="Terminal — roast-engine"
      initialX={initialX}
      initialY={initialY}
      initialRotate={-1.2}
      width={460}
      zIndex={zIndex}
      isActive={isActive}
      titleBarStyle={{
        background: "linear-gradient(180deg, #3D3D3D 0%, #2A2A2A 100%)",
        borderBottom: "1px solid rgba(0,0,0,0.5)",
      }}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div
        className="terminal-body flex flex-col"
        style={{ height: "320px" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Output — above scanlines */}
        <div className="terminal-content flex-1 overflow-y-auto px-4 pt-3 pb-1">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.p
                key={line.id}
                initial={{ opacity: 0, x: -3 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[13px] leading-[1.65] whitespace-pre-wrap break-words"
                style={{ color: LINE_COLOR[line.type] }}
              >
                {line.content}
              </motion.p>
            ))}
          </AnimatePresence>

          {thinking && (
            <p className="font-mono text-[13px]" style={{ color: LINE_COLOR.engine }}>
              {PROMPT}{" "}
              <span style={{ color: "rgba(255,184,0,0.5)" }}>processing</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                _
              </motion.span>
            </p>
          )}
          <div ref={endRef} />
        </div>

        {/* Input row */}
        <div
          className="terminal-content border-t flex items-center gap-2 px-4 py-2.5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span className="font-mono text-[13px] shrink-0" style={{ color: "rgba(255,255,255,0.5)" }}>
            {PROMPT}
          </span>
          <form onSubmit={handleSubmit} className="flex-1 flex relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!ready || thinking}
              className="flex-1 bg-transparent font-mono text-[13px] text-white outline-none disabled:opacity-30"
              style={{ caretColor: "transparent" }}
              placeholder=""
              autoComplete="off"
              spellCheck={false}
            />
            {ready && !thinking && (
              <span className="cursor-blink" aria-hidden />
            )}
          </form>
        </div>
      </div>
    </Window>
  );
}
