import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Courier_Prime } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-courier-prime",
});

export const metadata: Metadata = {
  title: "RoastMyBrand.wtf — Your brand deserves the truth",
  description:
    "Submit your brand. Find out what's actually wrong with it — no agency spin, no fluff, no mercy.",
  openGraph: {
    title: "RoastMyBrand.wtf — Your brand deserves the truth",
    description: "Find out what's actually wrong with your brand.",
    siteName: "RoastMyBrand.wtf",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastMyBrand.wtf",
    description: "Your brand is getting roasted.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${courierPrime.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
