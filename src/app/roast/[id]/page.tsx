import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SharePageClient from "./SharePageClient";

interface StoredRoast {
  score: number;
  categoryScores: { logo: number; typography: number; color: number; voice: number; consistency: number };
  headline: string;
  whatsBroken: string[];
  whatsRedeemable: string;
  verdict: string;
  brandName: string;
  createdAt: string;
  receiptId: string;
  date: string;
  time: string;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const data = await kv.get<StoredRoast>(`roast:${id}`);
    if (!data) return { title: "Roast Not Found — RoastMyBrand.wtf" };
    return {
      title: `${data.brandName} got roasted ${data.score}/10 — RoastMyBrand.wtf`,
      description: data.headline,
      openGraph: {
        title: `${data.brandName}: ${data.score}/10`,
        description: data.headline,
        url: `https://roastmybrand.wtf/roast/${id}`,
      },
      twitter: { card: "summary", title: `${data.brandName}: ${data.score}/10`, description: data.headline },
    };
  } catch {
    return { title: "RoastMyBrand.wtf" };
  }
}

export default async function RoastSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let data: StoredRoast | null = null;
  try {
    data = await kv.get<StoredRoast>(`roast:${id}`);
  } catch {
    notFound();
  }

  if (!data) notFound();

  return <SharePageClient data={data} id={id} />;
}
