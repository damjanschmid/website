"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  CoffeeRing,
  DymoLabel,
  FilmStrip,
  Leaf,
  Polaroid,
  Receipt,
  Smiley,
  Stamp,
  StickyNote,
  Ticket,
  u,
} from "./collage-pieces";
import { Speaker } from "./speaker";
import { site } from "@/lib/site";

/*
 * The collage. Everything in here can be picked up and moved.
 * x / y are percentages of the collage box, rotate is in degrees.
 * To use a real photo, drop it in /public/collage and pass src to <Polaroid>.
 */

type Piece = { id: string; x: number; y: number; rotate: number; node: React.ReactNode };

const pieces: Piece[] = [
  { id: "polaroid", x: 3, y: 5, rotate: -7, node: <Polaroid caption="me, probably" /> },
  { id: "label", x: 42, y: 3, rotate: 3.5, node: <DymoLabel text={site.name} /> },
  { id: "stamp", x: 81, y: 5, rotate: 8, node: <Stamp /> },
  { id: "speaker", x: 48, y: 17, rotate: 3, node: <Speaker /> },
  { id: "smiley", x: 31, y: 37, rotate: -12, node: <Smiley /> },
  { id: "leaf", x: 86, y: 30, rotate: 24, node: <Leaf /> },
  { id: "sticky", x: 6, y: 52, rotate: 5, node: <StickyNote>make things you&apos;d want to find</StickyNote> },
  {
    id: "receipt",
    x: 74,
    y: 56,
    rotate: -4,
    node: (
      <Receipt
        lines={[
          ["Building", "this site"],
          ["Listening", "see speaker"],
          ["Based in", site.location],
          ["Mood", "curious"],
        ]}
      />
    ),
  },
  { id: "film", x: 30, y: 60, rotate: 6, node: <FilmStrip /> },
  { id: "ticket", x: 22, y: 78, rotate: -6, node: <Ticket /> },
];

export function Collage() {
  const box = useRef<HTMLDivElement>(null);
  const top = useRef(pieces.length);

  return (
    <div className="@container relative w-full select-none">
      <div
        ref={box}
        className="relative w-full"
        style={{ aspectRatio: "620 / 680", "--u": "calc(100cqw / 620)" } as React.CSSProperties}
      >
        <div className="pointer-events-none absolute" style={{ left: "58%", top: "74%" }}>
          <CoffeeRing />
        </div>

        {pieces.map((p, i) => (
          <DraggablePiece key={p.id} piece={p} index={i} constraints={box} bringToFront={() => ++top.current} />
        ))}

        <Hint />
      </div>
    </div>
  );
}

function DraggablePiece({
  piece,
  index,
  constraints,
  bringToFront,
}: {
  piece: Piece;
  index: number;
  constraints: React.RefObject<HTMLDivElement | null>;
  bringToFront: () => number;
}) {
  const [z, setZ] = useState(index + 1);
  const controls = useAnimationControls();

  // placed on the table one by one
  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      rotate: piece.rotate,
      transition: { type: "spring", stiffness: 240, damping: 19, delay: 0.25 + index * 0.07 },
    });
  }, [controls, index, piece.rotate]);

  // Konami code: everything spins once
  useEffect(() => {
    const party = () =>
      controls.start({
        rotate: [piece.rotate, piece.rotate + 360 * (index % 2 ? 1 : -1)],
        scale: [1, 1.15, 1],
        transition: { duration: 1.1, delay: index * 0.05, ease: [0.65, 0, 0.35, 1] },
      });
    window.addEventListener("easter:party", party);
    return () => window.removeEventListener("easter:party", party);
  }, [controls, index, piece.rotate]);

  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragElastic={0.14}
      dragTransition={{ power: 0.22, timeConstant: 240, bounceStiffness: 300, bounceDamping: 22 }}
      onPointerDown={() => setZ(bringToFront())}
      initial={{ opacity: 0, scale: 1.3, rotate: piece.rotate + 14 }}
      animate={controls}
      whileHover={{ scale: 1.035, rotate: piece.rotate * 0.55 }}
      whileDrag={{ scale: 1.07, rotate: piece.rotate * 0.25, filter: "drop-shadow(0 22px 22px rgb(0 0 0 / .22))" }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className="absolute cursor-grab touch-none active:cursor-grabbing"
      style={{ left: `${piece.x}%`, top: `${piece.y}%`, zIndex: z, filter: "drop-shadow(0 0 0 rgb(0 0 0 / 0))" }}
    >
      {piece.node}
    </motion.div>
  );
}

function Hint() {
  return (
    <motion.div
      className="pointer-events-none absolute flex items-end text-muted"
      style={{ left: "63%", top: "95.5%", gap: u(6) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <svg viewBox="0 0 60 40" style={{ width: u(46) }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <motion.path
          d="M56 30C40 36 18 34 8 12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.8, duration: 0.7, ease: "easeInOut" }}
        />
        <motion.path
          d="M3 18 8 11l7 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.4, duration: 0.25 }}
        />
      </svg>
      <span className="font-hand leading-none" style={{ fontSize: u(26) }}>
        drag things around
      </span>
    </motion.div>
  );
}
