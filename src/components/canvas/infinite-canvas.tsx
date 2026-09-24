"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CanvasItem } from "@content/canvas";
import { ItemView } from "./canvas-items";

/*
 * An infinite canvas.
 *
 * The camera is three motion values: x, y (screen offset of the world
 * origin) and z (zoom). World → screen is `screen = world * z + (x, y)`.
 * Nothing re-renders while you pan or zoom, it's all transforms.
 *
 *   drag the background  pan (with a little glide when you let go)
 *   scroll / trackpad    pan
 *   ctrl/⌘ + scroll      zoom towards the cursor (pinch on a trackpad)
 *   two fingers          pan + pinch zoom
 *   double click         zoom in
 *   arrows, + / -        pan and zoom
 *   0                    back to the start
 *   F                    fit everything
 */

const MIN_Z = 0.2;
const MAX_Z = 2.5;
const clampZ = (v: number) => Math.min(MAX_Z, Math.max(MIN_Z, v));
const camera: Transition = { type: "spring", stiffness: 70, damping: 18, mass: 1 };
// the minimap covers this part of the world
const WORLD = { x: -1600, y: -1100, w: 3200, h: 2200 };

type Pos = { x: number; y: number };

export function InfiniteCanvas({ items }: { items: CanvasItem[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(1);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [grabbing, setGrabbing] = useState(false);
  const [selected, setSelected] = useState<CanvasItem | null>(null);
  const pointers = useRef(new Map<number, Pos>());
  const pinch = useRef<{ dist: number; cx: number; cy: number } | null>(null);
  const top = useRef(items.length);

  const rect = () => viewport.current!.getBoundingClientRect();
  const stop = useCallback(() => {
    x.stop();
    y.stop();
    z.stop();
  }, [x, y, z]);

  const moveTo = useCallback(
    (tx: number, ty: number, tz: number, t: Transition = camera) => {
      stop();
      animate(x, tx, t);
      animate(y, ty, t);
      animate(z, tz, t);
    },
    [stop, x, y, z],
  );

  // zoom by `factor`, keeping the screen point (px, py) still
  const zoomAt = useCallback(
    (px: number, py: number, factor: number, animated = false) => {
      const cz = z.get();
      const nz = clampZ(cz * factor);
      const k = nz / cz;
      const tx = px - (px - x.get()) * k;
      const ty = py - (py - y.get()) * k;
      if (animated) moveTo(tx, ty, nz, { type: "spring", stiffness: 200, damping: 28 });
      else {
        x.set(tx);
        y.set(ty);
        z.set(nz);
      }
    },
    [moveTo, x, y, z],
  );

  const home = useCallback(() => {
    const r = rect();
    moveTo(r.width / 2, r.height / 2, r.width < 640 ? 0.6 : 0.9);
  }, [moveTo]);

  const fit = useCallback(() => {
    const r = rect();
    const visible = items.filter((i) => Math.abs(i.x) < 2000 && Math.abs(i.y) < 1400);
    const xs = visible.map((i) => i.x);
    const ys = visible.map((i) => i.y);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const nz = clampZ(Math.min(r.width / (maxX - minX + 500), r.height / (maxY - minY + 500)));
    moveTo(r.width / 2 - ((minX + maxX) / 2) * nz, r.height / 2 - ((minY + maxY) / 2) * nz, nz);
  }, [items, moveTo]);

  const flyTo = useCallback(
    (item: CanvasItem, pos: Pos) => {
      const r = rect();
      const nz = Math.max(1.15, Math.min(z.get(), 1.6));
      // leave room for the detail panel on wide screens
      const shift = item.kind === "project" && r.width > 900 ? -190 : 0;
      moveTo(r.width / 2 + shift - pos.x * nz, r.height / 2 - pos.y * nz, nz);
      setSelected(item);
    },
    [moveTo, z],
  );

  // start zoomed out a little, then let the camera settle on the middle
  useLayoutEffect(() => {
    const r = rect();
    const start = 0.55;
    const end = r.width < 640 ? 0.6 : 0.9;
    x.set(r.width / 2);
    y.set(r.height / 2);
    z.set(start);
    animate(z, end, { type: "spring", stiffness: 40, damping: 16, delay: 0.2 });
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(viewport.current!);
    return () => ro.disconnect();
  }, [x, y, z]);

  // wheel + safari gestures need non-passive listeners
  useEffect(() => {
    const el = viewport.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stop();
      const r = rect();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.012));
      } else {
        const k = e.deltaMode === 1 ? 16 : 1;
        x.set(x.get() - e.deltaX * k);
        y.set(y.get() - e.deltaY * k);
      }
    };
    let lastScale = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      lastScale = 1;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const g = e as Event & { scale: number; clientX: number; clientY: number };
      const r = rect();
      zoomAt(g.clientX - r.left, g.clientY - r.top, g.scale / lastScale);
      lastScale = g.scale;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
    };
  }, [stop, x, y, zoomAt]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      const r = rect();
      const step = 160;
      const pan = (dx: number, dy: number) => moveTo(x.get() + dx, y.get() + dy, z.get(), { type: "spring", stiffness: 200, damping: 30 });
      switch (e.key) {
        case "ArrowLeft":
          return pan(step, 0);
        case "ArrowRight":
          return pan(-step, 0);
        case "ArrowUp":
          return pan(0, step);
        case "ArrowDown":
          return pan(0, -step);
        case "+":
        case "=":
          return zoomAt(r.width / 2, r.height / 2, 1.4, true);
        case "-":
          return zoomAt(r.width / 2, r.height / 2, 1 / 1.4, true);
        case "0":
          return home();
        case "f":
        case "F":
          return fit();
        case "Escape":
          return setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fit, home, moveTo, x, y, z, zoomAt]);

  /* ----- panning with pointers ----- */

  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("[data-canvas-item], [data-canvas-ui]")) return;
    stop();
    setSelected(null);
    viewport.current!.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pinch.current = null;
    setGrabbing(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const prev = { ...p };
    p.x = e.clientX;
    p.y = e.clientY;

    if (pointers.current.size === 1) {
      x.set(x.get() + p.x - prev.x);
      y.set(y.get() + p.y - prev.y);
      return;
    }
    const [a, b] = [...pointers.current.values()];
    const r = rect();
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    const cx = (a.x + b.x) / 2 - r.left;
    const cy = (a.y + b.y) / 2 - r.top;
    if (pinch.current) {
      zoomAt(cx, cy, dist / pinch.current.dist);
      x.set(x.get() + cx - pinch.current.cx);
      y.set(y.get() + cy - pinch.current.cy);
    }
    pinch.current = { dist, cx, cy };
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!pointers.current.delete(e.pointerId)) return;
    pinch.current = null;
    if (pointers.current.size > 0) return;
    setGrabbing(false);
    // glide
    const glide = { type: "inertia", power: 0.3, timeConstant: 300 } as const;
    animate(x, x.get(), { ...glide, velocity: x.getVelocity() });
    animate(y, y.get(), { ...glide, velocity: y.getVelocity() });
  }

  function onDoubleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("[data-canvas-item], [data-canvas-ui]")) return;
    const r = rect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, 1.8, true);
  }

  /* ----- derived styles ----- */

  const world = useMotionTemplate`translate3d(${x}px, ${y}px, 0) scale(${z})`;
  // keep the dot grid between 18 and 36px apart at any zoom
  const grid = useTransform(z, (v) => {
    let s = 26 * v;
    while (s < 18) s *= 2;
    while (s > 36) s /= 2;
    return s;
  });
  const bgSize = useMotionTemplate`${grid}px ${grid}px`;
  const bgPos = useMotionTemplate`${x}px ${y}px`;

  return (
    <div
      ref={viewport}
      className={`absolute inset-0 touch-none overflow-hidden select-none ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(255 255 255 / .14) 1px, transparent 1.2px)",
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}
      />
      {/* soft vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.45)_100%)]" />

      <motion.div className="absolute top-0 left-0 origin-top-left" style={{ transform: world }}>
        {items.map((item, i) => (
          <CanvasNode
            key={item.id}
            item={item}
            index={i}
            zoom={z}
            selected={selected?.id === item.id}
            bringToFront={() => ++top.current}
            onSelect={flyTo}
          />
        ))}
      </motion.div>

      <Hud x={x} y={y} z={z} size={size} onZoom={(f) => zoomAt(size.w / 2, size.h / 2, f, true)} onHome={home} onFit={fit} />
      <Minimap items={items} x={x} y={y} z={z} size={size} onJump={(wx, wy) => moveTo(size.w / 2 - wx * z.get(), size.h / 2 - wy * z.get(), z.get())} />
      <DetailPanel item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ---------- one thing on the canvas ---------- */

function CanvasNode({
  item,
  index,
  zoom,
  selected,
  bringToFront,
  onSelect,
}: {
  item: CanvasItem;
  index: number;
  zoom: MotionValue<number>;
  selected: boolean;
  bringToFront: () => number;
  onSelect: (item: CanvasItem, pos: Pos) => void;
}) {
  const ix = useMotionValue(item.x);
  const iy = useMotionValue(item.y);
  const [layer, setLayer] = useState(index + 1);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ px: number; py: number; ix: number; iy: number; moved: boolean } | null>(null);
  // ripple outwards from the middle on first load
  const delay = Math.min(1.2, Math.hypot(item.x, item.y) / 1400);

  function down(e: React.PointerEvent) {
    if (e.button !== 0 || (e.target as HTMLElement).closest("a, button")) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ix: ix.get(), iy: iy.get(), moved: false };
    setLayer(bringToFront());
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.px) / zoom.get();
    const dy = (e.clientY - d.py) / zoom.get();
    if (!d.moved && Math.hypot(dx, dy) * zoom.get() > 4) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) {
      ix.set(d.ix + dx);
      iy.set(d.iy + dy);
    }
  }
  function up() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setDragging(false);
    if (!d.moved) onSelect(item, { x: ix.get(), y: iy.get() });
  }

  return (
    <motion.div
      data-canvas-item
      className="absolute top-0 left-0"
      style={{ x: ix, y: iy, zIndex: layer }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 + delay }}
      >
        <motion.div
          className={dragging ? "cursor-grabbing" : "cursor-pointer"}
          animate={{
            rotate: dragging ? 0 : (item.rotate ?? 0),
            scale: dragging ? 1.06 : selected ? 1.03 : 1,
            filter: dragging ? "drop-shadow(0 30px 30px rgb(0 0 0 / .5))" : "drop-shadow(0 0px 0px rgb(0 0 0 / 0))",
          }}
          whileHover={{ scale: dragging ? 1.06 : 1.025 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
        >
          <ItemView item={item} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- heads-up display ---------- */

function Hud({
  x,
  y,
  z,
  size,
  onZoom,
  onHome,
  onFit,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  z: MotionValue<number>;
  size: { w: number; h: number };
  onZoom: (f: number) => void;
  onHome: () => void;
  onFit: () => void;
}) {
  const cx = useTransform(() => Math.round((size.w / 2 - x.get()) / z.get()));
  const cy = useTransform(() => Math.round((size.h / 2 - y.get()) / z.get()));
  const pct = useTransform(z, (v) => `${Math.round(v * 100)}%`);

  const btn =
    "grid size-8 cursor-pointer place-items-center rounded-lg text-fg/70 transition-colors hover:bg-white/10 hover:text-fg active:scale-95";

  return (
    <div data-canvas-ui className="absolute bottom-24 left-4 z-20 flex flex-col gap-2 sm:bottom-5 sm:left-5">
      <div className="flex items-center gap-3 rounded-xl bg-surface/80 px-3 py-2 font-pixel text-[11px] text-muted ring-1 ring-white/10 backdrop-blur-md">
        <span>
          X <motion.span className="inline-block min-w-[4ch] text-fg tabular-nums">{cx}</motion.span>
        </span>
        <span>
          Y <motion.span className="inline-block min-w-[4ch] text-fg tabular-nums">{cy}</motion.span>
        </span>
        <motion.span className="inline-block min-w-[4ch] text-accent tabular-nums">{pct}</motion.span>
      </div>
      <div className="flex w-fit items-center gap-0.5 rounded-xl bg-surface/80 p-1 ring-1 ring-white/10 backdrop-blur-md">
        <button className={btn} onClick={() => onZoom(1 / 1.4)} aria-label="Zoom out" title="Zoom out (-)">
          <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 7h8" /></svg>
        </button>
        <button className={btn} onClick={() => onZoom(1.4)} aria-label="Zoom in" title="Zoom in (+)">
          <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 7h8M7 3v8" /></svg>
        </button>
        <span className="mx-0.5 h-4 w-px bg-white/10" />
        <button className={btn} onClick={onHome} aria-label="Back to start" title="Back to start (0)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="2" /><path d="M7 1v2M7 11v2M1 7h2M11 7h2" strokeLinecap="round" /></svg>
        </button>
        <button className={btn} onClick={onFit} aria-label="Fit everything" title="Fit everything (F)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 5V2h3M9 2h3v3M12 9v3H9M5 12H2V9" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ---------- minimap ---------- */

function Minimap({
  items,
  x,
  y,
  z,
  size,
  onJump,
}: {
  items: CanvasItem[];
  x: MotionValue<number>;
  y: MotionValue<number>;
  z: MotionValue<number>;
  size: { w: number; h: number };
  onJump: (wx: number, wy: number) => void;
}) {
  const W = 180;
  const H = (W * WORLD.h) / WORLD.w;
  const s = W / WORLD.w;
  const left = useTransform(() => ((-x.get() / z.get() - WORLD.x) * s));
  const top = useTransform(() => ((-y.get() / z.get() - WORLD.y) * s));
  const width = useTransform(z, (v) => (size.w / v) * s);
  const height = useTransform(z, (v) => (size.h / v) * s);

  return (
    <div
      data-canvas-ui
      className="absolute right-5 bottom-5 z-20 hidden cursor-crosshair overflow-hidden rounded-xl bg-surface/80 ring-1 ring-white/10 backdrop-blur-md md:block"
      style={{ width: W, height: H }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onJump((e.clientX - r.left) / s + WORLD.x, (e.clientY - r.top) / s + WORLD.y);
      }}
    >
      {items
        .filter((i) => Math.abs(i.x) < -WORLD.x && Math.abs(i.y) < -WORLD.y)
        .map((i) => (
          <span
            key={i.id}
            className={`absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i.kind === "project" ? "bg-accent" : "bg-white/40"}`}
            style={{ left: (i.x - WORLD.x) * s, top: (i.y - WORLD.y) * s }}
          />
        ))}
      <motion.span className="absolute rounded-[3px] border border-accent/80 bg-accent/10" style={{ left, top, width, height }} />
    </div>
  );
}

/* ---------- details for the selected project ---------- */

function DetailPanel({ item, onClose }: { item: CanvasItem | null; onClose: () => void }) {
  const project = item?.kind === "project" ? item : null;
  return (
    <AnimatePresence>
      {project && (
        <motion.aside
          data-canvas-ui
          key={project.id}
          initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 30, filter: "blur(8px)" }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="absolute top-4 right-4 bottom-auto z-30 w-[min(340px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-surface/90 text-fg shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:top-5 sm:right-5"
        >
          <div className="grain h-36" style={{ background: project.cover }} />
          <div className="p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[20px] font-medium tracking-tight">{project.title}</h2>
              <span className="font-pixel text-[12px] text-muted">{project.year}</span>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-muted">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2">
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-black transition-transform active:scale-95"
                >
                  Open project ↗
                </a>
              )}
              <button onClick={onClose} className="cursor-pointer rounded-full px-4 py-2 text-[13px] text-muted transition-colors hover:bg-white/5 hover:text-fg">
                Close
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
