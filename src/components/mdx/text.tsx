"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/* A highlighter stroke that draws itself when it scrolls into view */
export function Mark({ children }: { children: React.ReactNode }) {
  return (
    <motion.mark
      className="rounded-[2px] bg-no-repeat px-0.5 text-inherit"
      style={{
        backgroundColor: "transparent",
        backgroundImage: "linear-gradient(104deg, transparent 0.5%, color-mix(in oklab, var(--accent) 38%, transparent) 2%, color-mix(in oklab, var(--accent) 30%, transparent) 98%, transparent 99.5%)",
        backgroundPosition: "0 88%",
      }}
      initial={{ backgroundSize: "0% 70%" }}
      whileInView={{ backgroundSize: "100% 70%" }}
      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
      transition={{ duration: 0.9, ease, delay: 0.1 }}
    >
      {children}
    </motion.mark>
  );
}

/* A hand-drawn underline */
export function Scribble({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg aria-hidden viewBox="0 0 120 12" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-1.5 left-0 h-[0.45em] w-full overflow-visible text-accent">
        <motion.path
          d="M2 8c20-5 40-6 58-3s38 3 58-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        />
      </svg>
    </span>
  );
}

export function PullQuote({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <motion.figure
      className="relative my-14 sm:-mx-10"
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease }}
    >
      <span aria-hidden className="absolute -top-10 -left-2 font-serif text-[120px] leading-none text-accent/80 select-none">
        &ldquo;
      </span>
      <blockquote className="relative font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] tracking-[-0.01em] text-fg [&>p]:m-0">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-4 font-sans text-[13px] text-muted">{cite}</figcaption>}
    </motion.figure>
  );
}

export function Callout({ children, icon = "✳", title }: { children: React.ReactNode; icon?: string; title?: string }) {
  return (
    <aside className="my-8 flex gap-4 rounded-2xl border border-line bg-fg/[0.03] p-5 font-sans text-[15px] leading-relaxed text-fg/80">
      <motion.span
        aria-hidden
        className="mt-0.5 shrink-0 text-accent"
        whileInView={{ rotate: [0, 90] }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
      >
        {icon}
      </motion.span>
      <div className="[&>p]:my-0 [&>p+p]:mt-3">
        {title && <p className="mb-1 font-medium text-fg">{title}</p>}
        {children}
      </div>
    </aside>
  );
}

export function Divider() {
  return (
    <div className="my-14 flex items-center justify-center gap-5 text-accent" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="text-[15px]"
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.08 }}
        >
          ✳
        </motion.span>
      ))}
    </div>
  );
}
