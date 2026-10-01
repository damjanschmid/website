"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * Keep swiping past the bottom and the page lifts like a rubber band,
 * revealing a sheet underneath. Pull far enough and it arms ("Let go"),
 * then everything snaps back down when you release.
 *
 * Touch only: on desktop the page behaves normally. The sheet's content
 * is a placeholder for now.
 */

const MAX = 280; // px the page can lift at most
const THRESHOLD = 150; // px of lift before it arms

// rubber band: easy at first, harder the further you pull
const rubber = (raw: number) => MAX * (1 - Math.exp(-raw / MAX));

export function PullUp({ children }: { children: React.ReactNode }) {
  const pull = useMotionValue(0);
  const raw = useRef(0);
  const [armed, setArmed] = useState(false);
  const armedRef = useRef(false);

  const pageY = useTransform(pull, (p) => -p);
  const sheetY = useTransform(pull, (p) => `calc(100% - ${p}px)`);
  const progress = useTransform(pull, [0, THRESHOLD], [0, 1], { clamp: true });
  const handleWidth = useTransform(pull, [0, THRESHOLD, MAX], [28, 44, 52]);

  useEffect(() => {
    let touchStart: number | null = null;

    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const setPull = (r: number) => {
      raw.current = Math.max(0, r);
      pull.stop();
      const p = rubber(raw.current);
      pull.set(p);
      const isArmed = p >= THRESHOLD;
      if (isArmed !== armedRef.current) {
        armedRef.current = isArmed;
        setArmed(isArmed);
        if (isArmed && navigator.userActivation?.hasBeenActive) navigator.vibrate?.(8);
      }
    };

    const release = () => {
      const wasArmed = armedRef.current;
      raw.current = 0;
      armedRef.current = false;
      setArmed(false);
      // a little bounce if you pulled all the way
      animate(pull, 0, { type: "spring", stiffness: 380, damping: wasArmed ? 22 : 34 });
    };

    const onTouchStart = (e: TouchEvent) => {
      // spinning the avatar or tapping the button shouldn't lift the page
      const onControl = (e.target as Element | null)?.closest("button, a");
      touchStart = atBottom() && !onControl ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStart === null) return;
      const dy = touchStart - e.touches[0].clientY; // finger moving up
      if (dy <= 0 && raw.current === 0) return;
      e.preventDefault();
      setPull(dy);
    };
    const onTouchEnd = () => {
      if (touchStart === null) return;
      touchStart = null;
      release();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [pull]);

  return (
    <>
      <motion.div className="relative min-h-dvh will-change-transform" style={{ y: pageY }}>
        {children}
      </motion.div>

      {/* the sheet that hides below the page */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex h-[300px] justify-center bg-[#f5f5f6] px-4 shadow-[inset_0_12px_18px_-14px_rgb(0_0_0/0.18)]"
        style={{ y: sheetY }}
      >
        <div className="flex w-full max-w-[520px] flex-col items-center pt-4">
          <motion.span className="h-[5px] rounded-full bg-black/15" style={{ width: handleWidth }} />

          <div className="mt-5 flex h-5 items-center gap-2 text-[13px] text-muted">
            <ProgressRing progress={progress} armed={armed} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={armed ? "go" : "pull"}
                initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
                transition={{ duration: 0.18 }}
                className={armed ? "text-fg" : undefined}
              >
                {armed ? "Let go" : "Keep pulling"}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* placeholder for whatever lives down here */}
          <motion.div
            className="mt-5 grid h-[150px] w-full place-items-center rounded-3xl border border-dashed border-black/15 bg-black/[0.02] font-mono text-[12px] text-muted"
            animate={{ scale: armed ? 1 : 0.96, opacity: armed ? 1 : 0.7 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            placeholder · something lives down here
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function ProgressRing({ progress, armed }: { progress: ReturnType<typeof useMotionValue<number>>; armed: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      animate={{ scale: armed ? [1, 1.35, 1] : 1 }}
      transition={{ duration: 0.35 }}
    >
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.6" />
      <motion.circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke={armed ? "var(--fg)" : "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ pathLength: progress, rotate: -90, originX: "50%", originY: "50%" }}
      />
    </motion.svg>
  );
}
