import type { Metadata } from "next";
import { canvasItems } from "@content/canvas";
import { InfiniteCanvas } from "@/components/canvas/infinite-canvas";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Everything else",
  description: "Projects, pictures and random stuff on an infinite canvas.",
};

export default function ElsePage() {
  return (
    <main data-theme="graphite" className="fixed inset-0 overflow-hidden">
      <InfiniteCanvas items={canvasItems} />

      <Reveal className="pointer-events-none absolute top-5 left-5 z-10 sm:top-6 sm:left-6">
        <h1 className="font-serif text-[40px] leading-none tracking-[-0.01em] text-fg sm:text-[52px]">
          Everything <em className="text-accent">else</em>
        </h1>
        <p className="mt-2 max-w-[260px] font-pixel text-[11px] leading-relaxed text-muted">
          Projects, pictures and random stuff. Drag to look around, pinch or ⌘+scroll to zoom.
        </p>
      </Reveal>
    </main>
  );
}
