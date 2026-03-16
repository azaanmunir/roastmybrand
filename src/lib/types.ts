export interface CategoryScores {
  logo: number;
  typography: number;
  color: number;
  voice: number;
  consistency: number;
}

export interface RoastOutput {
  score: number;
  categoryScores: CategoryScores;
  headline: string;
  whatsBroken: string[];
  whatsRedeemable: string;
  verdict: string;
}

export interface RoastData extends RoastOutput {
  brandName: string;
}
