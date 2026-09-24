"use client";

import { motion, type Transition, type Variants } from "motion/react";

/*
 * Hand-made animated icons.
 *
 * They listen for the "hover" variant from the closest motion parent,
 * so you get the animation by putting them inside something like:
 *   <motion.a initial="rest" animate="rest" whileHover="hover">
 * Standalone, wrap them in <HoverIcon>.
 */

type IconProps = { size?: number; className?: string; strokeWidth?: number };

const spring: Transition = { type: "spring", stiffness: 500, damping: 22 };

function Svg({
  size = 20,
  className,
  strokeWidth = 1.6,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      {children}
    </svg>
  );
}

export function HoverIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span initial="rest" animate="rest" whileHover="hover" className={className}>
      {children}
    </motion.span>
  );
}

/* House: the roof hops and the door swings open */
export function HomeIcon(props: IconProps) {
  const roof: Variants = {
    rest: { y: 0, transition: spring },
    hover: { y: [0, -3, 0], transition: { duration: 0.45, ease: "easeOut" } },
  };
  const door: Variants = {
    rest: { scaleX: 1, transition: spring },
    hover: { scaleX: 0.25, transition: { ...spring, delay: 0.1 } },
  };
  return (
    <Svg {...props}>
      <path d="M5 10.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.5" />
      <motion.path d="M3 11.5 12 4l9 7.5" variants={roof} />
      <motion.path
        d="M10 20v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"
        variants={door}
        style={{ originX: 0, transformBox: "fill-box" }}
      />
    </Svg>
  );
}

/* Pen: wiggles and writes a fresh line */
export function PenIcon(props: IconProps) {
  const pen: Variants = {
    rest: { x: 0, y: 0, rotate: 0, transition: spring },
    hover: {
      x: [0, -2, 1.5, 0],
      y: [0, 1, -0.5, 0],
      rotate: [0, -10, 6, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };
  const line: Variants = {
    rest: { pathLength: 1, transition: { duration: 0.3 } },
    hover: { pathLength: [0, 1], transition: { duration: 0.55, ease: "easeOut", delay: 0.05 } },
  };
  return (
    <Svg {...props}>
      <motion.path d="M13 20h8" variants={line} />
      <motion.path
        d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
        variants={pen}
        style={{ originX: "20%", originY: "80%", transformBox: "fill-box" }}
      />
    </Svg>
  );
}

/* Book: a page flips over the spine */
export function BookIcon(props: IconProps) {
  const page: Variants = {
    rest: { scaleX: 1, opacity: 0, transition: { duration: 0.2 } },
    hover: {
      scaleX: [1, -1],
      opacity: [1, 1, 0],
      transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
    },
  };
  return (
    <Svg {...props}>
      <path d="M12 7v14" />
      <path d="M12 7a4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3" />
      <path d="M12 7a4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3" />
      <motion.path
        d="M12 7a4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3"
        variants={page}
        style={{ originX: 0, transformBox: "fill-box" }}
        fill="var(--dock-bg, transparent)"
      />
    </Svg>
  );
}

/* Shapes: circle, square and triangle swap places */
export function ShapesIcon(props: IconProps) {
  const s: Transition = { type: "spring", stiffness: 380, damping: 18 };
  const circle: Variants = { rest: { x: 0, y: 0, transition: s }, hover: { x: 10, y: 0, transition: s } };
  const square: Variants = {
    rest: { x: 0, y: 0, rotate: 0, transition: s },
    hover: { x: -5, y: 10, rotate: 90, transition: { ...s, delay: 0.04 } },
  };
  const triangle: Variants = {
    rest: { x: 0, y: 0, rotate: 0, transition: s },
    hover: { x: -5, y: -10, rotate: 120, transition: { ...s, delay: 0.08 } },
  };
  return (
    <Svg {...props}>
      <motion.circle cx="7" cy="7" r="3.5" variants={circle} />
      <motion.rect
        x="13.5"
        y="3.5"
        width="7"
        height="7"
        rx="1.2"
        variants={square}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      />
      <motion.path
        d="M12 13.2 15.8 20H8.2Z"
        variants={triangle}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.6 }}
      />
    </Svg>
  );
}

/* Arrow that leaves through the top-right and comes back from the bottom-left */
export function ArrowUpRightIcon(props: IconProps) {
  const arrow: Variants = {
    rest: { x: 0, y: 0, opacity: 1 },
    hover: {
      x: [0, 9, -9, 0],
      y: [0, -9, 9, 0],
      opacity: [1, 0, 0, 1],
      transition: { duration: 0.5, times: [0, 0.4, 0.41, 1], ease: "easeInOut" },
    },
  };
  return (
    <Svg {...props}>
      <motion.g variants={arrow}>
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </motion.g>
    </Svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  const arrow: Variants = {
    rest: { x: 0, transition: spring },
    hover: { x: -3, transition: spring },
  };
  return (
    <Svg {...props}>
      <motion.g variants={arrow}>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </motion.g>
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  const arrow: Variants = {
    rest: { x: 0, transition: spring },
    hover: { x: 3, transition: spring },
  };
  return (
    <Svg {...props}>
      <motion.g variants={arrow}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </motion.g>
    </Svg>
  );
}

/* Two arrows chasing each other, for "give me another greeting" */
export function ShuffleIcon(props: IconProps) {
  const g: Variants = {
    rest: { rotate: 0, transition: spring },
    hover: { rotate: 180, transition: { type: "spring", stiffness: 260, damping: 16 } },
  };
  return (
    <Svg {...props}>
      <motion.g variants={g} style={{ originX: "50%", originY: "50%" }}>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
      </motion.g>
    </Svg>
  );
}

/* Four-point sparkle that twists */
export function SparkleIcon(props: IconProps) {
  const g: Variants = {
    rest: { rotate: 0, scale: 1, transition: spring },
    hover: { rotate: 90, scale: [1, 1.25, 1], transition: { type: "spring", stiffness: 300, damping: 14 } },
  };
  return (
    <Svg {...props}>
      <motion.path
        d="M12 3c.4 4.6 1.4 5.6 6 6-4.6.4-5.6 1.4-6 6-.4-4.6-1.4-5.6-6-6 4.6-.4 5.6-1.4 6-6Z"
        variants={g}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      />
      <motion.path
        d="M19 15.5c.15 1.7.55 2.1 2.2 2.25-1.65.15-2.05.55-2.2 2.25-.15-1.7-.55-2.1-2.2-2.25 1.65-.15 2.05-.55 2.2-2.25Z"
        variants={{ rest: { scale: 1, opacity: 0.8 }, hover: { scale: [1, 0, 1.2, 1], transition: { duration: 0.6 } } }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      />
    </Svg>
  );
}

/* Equaliser bars. Bounces while `playing` is true. */
export function EqualizerIcon({ playing = false, size = 16, className }: IconProps & { playing?: boolean }) {
  const bars = [0.55, 1, 0.7, 0.85];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={1.5 + i * 3.6}
          y={1}
          width={2.2}
          height={14}
          rx={1.1}
          fill="currentColor"
          style={{ transformBox: "fill-box", originY: 1 }}
          initial={false}
          animate={playing ? { scaleY: [0.2, h, 0.35, h * 0.85, 0.2] } : { scaleY: 0.2 }}
          transition={
            playing
              ? { duration: 1.1 + i * 0.17, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }
              : { duration: 0.3 }
          }
        />
      ))}
    </svg>
  );
}
