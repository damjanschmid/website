"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BookIcon, EqualizerIcon, HomeIcon, PenIcon, ShapesIcon } from "@/components/icons";
import { useNowPlaying } from "@/lib/use-now-playing";

const MotionLink = motion.create(Link);

const items = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/notes", label: "Notes", Icon: PenIcon },
  { href: "/resources", label: "Resources", Icon: BookIcon },
  { href: "/else", label: "Everything else", Icon: ShapesIcon },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Dock() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.nav
      aria-label="Main"
      initial={{ y: 80, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.35 }}
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        className="flex items-center gap-1 rounded-full p-1.5 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.45),0_2px_6px_-2px_rgb(0_0_0/0.25)] ring-1 ring-[var(--dock-line)]"
        style={{ background: "var(--dock-bg)", color: "var(--dock-fg)" }}
        onMouseLeave={() => setHovered(null)}
      >
        {items.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <MotionLink
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHovered(href)}
              onFocus={() => setHovered(href)}
              onBlur={() => setHovered(null)}
              className="relative grid size-10 place-items-center rounded-full outline-none"
            >
              {active && (
                <motion.span
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "color-mix(in oklab, var(--dock-fg) 14%, transparent)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={`relative transition-opacity duration-200 ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
                <Icon size={19} />
              </span>
              <Tooltip show={hovered === href}>{label}</Tooltip>
            </MotionLink>
          );
        })}
        <span className="mx-1 h-5 w-px" style={{ background: "var(--dock-line)" }} />
        <NowPlayingButton hovered={hovered === "music"} onHover={(h) => setHovered(h ? "music" : null)} />
      </div>
    </motion.nav>
  );
}

function Tooltip({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, y: 6, scale: 0.9, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 4, scale: 0.95, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[12px] font-medium tracking-tight shadow-lg"
          style={{ background: "var(--dock-bg)", color: "var(--dock-fg)", boxShadow: "0 0 0 1px var(--dock-line), 0 8px 20px -8px rgb(0 0 0 / .4)" }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function NowPlayingButton({ hovered, onHover }: { hovered: boolean; onHover: (h: boolean) => void }) {
  const { track } = useNowPlaying();
  const playing = !!track?.isPlaying;
  const label = track ? `${track.isPlaying ? "Listening to" : "Last played"} ${track.title} by ${track.artist}` : "Nothing playing";

  return (
    <motion.a
      href={track?.url ?? "#"}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className="relative grid size-10 place-items-center rounded-full"
    >
      <span className={playing ? "text-[var(--accent)]" : "opacity-60"}>
        <EqualizerIcon playing={playing} size={16} />
      </span>
      <AnimatePresence>
        {hovered && track && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.92, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, scale: 0.96, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 480, damping: 32 }}
            className="pointer-events-none absolute right-[-6px] bottom-[calc(100%+12px)] flex w-64 items-center gap-3 rounded-2xl p-2 pr-3 text-left"
            style={{ background: "var(--dock-bg)", color: "var(--dock-fg)", boxShadow: "0 0 0 1px var(--dock-line), 0 16px 32px -12px rgb(0 0 0 / .5)" }}
          >
            {track.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={track.image} alt="" className="size-11 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="size-11 shrink-0 rounded-lg" style={{ background: "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 30%, black))" }} />
            )}
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] opacity-60">
                {track.isPlaying && <span className="size-1.5 animate-pulse rounded-full bg-[var(--accent)]" />}
                {track.isPlaying ? "Listening now" : "Last played"}
              </span>
              <span className="block truncate text-[13px] font-medium">{track.title}</span>
              <span className="block truncate text-[12px] opacity-60">{track.artist}</span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
