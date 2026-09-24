import type { Metadata } from "next";
import { resources } from "@content/resources";
import { ResourcesIndex } from "@/components/resources/resources-index";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Resources",
  description: "Articles, books, tools and people worth your time.",
};

export default function ResourcesPage() {
  return (
    <main data-theme="swiss" className="min-h-dvh px-5 pt-8 pb-40 font-grotesk sm:px-10">
      <div className="mx-auto max-w-[1280px]">
        {/* masthead */}
        <Reveal y={-8} className="grid grid-cols-2 gap-4 border-b border-fg pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] md:grid-cols-12">
          <span className="md:col-span-3">Index</span>
          <span className="hidden md:col-span-3 md:block">Things worth your time</span>
          <span className="hidden md:col-span-3 md:block">Updated {new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
          <span className="text-right md:col-span-3">{resources.length} entries</span>
        </Reveal>

        <div className="grid gap-6 pt-10 pb-14 md:grid-cols-12 md:pt-16 md:pb-20">
          <Reveal delay={0.05} className="md:col-span-9">
            <h1 className="text-[clamp(3.75rem,13vw,11.5rem)] font-bold leading-[0.82] tracking-[-0.055em]">
              Resources<span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15} className="self-end md:col-span-3">
            <p className="max-w-[300px] text-[16px] leading-snug">
              Links, books, tools and people that shaped how I think and what I make. Filed, more or less.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <ResourcesIndex resources={resources} />
        </Reveal>
      </div>
    </main>
  );
}
