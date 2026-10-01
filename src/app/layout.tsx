import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { fontVariables } from "@/lib/fonts";
import { signature } from "@/lib/signature";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <head>
        {/* React can't render a bare HTML comment, so it rides inside a noscript */}
        <noscript dangerouslySetInnerHTML={{ __html: signature }} />
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
