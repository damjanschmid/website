"use client";

import { motion, type Variants } from "motion/react";

/*
 * Animated icons. They react to the "hover" variant of the closest
 * motion parent, e.g. <motion.button initial="rest" animate="rest" whileHover="hover">.
 */

type IconProps = { size?: number; className?: string };

function Svg({ size = 18, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
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

/* Envelope whose flap lifts open on hover */
export function MailIcon(props: IconProps) {
  const flap: Variants = {
    rest: { d: "M3.5 7.5 L12 13.5 L20.5 7.5" },
    hover: { d: "M3.5 7.5 L12 2.5 L20.5 7.5" },
  };
  const letter: Variants = {
    rest: { y: 4, opacity: 0 },
    hover: { y: -1.5, opacity: 1, transition: { delay: 0.08, type: "spring", stiffness: 400, damping: 20 } },
  };
  return (
    <Svg {...props}>
      <motion.rect x="7.5" y="6" width="9" height="7" rx="1" variants={letter} strokeWidth={1.4} />
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <motion.path variants={flap} transition={{ type: "spring", stiffness: 500, damping: 26 }} />
    </Svg>
  );
}

/* A checkmark that draws itself in */
export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <motion.path
        d="M5 12.5 9.5 17 19 7"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      />
    </Svg>
  );
}
