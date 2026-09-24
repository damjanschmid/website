import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { BackLink } from "@/components/back-link";
import { ReadingProgress } from "@/components/notes/reading-progress";
import { Reveal } from "@/components/reveal";
import { formatDate, getNote, getNotes } from "@/lib/notes";

export function generateStaticParams() {
  return getNotes().map((n) => ({ slug: n.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  return note ? { title: note.title, description: note.description } : {};
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const { default: Content } = await import(`@content/notes/${slug}.mdx`);

  const notes = getNotes();
  const index = notes.findIndex((n) => n.slug === slug);
  const newer = notes[index - 1];
  const older = notes[index + 1];

  return (
    <main
      data-theme="ink"
      className="min-h-dvh px-6 pt-20 pb-40 sm:px-10 sm:pt-28"
      style={note.accent ? ({ "--accent": note.accent } as React.CSSProperties) : undefined}
    >
      <ReadingProgress />
      <article className="mx-auto max-w-[640px]">
        <Reveal y={0}>
          <BackLink href="/notes">Notes</BackLink>
        </Reveal>

        <header className="mt-12 mb-12">
          <Reveal delay={0.05} className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-muted">
            <span className="text-accent">{note.category}</span>
            <span className="opacity-40">/</span>
            <time dateTime={note.date}>{formatDate(note.date)}</time>
            <span className="opacity-40">/</span>
            <span>{note.readingMinutes} min read</span>
          </Reveal>
          <ViewTransition name={`note-title-${note.slug}`}>
            <h1 className="font-serif text-[clamp(2.6rem,6vw,3.75rem)] leading-[1.02] tracking-[-0.015em] text-fg">{note.title}</h1>
          </ViewTransition>
          {note.description && (
            <Reveal delay={0.15}>
              <p className="mt-5 text-[18px] leading-relaxed text-muted">{note.description}</p>
            </Reveal>
          )}
        </header>

        <Reveal delay={0.25}>
          <div className="font-reading text-[19px] leading-[1.72] text-fg/85 [font-optical-sizing:auto]">
            <Content />
          </div>
        </Reveal>

        <footer className="mt-20 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {older ? <NoteLink note={older} label="Older" /> : <span />}
          {newer && <NoteLink note={newer} label="Newer" align="right" />}
        </footer>
      </article>
    </main>
  );
}

function NoteLink({ note, label, align = "left" }: { note: { slug: string; title: string }; label: string; align?: "left" | "right" }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className={`group rounded-xl p-4 transition-colors duration-300 hover:bg-fg/[0.045] ${align === "right" ? "sm:text-right" : ""}`}
    >
      <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">{label}</span>
      <span className="mt-1 block font-serif text-[1.3rem] leading-snug text-fg">{note.title}</span>
    </Link>
  );
}
