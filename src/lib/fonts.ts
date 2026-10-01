import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

export const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const fontVariables = [geist, geistMono, instrumentSerif].map((f) => f.variable).join(" ");
