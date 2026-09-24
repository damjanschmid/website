"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * Little secrets, site-wide.
 *
 *  - The Konami code (↑ ↑ ↓ ↓ ← → ← → B A) throws a sticker party.
 *  - Typing "damjan" anywhere makes the homepage greeting notice.
 *  - Leave the tab and the title calls you back.
 *  - Open the console.
 *
 * Other components can trigger the sticker burst with celebrate().
 */

const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
const NAME = "damjan";

export function celebrate(message?: string) {
  window.dispatchEvent(new CustomEvent("easter:celebrate", { detail: { message } }));
}

type Sticker = { id: number; kind: number; x: number; dx: number; peak: number; rotate: number; size: number; hue: string; delay: number };

const colors = ["#e2542b", "#f4c542", "#3a7d5c", "#2f5bd3", "#f29bb8", "#1d1b18", "#ff3d00", "#c8f560"];

export function EasterEggs() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const keys = useRef<string[]>([]);
  const typed = useRef("");
  const nextId = useRef(0);

  useEffect(() => {
    console.log(
      "%c hi there %c\n\nYou opened the console, so you're my kind of person.\nThe source is on GitHub: github.com/damjanschmid/website\nTry the Konami code somewhere.",
      "background:#1d1b18;color:#f2eee6;font:600 14px/2 ui-serif,Georgia,serif;padding:2px 10px;border-radius:6px",
      "font:12px/1.5 ui-monospace,monospace;color:#7a746a",
    );
  }, []);

  useEffect(() => {
    let toastTimer: ReturnType<typeof setTimeout>;

    function burst(message?: string) {
      const w = window.innerWidth;
      const batch: Sticker[] = Array.from({ length: 34 }, (_, i) => ({
        id: nextId.current++,
        kind: Math.floor(Math.random() * 6),
        x: w / 2 + (Math.random() - 0.5) * 120,
        dx: (Math.random() - 0.5) * w * 0.9,
        peak: -(window.innerHeight * (0.35 + Math.random() * 0.4)),
        rotate: (Math.random() - 0.5) * 720,
        size: 22 + Math.random() * 26,
        hue: colors[i % colors.length],
        delay: Math.random() * 0.15,
      }));
      setStickers((s) => [...s, ...batch]);
      setTimeout(() => setStickers((s) => s.filter((x) => !batch.includes(x))), 2600);
      if (message) {
        setToast(message);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => setToast(null), 3200);
      }
    }

    const onCelebrate = (e: Event) => burst((e as CustomEvent<{ message?: string }>).detail?.message);

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      const key = e.key.toLowerCase();

      keys.current = [...keys.current, key].slice(-KONAMI.length);
      if (keys.current.join() === KONAMI.join()) {
        keys.current = [];
        burst("Cheat code accepted. Everything is a party now.");
        window.dispatchEvent(new CustomEvent("easter:party"));
      }

      if (key.length === 1) {
        typed.current = (typed.current + key).slice(-NAME.length);
        if (typed.current === NAME) {
          typed.current = "";
          window.dispatchEvent(new CustomEvent("easter:name"));
          burst();
        }
      }
    };

    let title = document.title;
    const onVisibility = () => {
      if (document.hidden) {
        title = document.title;
        document.title = "Psst, come back";
      } else {
        document.title = title;
      }
    };

    window.addEventListener("easter:celebrate", onCelebrate);
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("easter:celebrate", onCelebrate);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(toastTimer);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        {stickers.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: s.x, top: "100%", color: s.hue, width: s.size, height: s.size }}
            initial={{ x: 0, y: 0, rotate: 0, scale: 0.4 }}
            animate={{
              x: [0, s.dx * 0.6, s.dx],
              y: [0, s.peak, 60],
              rotate: s.rotate,
              scale: [0.4, 1, 1],
            }}
            transition={{ duration: 2.3, delay: s.delay, ease: [0.2, 0.7, 0.4, 1], times: [0, 0.45, 1] }}
          >
            <StickerShape kind={s.kind} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.95, filter: "blur(6px)" }}
            className="fixed top-5 left-1/2 z-[101] -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-medium shadow-xl"
            style={{ background: "var(--dock-bg)", color: "var(--dock-fg)", boxShadow: "0 0 0 1px var(--dock-line), 0 12px 30px -10px rgb(0 0 0 / .4)" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StickerShape({ kind }: { kind: number }) {
  const common = { width: "100%", height: "100%", viewBox: "0 0 24 24" };
  switch (kind) {
    case 0: // star
      return (
        <svg {...common}>
          <path fill="currentColor" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" />
        </svg>
      );
    case 1: // heart
      return (
        <svg {...common}>
          <path fill="currentColor" stroke="#fff" strokeWidth="1.4" d="M12 20.5s-8-4.6-8-10.6A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 8 2.7c0 6-8 10.6-8 10.6z" />
        </svg>
      );
    case 2: // swiss cross
      return (
        <svg {...common}>
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#e2231a" stroke="#fff" strokeWidth="1.4" />
          <path fill="#fff" d="M10 6h4v4h4v4h-4v4h-4v-4H6v-4h4z" />
        </svg>
      );
    case 3: // smiley
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" fill="#f4c542" stroke="#fff" strokeWidth="1.4" />
          <circle cx="9" cy="10" r="1.2" fill="#1d1b18" />
          <circle cx="15" cy="10" r="1.2" fill="#1d1b18" />
          <path d="M8 14c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4" fill="none" stroke="#1d1b18" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 4: // squiggle
      return (
        <svg {...common}>
          <path d="M2 14c2.5-5 4.5-5 6 0s3.5 5 6 0 3.5-5 6 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default: // dot
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" fill="currentColor" stroke="#fff" strokeWidth="1.4" />
        </svg>
      );
  }
}
