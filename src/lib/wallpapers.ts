export interface Wallpaper {
  id: string;
  label: string;
  gradient: string;
  webImage?: string;
  mobileImage?: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "duck",
    label: "Duck",
    gradient: "",
    webImage: "/wallpapers/web/duck.jpg",
    mobileImage: "/wallpapers/mobile/duck mobile.jpg",
  },
  {
    id: "starfield",
    label: "Starfield",
    gradient: "",
    webImage: "/wallpapers/web/Starfield I Mac.jpg",
    mobileImage: "/wallpapers/mobile/Starfield I iPhone.jpg",
  },
  {
    id: "tulip",
    label: "Tulip",
    gradient: "",
    webImage: "/wallpapers/web/Tulip Mac.jpg",
    mobileImage: "/wallpapers/mobile/Tulip iPhone.jpg",
  },
  {
    id: "waterway",
    label: "Waterway",
    gradient: "",
    webImage: "/wallpapers/web/Waterway 1 Mac.jpg",
    mobileImage: "/wallpapers/mobile/Waterway1 iPhone.jpg",
  },
];

export const DEFAULT_WALLPAPER_ID = "duck";
