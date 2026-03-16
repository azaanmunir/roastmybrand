"use client";

import { useState, useRef } from "react";

const FOLDER_NORMAL = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 564.77 442.19" width="64" height="64">
    <path fill="#19c0fc" d="M535.64,95.99h-216.7c-10.16,0-19.95-3.79-27.45-10.63L209.43,10.63c-7.51-6.84-17.3-10.63-27.45-10.63H29.13C13.04,0,0,13.04,0,29.13v383.94c0,16.09,13.04,29.13,29.13,29.13h506.51c16.09,0,29.13-13.04,29.13-29.13V125.12c0-16.09-13.04-29.13-29.13-29.13Z"/>
  </svg>
);

const FOLDER_HOVER = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568.46 473.95" width="64" height="64">
    <path fill="#18a2ef" d="M509.9,43.05h-234.76c-5.64,0-11.14-1.72-15.77-4.93L211.49,4.93c-4.63-3.21-10.14-4.93-15.77-4.93H58.56c-15.29,0-27.69,12.4-27.69,27.69v114.27h506.72v-71.22c0-15.29-12.4-27.69-27.69-27.69Z"/>
    <path fill="#19c0fc" d="M517.34,473.95H51.12c-18.04,0-32.96-14.04-34.05-32.05L.06,160.71c-1.19-19.61,14.4-36.17,34.05-36.17h500.24c19.65,0,35.23,16.56,34.05,36.17l-17.01,281.2c-1.09,18.01-16.01,32.05-34.05,32.05Z"/>
  </svg>
);

interface Props {
  label: string;
  onClick: () => void;
  position: { x: number; y: number };
}

export default function DesktopFolder({ label, onClick, position }: Props) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const lastClick = useRef(0);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick.current < 400) {
      // double-click
      onClick();
      setSelected(false);
    } else {
      setSelected(true);
    }
    lastClick.current = now;
  };

  return (
    <div
      style={{ position: "absolute", left: position.x, top: position.y, width: 80, cursor: "pointer", userSelect: "none" }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background highlight when selected */}
      <div
        style={{
          position: "absolute", inset: 0,
          borderRadius: 8,
          background: selected ? "rgba(0,100,255,0.2)" : "transparent",
          transition: "background 0.15s ease",
        }}
      />

      {/* Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.15s ease",
        }}
      >
        {hovered ? FOLDER_HOVER : FOLDER_NORMAL}
      </div>

      {/* Label */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <span
          style={{
            fontFamily: "var(--font-sans, system-ui)",
            fontSize: 12,
            lineHeight: "1.3",
            textAlign: "center",
            color: "white",
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            background: selected ? "#0066CC" : "transparent",
            borderRadius: 3,
            padding: selected ? "1px 4px" : "1px 4px",
            transition: "all 0.15s ease",
            display: "inline-block",
            maxWidth: 76,
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
