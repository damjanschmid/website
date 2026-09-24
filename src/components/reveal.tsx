"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/* Soft entrance: fades up out of a blur. Stagger with `delay`. */
export function Reveal({ delay = 0, y = 12, children, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
