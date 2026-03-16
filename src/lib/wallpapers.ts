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
    id: "starfield",
    label: "Starfield",
    gradient: "",
    image: "/wallpapers/Starfield I Mac.heic",
  },
  {
    id: "tulip",
    label: "Tulip",
    gradient: "",
    image: "/wallpapers/Tulip Mac.png",
  },
  {
    id: "waterway",
    label: "Waterway",
    gradient: "",
    image: "/wallpapers/Waterway 1 Mac.heic",
  },
];

export const DEFAULT_WALLPAPER_ID = "duck";
