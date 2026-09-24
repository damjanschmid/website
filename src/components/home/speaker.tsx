"use client";

import { motion } from "motion/react";
import { useNowPlaying } from "@/lib/use-now-playing";
import { u } from "./collage-pieces";

const GRID = 9;

// A little speaker in the spirit of Dieter Rams. The grille ripples
// while something is playing; the display shows what it is.
export function Speaker() {
  const { track, loaded } = useNowPlaying();
  const playing = !!track?.isPlaying;
  const line = track
    ? `${track.isPlaying ? "NOW PLAYING" : "LAST PLAYED"} · ${track.title} · ${track.artist}`
    : loaded
      ? "SILENCE, FOR NOW"
      : "TUNING IN…";

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: u(206),
        padding: u(15),
        gap: u(12),
        borderRadius: u(24),
        background: "linear-gradient(165deg, #f1eee8 0%, #e3dfd6 60%, #d8d3c8 100%)",
        boxShadow:
          "inset 0 1px 0 rgb(255 255 255 / .9), inset 0 -2px 3px rgb(0 0 0 / .06), 0 2px 3px rgb(0 0 0 / .1), 0 22px 30px -18px rgb(0 0 0 / .45)",
      }}
    >
      {/* grille */}
      <div
        className="grid aspect-square"
        style={{
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          gap: u(8),
          padding: u(16),
          borderRadius: u(16),
          background: "linear-gradient(180deg, #e7e3db, #ebe8e1)",
          boxShadow: "inset 0 2px 4px rgb(0 0 0 / .1), inset 0 -1px 0 rgb(255 255 255 / .8)",
        }}
      >
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const x = (i % GRID) - (GRID - 1) / 2;
          const y = Math.floor(i / GRID) - (GRID - 1) / 2;
          const d = Math.sqrt(x * x + y * y);
          const inside = d <= GRID / 2;
          return (
            <span
              key={i}
              className="speaker-dot aspect-square rounded-full"
              style={{
                background: inside ? "#35332e" : "transparent",
                boxShadow: inside ? "inset 0 1px 1px rgb(0 0 0 / .6)" : undefined,
                animationDelay: `${d * 0.09}s`,
                animationPlayState: playing ? "running" : "paused",
              }}
            />
          );
        })}
      </div>

      {/* display + knob */}
      <div className="flex items-center" style={{ gap: u(10) }}>
        <a
          href={track?.url ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="relative flex-1 overflow-hidden font-pixel text-[#c8f58a]"
          style={{
            height: u(30),
            borderRadius: u(6),
            fontSize: u(12),
            background: "linear-gradient(180deg, #1b231b, #232d22)",
            boxShadow: "inset 0 2px 4px rgb(0 0 0 / .6), 0 1px 0 rgb(255 255 255 / .7)",
            textShadow: "0 0 6px rgb(200 245 138 / .6)",
          }}
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <span className="marquee absolute inset-y-0 left-0 flex items-center whitespace-nowrap">
            <span style={{ paddingLeft: u(10), paddingRight: u(30) }}>{line}</span>
            <span style={{ paddingLeft: u(10), paddingRight: u(30) }} aria-hidden>{line}</span>
          </span>
        </a>
        <motion.div
          className="relative shrink-0 rounded-full"
          style={{
            width: u(34),
            height: u(34),
            background: "radial-gradient(circle at 35% 30%, #fbfaf7, #cfcac0 70%)",
            boxShadow: "0 2px 3px rgb(0 0 0 / .25), inset 0 -1px 2px rgb(0 0 0 / .15)",
          }}
          animate={{ rotate: playing ? 360 : 0 }}
          transition={playing ? { duration: 14, repeat: Infinity, ease: "linear" } : { duration: 0.6 }}
        >
          <span className="absolute left-1/2 top-[14%] -translate-x-1/2 rounded-full bg-[#e2542b]" style={{ width: u(3), height: u(9) }} />
        </motion.div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between font-grotesk uppercase text-[#77726a]" style={{ fontSize: u(8.5), letterSpacing: "0.18em" }}>
        <span className="font-semibold">DS–01</span>
        <span className="flex items-center" style={{ gap: u(5) }}>
          <span
            className={`rounded-full ${playing ? "animate-pulse bg-[#e2542b] shadow-[0_0_6px_#e2542b]" : "bg-[#b3ada2]"}`}
            style={{ width: u(6), height: u(6) }}
          />
          {playing ? "Live" : "Off air"}
        </span>
      </div>
    </div>
  );
}
