"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * My profile picture, but you can spin it like a fidget spinner.
 * Grab and twist it, flick it, or just click for a spin.
 * Placeholder until there's a real photo: pass `src` to use one.
 */

const MAX_SPEED = 3600; // deg/s
const HALF_LIFE = 700; // ms for the spin to lose half its speed

export function AvatarSpinner({ src, alt = "", initials = "DS" }: { src?: string; alt?: string; initials?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  // fall back to the placeholder until the photo exists
  const [broken, setBroken] = useState(false);
  // the error can fire before hydration, so check once on mount too
  const checkImage = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) setBroken(true);
  };
  const rotate = useMotionValue(0);
  const speed = useMotionValue(0); // deg/s, signed
  const rpm = useTransform(speed, (v) => Math.round(Math.abs(v) / 6));
  const readout = useTransform(speed, [-120, -30, 30, 120], [1, 0, 0, 1]);
  const lift = useTransform(speed, [-MAX_SPEED, 0, MAX_SPEED], [1.06, 1, 1.06]);

  const drag = useRef<{ x: number; y: number; time: number; dir: { x: number; y: number }; moved: boolean } | null>(null);
  const frame = useRef<number>(0);

  // free spin with friction
  function spin() {
    cancelAnimationFrame(frame.current);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const v = speed.get() * Math.pow(0.5, dt / HALF_LIFE);
      speed.set(Math.abs(v) < 4 ? 0 : v);
      rotate.set(rotate.get() + (v * dt) / 1000);
      if (speed.get() !== 0) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function centerOf() {
    const r = ref.current!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, radius: r.width / 2 };
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(frame.current);
    const c = centerOf();
    const dx = e.clientX - c.x;
    const dy = e.clientY - c.y;
    const len = Math.hypot(dx, dy) || 1;
    drag.current = { x: e.clientX, y: e.clientY, time: performance.now(), dir: { x: dx / len, y: dy / len }, moved: false };
  }

  /*
   * Spin by how far the pointer moves along the edge of the circle.
   * Near the avatar the edge direction follows the pointer, so twisting
   * works. Once you drag past it, the last direction sticks, so a long
   * straight swipe keeps spinning instead of fading out.
   */
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const c = centerOf();
    const rx = e.clientX - c.x;
    const ry = e.clientY - c.y;
    const dist = Math.hypot(rx, ry);
    const dir = dist > 4 && dist < c.radius * 1.6 ? { x: rx / dist, y: ry / dist } : d.dir;
    const mx = e.clientX - d.x;
    const my = e.clientY - d.y;
    const along = dir.x * my - dir.y * mx; // movement along the edge, in px
    const delta = (along / Math.max(c.radius * 0.6, Math.min(dist, c.radius))) * (180 / Math.PI);
    const dt = Math.max(now - d.time, 1);

    rotate.set(rotate.get() + delta);
    // smooth the speed a little so flicks feel right
    const instant = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (delta / dt) * 1000));
    speed.set(speed.get() * 0.6 + instant * 0.4);
    drag.current = { x: e.clientX, y: e.clientY, time: now, dir, moved: d.moved || Math.abs(delta) > 1 };
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // a click: give it a push in whatever direction it's already going
      const dir = speed.get() < 0 ? -1 : 1;
      speed.set(Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed.get() + dir * 1100)));
    } else if (performance.now() - d.time > 90) {
      // held still before letting go: no flick
      speed.set(0);
    }
    spin();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    speed.set(Math.min(MAX_SPEED, speed.get() + 1100));
    spin();
  }

  return (
    <div className="relative flex items-center gap-4">
      <motion.button
        ref={ref}
        type="button"
        aria-label="Profile picture. Spin it."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
        whileHover={{ scale: 1.04 }}
        className="relative size-16 cursor-grab touch-none rounded-full select-none active:cursor-grabbing"
      >
        <motion.span className="absolute inset-0 block" style={{ rotate, scale: lift }}>
          <span className="absolute inset-0 overflow-hidden rounded-full shadow-[0_1px_2px_rgb(0_0_0/0.15),0_10px_20px_-10px_rgb(0_0_0/0.45)] ring-[3px] ring-surface">
            {src && !broken ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={checkImage}
                src={src}
                alt={alt}
                draggable={false}
                onError={() => setBroken(true)}
                className="size-full object-cover"
              />
            ) : (
              <Placeholder initials={initials} />
            )}
          </span>
        </motion.span>
      </motion.button>

      <motion.span
        aria-hidden
        className="pointer-events-none font-mono text-[11px] tabular-nums text-muted"
        style={{ opacity: readout }}
      >
        <motion.span>{rpm}</motion.span> rpm
      </motion.span>
    </div>
  );
}

function Placeholder({ initials }: { initials: string }) {
  return (
    <span
      className="grid size-full place-items-center font-serif text-[26px] leading-none text-[#fff6ea]"
      style={{
        background:
          "radial-gradient(circle at 30% 25%, #f6c9a0 0%, transparent 55%), conic-gradient(from 200deg, #e2542b, #f09a6b, #c8573a, #7a3b2e, #e2542b)",
      }}
    >
      <span className="italic drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)]">{initials}</span>
    </span>
  );
}
