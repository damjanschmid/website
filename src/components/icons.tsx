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

/* Folded paper plane that noses up and edges forward on hover, a little take-off */
export function PlaneIcon(props: IconProps) {
  return (
    <motion.span
      className="grid"
      variants={{ rest: { x: 0, y: 0, rotate: 0 }, hover: { x: 2, y: -2, rotate: -10 } }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
    >
      <Svg {...props}>
        {/* top wing */}
        <path d="M22 4 2.5 8.5 9.5 13Z" strokeWidth={2} />
        {/* body and the folded lower flap */}
        <path d="M22 4 9.5 13 8 21 13.5 15Z" strokeWidth={2} />
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
