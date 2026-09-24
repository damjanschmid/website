"use client";

import { motion } from "motion/react";
import type { Resource } from "@content/resources";

function readableOn(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#0b0b0b" : "#fafaf8";
}

/* Book spines on a shelf. Hover pulls one out. */
export function Bookshelf({ books }: { books: Resource[] }) {
  return (
    <div className="relative">
      <div className="flex items-end gap-[3px] overflow-x-auto pt-8 pb-0 no-scrollbar">
        {books.map((book, i) => {
          const bg = book.color ?? "#0b0b0b";
          const fg = readableOn(bg);
          const height = Math.min(290, Math.max(180, book.title.length * 7 + 90)) + ((book.title.length * 7) % 3) * 8;
          const width = 38 + ((book.title.length * 3) % 4) * 6;
          return (
            <motion.a
              key={book.title}
              href={book.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${book.title} by ${book.by}`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -18, rotate: i % 2 ? 2 : -2 }}
              whileTap={{ y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0 }}
              style={{ height, width, background: bg, color: fg }}
              className="relative flex shrink-0 origin-bottom flex-col items-center justify-between rounded-[3px] px-1 py-3 shadow-[inset_-3px_0_0_rgb(0_0_0/0.12),inset_2px_0_0_rgb(255_255_255/0.18)] ring-1 ring-black/10"
            >
              <span className="h-px w-3/5 bg-current opacity-40" />
              <span
                className="line-clamp-1 font-grotesk text-[12px] font-semibold tracking-tight"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", maxHeight: height - 64 }}
              >
                {book.title}
              </span>
              <span className="font-grotesk text-[9px] font-medium uppercase opacity-70" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                {book.by?.split(" ").at(-1)}
              </span>
            </motion.a>
          );
        })}
        {/* a leaning bookend */}
        <div className="ml-2 h-[150px] w-[10px] shrink-0 origin-bottom-left rotate-[8deg] rounded-[2px] bg-accent" />
      </div>
      <div className="h-[6px] w-full bg-fg" />
      <div className="h-[10px] w-full bg-gradient-to-b from-fg/15 to-transparent" />
    </div>
  );
}
