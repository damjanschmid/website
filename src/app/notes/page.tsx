import type { Metadata } from "next";
import { NotesIndex } from "@/components/notes/notes-index";
import { Reveal } from "@/components/reveal";
import { formatDate, getNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Things I've been thinking about.",
};

export default function NotesPage() {
  const notes = getNotes().map((n) => ({ ...n, dateLabel: formatDate(n.date, "short") }));

  return (
    <main data-theme="ink" className="min-h-dvh px-6 pt-24 pb-40 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-[760px]">
        <Reveal>
          <h1 className="font-serif text-[clamp(3.5rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em]">
            Notes<span className="text-accent">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 mb-14 max-w-md text-[16px] leading-relaxed text-muted">
            Things I&apos;ve been thinking about, written down so I can stop thinking about them.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <NotesIndex notes={notes} />
        </Reveal>
      </div>
    </main>
  );
}
