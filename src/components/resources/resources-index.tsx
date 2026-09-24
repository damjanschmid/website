"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useMemo, useState } from "react";
import type { Resource } from "@content/resources";
import { ArrowUpRightIcon } from "@/components/icons";
import { Bookshelf } from "./bookshelf";

const plural: Record<string, string> = { Person: "People", Inspiration: "Inspiration" };
const label = (type: string) => plural[type] ?? `${type}s`;

export function ResourcesIndex({ resources }: { resources: Resource[] }) {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState<Resource | null>(null);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    resources.forEach((r) => counts.set(r.type, (counts.get(r.type) ?? 0) + 1));
    return [["All", resources.length] as const, ...counts.entries()];
  }, [resources]);

  const list = filter === "All" ? resources : resources.filter((r) => r.type === filter);
  const books = resources.filter((r) => r.type === "Book");
  const showShelf = filter === "All" || filter === "Book";

  // the preview card follows the cursor, a little lazily
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 350, damping: 35 });
  const y = useSpring(my, { stiffness: 350, damping: 35 });

  return (
    <div onPointerMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }}>
      {/* filters */}
      <div role="tablist" aria-label="Filter" className="no-scrollbar flex gap-6 overflow-x-auto border-b border-fg pb-0 sm:gap-8">
        {types.map(([type, count], i) => {
          const active = filter === type;
          return (
            <button
              key={type}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(type)}
              className={`relative shrink-0 cursor-pointer pb-3 text-left transition-colors duration-200 ${active ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              <span className="mr-1.5 font-mono text-[11px] tabular-nums opacity-60">{String(i).padStart(2, "0")}</span>
              <span className="text-[15px] font-medium tracking-tight">{type === "All" ? "All" : label(type)}</span>
              <sup className="ml-0.5 text-[10px] text-accent">{count}</sup>
              {active && (
                <motion.span layoutId="resource-tab" className="absolute inset-x-0 -bottom-px h-[3px] bg-accent" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {showShelf && books.length > 0 && (
          <motion.section
            key="shelf"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pt-12 pb-4 md:grid-cols-12">
              <div className="md:col-span-3">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em]">On the shelf</h2>
                <p className="mt-2 max-w-[220px] text-[14px] leading-snug text-muted">Books that changed how I see things. Pull one out.</p>
              </div>
              <div className="md:col-span-9">
                <Bookshelf books={books} />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* list */}
      <div className="mt-12">
        <div className="hidden grid-cols-12 gap-4 border-b border-fg/80 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted md:grid">
          <span className="col-span-1">Nº</span>
          <span className="col-span-5">Title</span>
          <span className="col-span-3">By</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-1 text-right">Year</span>
        </div>
        <ul onMouseLeave={() => setHovered(null)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((r, i) => (
              <motion.li
                layout
                key={r.url}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.35, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
              >
                <Row resource={r} index={resources.indexOf(r) + 1} onHover={() => setHovered(r)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* floating preview */}
      <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(pointer:fine)]:block" style={{ x, y }}>
        <AnimatePresence>
          {hovered?.note && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="ml-6 mt-6 w-[260px] origin-top-left bg-fg p-4 text-bg shadow-2xl"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={hovered.url} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                  <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                    <span>{hovered.type}</span>
                    <span className="text-bg/50">{new URL(hovered.url).hostname.replace("www.", "")}</span>
                  </div>
                  <p className="text-[14px] leading-snug">{hovered.note}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Row({ resource: r, index, onHover }: { resource: Resource; index: number; onHover: () => void }) {
  return (
    <motion.a
      href={r.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onHover}
      onFocus={onHover}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-0.5 border-b border-line py-3.5 outline-none md:py-4"
    >
      {/* the colour wipe */}
      <motion.span
        aria-hidden
        className="absolute inset-y-0 -inset-x-3 origin-left bg-accent"
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ type: "spring", stiffness: 420, damping: 40 }}
      />
      <span className="relative col-span-2 font-mono text-[12px] tabular-nums text-muted transition-colors duration-150 group-hover:text-bg md:col-span-1">
        {String(index).padStart(3, "0")}
      </span>
      <span className="relative col-span-10 text-[17px] font-medium leading-tight tracking-tight transition-colors duration-150 group-hover:text-bg md:col-span-5 md:text-[19px]">
        {r.title}
      </span>
      <span className="relative col-span-10 col-start-3 text-[14px] text-muted transition-colors duration-150 group-hover:text-bg/80 md:col-span-3 md:col-start-auto">
        {r.by ?? "–"}
      </span>
      <span className="relative hidden text-[14px] text-muted transition-colors duration-150 group-hover:text-bg/80 md:col-span-2 md:block">{r.type}</span>
      <span className="relative col-span-1 hidden items-center justify-end gap-2 text-[14px] tabular-nums text-muted transition-colors duration-150 group-hover:text-bg md:flex">
        {r.year ?? ""}
        <ArrowUpRightIcon size={14} />
      </span>
    </motion.a>
  );
}
