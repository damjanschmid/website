"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ViewTransition, useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

type Note = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  description?: string;
  category: string;
  draft: boolean;
  readingMinutes: number;
};

const MotionLink = motion.create(Link);

export function NotesIndex({ notes }: { notes: Note[] }) {
  const [category, setCategory] = useState<string>("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    notes.forEach((n) => counts.set(n.category, (counts.get(n.category) ?? 0) + 1));
    return [["All", notes.length] as const, ...[...counts.entries()].sort((a, b) => b[1] - a[1])];
  }, [notes]);

  const filtered = category === "All" ? notes : notes.filter((n) => n.category === category);
  const byYear = useMemo(() => {
    const groups = new Map<string, Note[]>();
    filtered.forEach((n) => {
      const y = n.date.slice(0, 4);
      groups.set(y, [...(groups.get(y) ?? []), n]);
    });
    return [...groups.entries()];
  }, [filtered]);

  return (
    <div>
      <div role="tablist" aria-label="Categories" className="no-scrollbar -mx-1 mb-12 flex gap-1 overflow-x-auto px-1">
        {categories.map(([name, count]) => {
          const active = category === name;
          return (
            <button
              key={name}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(name)}
              className={`relative shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${active ? "text-bg" : "text-muted hover:text-fg"}`}
            >
              {active && (
                <motion.span
                  layoutId="note-category"
                  className="absolute inset-0 rounded-full bg-fg"
                  transition={{ type: "spring", stiffness: 480, damping: 36 }}
                />
              )}
              <span className="relative">
                {name}
                <sup className="ml-1 text-[10px] opacity-60">{count}</sup>
              </span>
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <div onMouseLeave={() => setHovered(null)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {byYear.map(([year, list]) => (
              <motion.section
                layout
                key={year}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
                className="grid gap-2 border-t border-line pt-5 pb-8 sm:grid-cols-[88px_1fr] sm:gap-6"
              >
                <h2 className="font-mono text-[12px] text-muted sm:sticky sm:top-8 sm:self-start sm:pt-3">{year}</h2>
                <ul className="-mx-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {list.map((note, i) => (
                      <motion.li
                        layout
                        key={note.slug}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <MotionLink
                          href={`/notes/${note.slug}`}
                          onMouseEnter={() => setHovered(note.slug)}
                          onFocus={() => setHovered(note.slug)}
                          initial="rest"
                          animate="rest"
                          whileHover="hover"
                          className="group relative flex items-start justify-between gap-6 rounded-xl px-4 py-3 outline-none"
                        >
                          {hovered === note.slug && (
                            <motion.span
                              layoutId="note-hover"
                              className="absolute inset-0 rounded-xl bg-fg/[0.045]"
                              transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            />
                          )}
                          <span className="relative min-w-0">
                            <span className="flex items-center gap-2">
                              <ViewTransition name={`note-title-${note.slug}`}>
                                <span className="font-serif text-[1.45rem] leading-snug tracking-[-0.005em] text-fg">{note.title}</span>
                              </ViewTransition>
                              {note.draft && (
                                <span className="rounded-full border border-accent/40 px-1.5 py-px font-mono text-[10px] uppercase tracking-wider text-accent">
                                  draft
                                </span>
                              )}
                            </span>
                            {note.description && <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">{note.description}</span>}
                          </span>
                          <span className="relative flex shrink-0 items-center gap-3 pt-2 font-mono text-[12px] text-muted">
                            <span className="hidden sm:inline">{note.category}</span>
                            <span className="tabular-nums">{note.dateLabel}</span>
                            <span className="text-fg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <ArrowRightIcon size={14} />
                            </span>
                          </span>
                        </MotionLink>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
