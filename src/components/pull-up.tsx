"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MAX, PullTracker, THRESHOLD, rubber, unrubber } from "@/lib/pull-tracker";

/*
 * Keep swiping past the bottom and the page lifts, revealing a sheet
 * underneath. It starts out following your fingers and gets steadily heavier
 * the further you pull, but never stops moving. Pull far enough and it arms ("Let go"), then everything
 * springs back down when the last finger leaves, carrying your velocity.
 *
 * Any number of fingers can take part: the gesture is tracked incrementally
 * (see pull-tracker.ts), so a second finger can take over from the first.
 *
 * Touch only: on desktop the page behaves normally.
 */

const MAX_VELOCITY = 1500; // px/s, so a hard flick overshoots a little rather than launching the page

export function PullUp({ children }: { children: React.ReactNode }) {
  const pull = useMotionValue(0);
  const tracker = useRef(new PullTracker());
  const [armed, setArmed] = useState(false);
  const armedRef = useRef(false);

  const pageY = useTransform(pull, (p) => -p);
  const sheetY = useTransform(pull, (p) => `calc(100% - ${p}px)`);
  const progress = useTransform(pull, [0, THRESHOLD], [0, 1], { clamp: true });
  const handleWidth = useTransform(pull, [0, THRESHOLD, MAX], [28, 44, 52]);

  useEffect(() => {
    const t = tracker.current;

    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const setArmedState = (p: number) => {
      const isArmed = p >= THRESHOLD;
      if (isArmed !== armedRef.current) {
        armedRef.current = isArmed;
        setArmed(isArmed);
        if (isArmed && navigator.userActivation?.hasBeenActive) navigator.vibrate?.(8);
      }
    };

    const release = (now: number) => {
      const wasArmed = armedRef.current;
      armedRef.current = false;
      setArmed(false);
      // the fingers' speed, converted from raw travel to page lift, carries into the spring
      const slope = rubber(t.raw + 1) - rubber(t.raw);
      const velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, t.velocity(now) * slope));
      t.reset();
      animate(pull, 0, { type: "spring", stiffness: 380, damping: wasArmed ? 22 : 34, velocity });
    };

    const onTouchStart = (e: TouchEvent) => {
      for (const touch of Array.from(e.changedTouches)) {
        // spinning the avatar or tapping the button shouldn't lift the page
        if ((touch.target as Element | null)?.closest("button, a")) continue;
        if (!t.active) {
          if (!atBottom()) continue;
          // catch the page wherever it is, even mid-bounce
          pull.stop();
          t.reset(unrubber(pull.get()));
        }
        t.down(touch.identifier, touch.clientY, e.timeStamp);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!t.active) return;
      const before = t.raw;
      const raw = t.move(
        Array.from(e.changedTouches).map((touch) => ({ id: touch.identifier, y: touch.clientY })),
        e.timeStamp,
      );
      // not pulling and moving the other way: leave it to the browser
      if (raw === 0 && raw <= before) return;
      e.preventDefault();
      const p = rubber(raw);
      pull.set(p);
      setArmedState(p);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!t.active) return;
      let last = false;
      for (const touch of Array.from(e.changedTouches)) last = t.up(touch.identifier) || last;
      if (last) release(e.timeStamp);
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
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex h-[440px] justify-center bg-[#f5f5f6] px-4 shadow-[inset_0_12px_18px_-14px_rgb(0_0_0/0.18)]"
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

          {/* cats around the campfire: the reward for pulling */}
          <motion.div
            className="mt-6 w-full"
            animate={{ scale: armed ? 1 : 0.94, opacity: armed ? 1 : 0.6, y: armed ? 0 : 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Image
              src="/campfire.gif"
              alt="Cats around a campfire"
              width={498}
              height={131}
              unoptimized
              loading="eager"
              className="h-auto w-full"
            />
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
