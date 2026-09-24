"use client";

import { motion } from "motion/react";

// Letters cut out of different magazines. You can move them around.
const cutouts = [
  { bg: "#1d1b18", fg: "#f2eee6", font: "font-serif italic", rotate: -8 },
  { bg: "#e2542b", fg: "#fff", font: "font-grotesk font-black", rotate: 5 },
  { bg: "#fbe38a", fg: "#1d1b18", font: "font-type", rotate: -3 },
  { bg: "#2f5bd3", fg: "#fff", font: "font-mono font-bold", rotate: 7 },
  { bg: "#fdfcf8", fg: "#e2542b", font: "font-serif", rotate: -5 },
];

export function RansomNote({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-label={text}>
      {text.split("").map((char, i) => {
        const c = cutouts[i % cutouts.length];
        return (
          <motion.span
            key={i}
            aria-hidden
            drag
            dragSnapToOrigin
            dragElastic={0.4}
            initial={{ opacity: 0, y: -60, rotate: c.rotate * 3, scale: 1.4 }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate, scale: 1 }}
            whileHover={{ scale: 1.08, rotate: c.rotate * -0.6 }}
            whileDrag={{ scale: 1.15, rotate: 0, cursor: "grabbing" }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 + i * 0.12 }}
            className={`grid h-[1.25em] min-w-[0.95em] cursor-grab place-items-center px-3 text-[clamp(4rem,14vw,8rem)] leading-none shadow-[0_2px_3px_rgb(0_0_0/0.15),0_16px_24px_-14px_rgb(0_0_0/0.4)] select-none ${c.font}`}
            style={{ background: c.bg, color: c.fg, clipPath: "polygon(2% 4%, 97% 0, 100% 95%, 4% 100%)" }}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
}
