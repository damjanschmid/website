"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeftIcon } from "@/components/icons";

const MotionLink = motion.create(Link);

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <MotionLink
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-fg"
    >
      <ArrowLeftIcon size={14} />
      {children}
    </MotionLink>
  );
}
