export interface RoastOutput {
  score: number;
  headline: string;
  whatsBroken: string[];
  whatsRedeemable: string;
  verdict: string;
}

export interface RoastData extends RoastOutput {
  brandName: string;
}
