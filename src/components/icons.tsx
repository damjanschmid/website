"use client";

import { motion } from "motion/react";

/*
 * Icons for the copy-email button. They react to the "hover" variant of the
 * closest motion parent, e.g. <motion.button initial="rest" animate="rest" whileHover="hover">.
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

/* Envelope that lifts and tilts a little on hover, like it's being picked up */
export function MailIcon(props: IconProps) {
  return (
    <motion.span
      className="grid"
      variants={{ rest: { y: 0, rotate: 0 }, hover: { y: -2, rotate: -10 } }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
    >
      <Svg {...props}>
        <rect x="3" y="6" width="18" height="13" rx="2.5" />
        <path d="M3.5 7.5 L12 13.5 L20.5 7.5" />
      </Svg>
    </motion.span>
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
