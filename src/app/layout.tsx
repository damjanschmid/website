import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { Dock } from "@/components/dock";
import { EasterEggs } from "@/components/easter-eggs";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#f2eee6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        <Providers>
          {children}
          <Dock />
          <EasterEggs />
        </Providers>
      </body>
    </html>
  );
}
