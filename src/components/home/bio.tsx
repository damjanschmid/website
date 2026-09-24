"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/*
 * Placeholder bio. Rewrite this in your own words.
 * "short" is what people see first, "long" is for the curious.
 */
const bio = {
  short: (
    <>
      <p>
        I&apos;m Damjan. I like making things that feel good to use, and I collect a lot along the way:
        links, books, songs, photos, half-finished ideas.
      </p>
      <p>This is where they end up.</p>
    </>
  ),
  long: (
    <>
      <p>
        I&apos;m Damjan. I like making things that feel good to use, and I collect a lot along the way:
        links, books, songs, photos, half-finished ideas.
      </p>
      <p>
        Some of it gets written down in <Link href="/notes">notes</Link>. The things that shaped how I think are
        filed under <Link href="/resources">resources</Link>. Everything else lives on{" "}
        <Link href="/else">a big canvas</Link> you can wander around.
      </p>
      <p>
        Every page looks a bit different. That&apos;s on purpose. People aren&apos;t consistent either, and I
        think that&apos;s the nice part.
      </p>
    </>
  ),
};

type Mode = keyof typeof bio;

export function Bio() {
  const [mode, setMode] = useState<Mode>("short");

  return (
    <div>
      <div role="tablist" aria-label="Bio length" className="mb-5 inline-flex items-center gap-1 rounded-full bg-fg/[0.06] p-1 text-[13px]">
        {(Object.keys(bio) as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`relative cursor-pointer rounded-full px-3 py-1 capitalize transition-colors duration-300 ${mode === m ? "text-fg" : "text-muted hover:text-fg"}`}
          >
            {mode === m && (
              <motion.span
                layoutId="bio-pill"
                className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)]"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            <span className="relative">{m}</span>
          </button>
        ))}
      </div>

      <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 34 }} className="overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(6px)", y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[34rem] space-y-4 text-[17px] leading-[1.6] text-fg/80 [&_a]:text-fg [&_a]:underline [&_a]:decoration-fg/25 [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a:hover]:decoration-accent"
          >
            {bio[mode]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
