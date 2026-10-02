import { Geist_Mono } from "next/font/google";

// headline and body use the local Times New Roman stack, see globals.css
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const fontVariables = geistMono.variable;
