import {
  Geist,
  Geist_Mono,
  Geist_Pixel,
  Instrument_Serif,
  Inter_Tight,
  Newsreader,
  Reenie_Beanie,
  Special_Elite,
} from "next/font/google";

// Used everywhere
export const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Page-specific. Not preloaded so each page only pays for what it uses.
export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false,
});
export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  preload: false,
});
export const reenie = Reenie_Beanie({
  variable: "--font-reenie",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
export const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
export const geistPixel = Geist_Pixel({
  variable: "--font-geist-pixel",
  subsets: ["latin"],
  preload: false,
});

export const fontVariables = [
  geist,
  geistMono,
  instrumentSerif,
  newsreader,
  interTight,
  reenie,
  specialElite,
  geistPixel,
]
  .map((f) => f.variable)
  .join(" ");
