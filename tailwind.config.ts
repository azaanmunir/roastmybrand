import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#0071E3",
        "macos-red": "#FF5F57",
        "macos-yellow": "#FEBC2E",
        "macos-green": "#28C840",
        "apple-green": "#34C759",
        "apple-red": "#FF3B30",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6B6B",
        "warm-white": "#FDFCFA",
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        // Apple system font stack — renders as SF Pro on macOS/iOS, Segoe UI on Windows
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "system-ui",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["var(--font-jetbrains-mono)", "SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)",
        window:
          "0 40px 80px rgba(0,0,0,0.14), 0 12px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        "button-accent":
          "0 4px 16px rgba(0,113,227,0.35), 0 1px 4px rgba(0,113,227,0.2)",
        "button-accent-hover":
          "0 8px 28px rgba(0,113,227,0.4), 0 2px 8px rgba(0,113,227,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
