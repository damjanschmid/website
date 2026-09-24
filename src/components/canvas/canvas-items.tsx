"use client";

/* eslint-disable @next/next/no-img-element -- canvas items are scaled by the camera, next/image sizing doesn't help here */

import { motion } from "motion/react";
import type { CanvasItem } from "@content/canvas";
import { useNowPlaying } from "@/lib/use-now-playing";
import { celebrate } from "@/components/easter-eggs";

type Props<K extends CanvasItem["kind"]> = { item: Extract<CanvasItem, { kind: K }> };

export function ItemView({ item }: { item: CanvasItem }) {
  switch (item.kind) {
    case "project":
      return <Project item={item} />;
    case "photo":
      return <Photo item={item} />;
    case "sticky":
      return <Sticky item={item} />;
    case "quote":
      return <Quote item={item} />;
    case "handwriting":
      return <Handwriting item={item} />;
    case "list":
      return <List item={item} />;
    case "music":
      return <Vinyl />;
    case "swatches":
      return <Swatches item={item} />;
    case "cassette":
      return <Cassette item={item} />;
    case "pin":
      return <Pin item={item} />;
    case "egg":
      return <Egg />;
  }
}

function Project({ item }: Props<"project">) {
  return (
    <article className="w-[300px] overflow-hidden rounded-2xl bg-surface text-fg shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/10">
      <div className="grain relative h-[168px]" style={{ background: item.cover }}>
        <span className="absolute right-4 bottom-2 font-pixel text-[44px] leading-none text-white/85 mix-blend-overlay">{item.year}</span>
      </div>
      <div className="p-4">
        <h3 className="text-[17px] font-medium tracking-tight">{item.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-muted">
              {t}
            </span>
          ))}
          {item.href && (
            <a href={item.href} target="_blank" rel="noreferrer" className="ml-auto text-[12px] text-accent hover:underline">
              Visit ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Photo({ item }: Props<"photo">) {
  const w = item.width ?? 220;
  return (
    <figure className="bg-[#f6f4ee] p-2.5 pb-10 shadow-[0_2px_4px_rgb(0_0_0/0.3),0_30px_40px_-24px_rgb(0_0_0/0.8)]" style={{ width: w }}>
      <img src={item.src} alt={item.caption ?? ""} draggable={false} className="block aspect-[4/3] w-full object-cover" />
      {item.caption && <figcaption className="mt-2 text-center font-hand text-[24px] leading-none text-[#2b2a27]">{item.caption}</figcaption>}
    </figure>
  );
}

function Sticky({ item }: Props<"sticky">) {
  return (
    <div
      className="flex size-[170px] items-center justify-center p-5 text-center shadow-[0_24px_30px_-22px_rgb(0_0_0/0.8)]"
      style={{ background: `linear-gradient(170deg, ${item.color}, color-mix(in oklab, ${item.color} 88%, #a07a00))` }}
    >
      <p className="font-hand text-[32px] leading-[0.95] text-[#2b2a27]">{item.text}</p>
    </div>
  );
}

function Quote({ item }: Props<"quote">) {
  return (
    <blockquote className="w-[480px] text-center">
      <p className="font-serif text-[40px] leading-[1.08] tracking-[-0.01em] text-fg">&ldquo;{item.text}&rdquo;</p>
      <footer className="mt-4 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="h-px w-8 bg-current" />
        {item.by}
        <span className="h-px w-8 bg-current" />
      </footer>
    </blockquote>
  );
}

function Handwriting({ item }: Props<"handwriting">) {
  return (
    <p className="whitespace-nowrap font-hand leading-none text-fg/85" style={{ fontSize: item.size ?? 32 }}>
      {item.text}
    </p>
  );
}

function List({ item }: Props<"list">) {
  return (
    <div
      className="w-[250px] bg-[#f7f5ef] pt-4 pr-4 pb-5 pl-11 text-[#2b2a27] shadow-[0_24px_36px_-24px_rgb(0_0_0/0.9)]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 32px, rgb(226 84 43 / .45) 32px 33px, transparent 33px), repeating-linear-gradient(180deg, transparent 0 27px, rgb(47 91 211 / .22) 27px 28px)",
        backgroundPosition: "0 0, 0 14px",
      }}
    >
      <h3 className="font-hand text-[30px] leading-[28px]">{item.title}</h3>
      <ul className="mt-[2px]">
        {item.items.map((t, i) => (
          <li key={t} className="flex items-center gap-2 font-hand text-[24px] leading-[28px]">
            <span className={`inline-block size-3 rounded-[2px] border border-[#2b2a27]/60 ${i === 0 ? "bg-[#2b2a27]/70" : ""}`} />
            <span className={i === 0 ? "line-through decoration-[#e2542b] decoration-2" : ""}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Vinyl() {
  const { track } = useNowPlaying();
  const playing = !!track?.isPlaying;
  return (
    <div className="flex items-center">
      <motion.div
        className="relative size-[230px] rounded-full shadow-[0_30px_50px_-25px_rgb(0_0_0/0.9)]"
        style={{
          background:
            "radial-gradient(circle, transparent 0 30%, rgb(255 255 255 / .04) 30.5%, transparent 31%), repeating-radial-gradient(circle, #111 0 2px, #1a1a1a 2px 3px), #111",
        }}
        animate={{ rotate: playing ? 360 : 0 }}
        transition={playing ? { duration: 3.2, repeat: Infinity, ease: "linear" } : { duration: 1 }}
      >
        <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_20%,rgb(255_255_255/.09)_25%,transparent_30%_70%,rgb(255_255_255/.07)_75%,transparent_80%)]" />
        <span
          className="absolute top-1/2 left-1/2 size-[84px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-accent"
          style={track?.image ? { backgroundImage: `url(${track.image})`, backgroundSize: "cover" } : undefined}
        >
          {!track?.image && <span className="absolute inset-0 grid place-items-center font-pixel text-[10px] text-black/70">DS</span>}
        </span>
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg" />
      </motion.div>
      <div className="-ml-6 w-[190px] rounded-xl bg-surface/95 p-3.5 shadow-xl ring-1 ring-white/10 backdrop-blur">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className={`size-1.5 rounded-full ${playing ? "animate-pulse bg-accent" : "bg-muted"}`} />
          {playing ? "On the turntable" : "Last spun"}
        </p>
        <p className="mt-1.5 truncate text-[14px] font-medium">{track?.title ?? "…"}</p>
        <p className="truncate text-[12px] text-muted">{track?.artist ?? ""}</p>
      </div>
    </div>
  );
}

function Swatches({ item }: Props<"swatches">) {
  return (
    <div className="flex gap-2">
      {item.colors.map((c, i) => (
        <div
          key={c.hex}
          className="w-[92px] bg-white p-1.5 pb-2 text-[#111] shadow-[0_20px_30px_-20px_rgb(0_0_0/0.9)]"
          style={{ transform: `rotate(${(i - 1.5) * 3}deg) translateY(${Math.abs(i - 1.5) * 6}px)` }}
        >
          <div className="h-[92px] ring-1 ring-black/5" style={{ background: c.hex }} />
          <p className="mt-1.5 text-[11px] font-semibold tracking-tight">{c.name}</p>
          <p className="font-mono text-[9px] uppercase text-black/50">{c.hex}</p>
        </div>
      ))}
    </div>
  );
}

function Cassette({ item }: Props<"cassette">) {
  return (
    <div className="relative h-[164px] w-[260px] rounded-[10px] bg-[#2b2b2f] p-3 shadow-[0_26px_40px_-24px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
      <div className="relative h-[96px] rounded-md bg-[#efe9dc] px-3 pt-1.5">
        <p className="font-hand text-[26px] leading-none text-[#2b2a27]">{item.label}</p>
        <div className="absolute inset-x-3 top-[34px] h-px bg-[#e2542b]/60" />
        <div className="absolute top-[44px] left-1/2 flex h-[40px] w-[150px] -translate-x-1/2 items-center justify-between rounded-full bg-[#1c1c1f] px-2.5">
          {[0, 1].map((r) => (
            <span key={r} className="tape-reel relative size-[26px] rounded-full border-[3px] border-dashed border-[#efe9dc]/80 bg-[#111]" />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-3 flex h-[34px] w-[170px] items-center justify-around rounded-t-lg bg-[#232326]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="size-2 rounded-full bg-[#111]" />
        ))}
      </div>
      <span className="absolute top-2 left-2 font-mono text-[9px] text-white/40">A</span>
    </div>
  );
}

function Pin({ item }: Props<"pin">) {
  return (
    <div className="w-[250px] overflow-hidden rounded-2xl bg-[#e9e6dc] shadow-[0_26px_40px_-24px_rgb(0_0_0/0.9)]">
      <div className="relative h-[150px]">
        <svg viewBox="0 0 250 150" className="absolute inset-0 size-full">
          <rect width="250" height="150" fill="#e4e0d3" />
          <path d="M0 110 C60 95 90 120 140 100 S220 70 250 80 V150 H0Z" fill="#b9d3dc" />
          {[
            "M0 40 L250 60",
            "M40 0 L70 150",
            "M150 0 C140 50 170 90 160 150",
            "M0 90 L250 30",
            "M200 0 L230 150",
          ].map((d) => (
            <path key={d} d={d} stroke="#fff" strokeWidth="5" fill="none" />
          ))}
          <path d="M0 40 L250 60" stroke="#f4c542" strokeWidth="2.5" fill="none" />
        </svg>
        <motion.div
          className="absolute top-[34px] left-1/2 -translate-x-1/2"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="30" height="40" viewBox="0 0 30 40">
            <path d="M15 39C15 39 28 23 28 14A13 13 0 0 0 2 14C2 23 15 39 15 39Z" fill="#e2542b" />
            <circle cx="15" cy="14" r="5" fill="#fff" />
          </svg>
        </motion.div>
        <span className="absolute top-[70px] left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-full bg-black/20 blur-[1px]" />
      </div>
      <div className="p-3.5 text-[#1d1b18]">
        <p className="text-[15px] font-semibold tracking-tight">{item.place}</p>
        <p className="font-mono text-[11px] text-black/50">{item.coords}</p>
      </div>
    </div>
  );
}

function Egg() {
  return (
    <motion.button
      type="button"
      aria-label="A small egg"
      onClick={() => celebrate("You found the egg. Not everyone wanders this far.")}
      whileHover={{ rotate: [0, -12, 12, -8, 0], transition: { duration: 0.6 } }}
      className="block cursor-pointer"
    >
      <svg width="34" height="44" viewBox="0 0 34 44">
        <path d="M17 2C8 2 2 16 2 27a15 15 0 0 0 30 0C32 16 26 2 17 2Z" fill="#f2eee6" />
        <path d="M6 24l5 3 5-4 5 4 5-3 3 2" stroke="#e2542b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.6" fill="#c8f560" />
        <circle cx="22" cy="33" r="2" fill="#2f5bd3" />
      </svg>
    </motion.button>
  );
}
