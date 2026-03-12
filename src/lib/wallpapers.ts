export interface Wallpaper {
  id: string;
  label: string;
  gradient: string;
  image?: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "duck",
    label: "Duck",
    gradient: "",
    image: "/wallpapers/duck.jpg",
  },
  {
    id: "sonoma",
    label: "Sonoma",
    gradient:
      "linear-gradient(160deg, #1a0533 0%, #3d1a6e 35%, #7b3fa0 65%, #c97b4b 100%)",
  },
  {
    id: "sequoia",
    label: "Sequoia",
    gradient:
      "linear-gradient(160deg, #0d2b12 0%, #1e5c28 40%, #3d9e52 70%, #a8d97c 100%)",
  },
  {
    id: "bigsur",
    label: "Big Sur",
    gradient:
      "linear-gradient(180deg, #0a2a4a 0%, #1a5276 40%, #2e86c1 75%, #85c1e9 100%)",
  },
  {
    id: "ventura",
    label: "Ventura Night",
    gradient:
      "linear-gradient(155deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  },
  {
    id: "pure-white",
    label: "Pure White",
    gradient: "#FFFFFF",
  },
  {
    id: "warm-gray",
    label: "Warm Gray",
    gradient:
      "radial-gradient(ellipse at 50% 30%, #FFF8F4 0%, #FFFFFF 55%, #F0ECE8 100%)",
  },
  {
    id: "deep-navy",
    label: "Deep Navy",
    gradient:
      "linear-gradient(160deg, #0a0e1a 0%, #0d1b2a 50%, #1a2744 100%)",
  },
  {
    id: "soft-black",
    label: "Soft Black",
    gradient:
      "linear-gradient(160deg, #111111 0%, #1a1a1a 100%)",
  },
];

export const DEFAULT_WALLPAPER_ID = "duck";
