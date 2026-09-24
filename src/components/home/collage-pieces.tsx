/*
 * The physical bits that make up the homepage collage.
 * Every size is in "u", 1/620th of the collage width, so the whole
 * thing scales as one object.
 */

import Image from "next/image";

export const u = (n: number) => `calc(var(--u) * ${n})`;

export function Tape({ className, rotate = -4, style }: { className?: string; rotate?: number; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className={`absolute block ${className ?? ""}`}
      style={{
        width: u(78),
        height: u(24),
        background: "linear-gradient(180deg, rgb(236 226 200 / .82), rgb(222 210 180 / .78))",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 1px 1px rgb(0 0 0 / .06)",
        maskImage:
          "linear-gradient(90deg, transparent 0 2%, #000 2% 98%, transparent 98%), repeating-linear-gradient(90deg, #000 0 3px, transparent 3px 4px)",
        ...style,
      }}
    />
  );
}

/* ---------- Polaroid ---------- */

export function Polaroid({ src, alt = "", caption }: { src?: string; alt?: string; caption: string }) {
  return (
    <div
      className="relative bg-[#fdfcf8]"
      style={{ width: u(196), padding: u(11), paddingBottom: u(48), boxShadow: "0 1px 2px rgb(0 0 0 / .12), 0 8px 20px -10px rgb(0 0 0 / .25)" }}
    >
      <div className="grain relative aspect-square overflow-hidden bg-[#d9cbb5]">
        {src ? <Image src={src} alt={alt} fill sizes="200px" className="object-cover" draggable={false} /> : <SunsetPhoto />}
      </div>
      <p className="absolute inset-x-0 text-center font-hand leading-none text-[#2b2a27]" style={{ bottom: u(12), fontSize: u(28) }}>
        {caption}
      </p>
      <Tape style={{ top: u(-12), left: "50%", marginLeft: u(-39) }} rotate={-3} />
    </div>
  );
}

// A made-up photo until there's a real one
function SunsetPhoto() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6c9a0" />
          <stop offset="0.55" stopColor="#f09a6b" />
          <stop offset="1" stopColor="#c8573a" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="1" stopColor="#ffd98f" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#sky)" />
      <circle cx="62" cy="58" r="13" fill="url(#sun)" opacity="0.95" />
      <path d="M0 70 Q18 58 34 66 T70 62 T100 64 V100 H0Z" fill="#7a3b2e" opacity="0.85" />
      <path d="M0 80 Q25 70 50 78 T100 76 V100 H0Z" fill="#3f2622" />
      {/* a tiny person, for scale */}
      <g fill="#1f1512" transform="translate(28 66)">
        <circle cx="0" cy="0" r="1.6" />
        <path d="M-1.6 2 h3.2 l.6 7 h-1.2 l-.6 -4 -.6 4 h-1.2z" />
      </g>
    </svg>
  );
}

/* ---------- Dymo label ---------- */

export function DymoLabel({ text }: { text: string }) {
  return (
    <div
      className="relative whitespace-nowrap font-mono font-bold uppercase"
      style={{
        fontSize: u(21),
        letterSpacing: "0.16em",
        padding: `${u(7)} ${u(16)} ${u(7)} ${u(18)}`,
        color: "#fbeee9",
        background: "linear-gradient(180deg, #d8322a 0%, #b9231c 55%, #a61e18 100%)",
        textShadow: "0 1px 0 rgb(0 0 0 / .35), 0 -1px 0 rgb(255 255 255 / .25)",
        clipPath: "polygon(0 8%, 2% 0, 98% 0, 100% 8%, 100% 92%, 98% 100%, 2% 100%, 0 92%)",
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / .25)",
      }}
    >
      {text}
    </div>
  );
}

/* ---------- Swiss stamp ---------- */

export function Stamp() {
  const hole = u(4.2);
  const step = u(12);
  return (
    <div
      className="relative bg-[#fbf8f1]"
      style={{
        width: u(98),
        height: u(118),
        padding: u(8),
        maskImage: `linear-gradient(#000 0 0), radial-gradient(circle at center, transparent ${hole}, #000 calc(${hole} + 0.5px))`,
        maskSize: `100% 100%, ${step} ${step}`,
        maskPosition: `0 0, calc(${step} / -2) calc(${step} / -2)`,
        maskClip: "content-box, border-box",
        maskComposite: "add",
        WebkitMaskComposite: "source-over",
        filter: "drop-shadow(0 1px 1px rgb(0 0 0 / .15))",
      }}
    >
      <div className="relative flex size-full flex-col justify-between bg-[#d52b1e] text-white" style={{ padding: u(7) }}>
        <span className="self-end font-grotesk font-bold leading-none" style={{ fontSize: u(15) }}>
          120
        </span>
        <svg viewBox="0 0 32 32" className="mx-auto" style={{ width: u(40) }}>
          <path fill="#fff" d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" />
        </svg>
        <span className="font-grotesk font-semibold uppercase leading-none" style={{ fontSize: u(10), letterSpacing: "0.18em" }}>
          Helvetia
        </span>
      </div>
    </div>
  );
}

/* ---------- Sticky note ---------- */

export function StickyNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        width: u(168),
        height: u(160),
        padding: `${u(26)} ${u(16)} ${u(16)}`,
        background: "linear-gradient(170deg, #fbe38a 0%, #f6d467 70%, #efc653 100%)",
        boxShadow: "0 1px 1px rgb(0 0 0 / .08), 0 14px 18px -14px rgb(0 0 0 / .4)",
        borderBottomRightRadius: u(18),
      }}
    >
      <p className="font-hand leading-[0.95] text-[#2b2a27]" style={{ fontSize: u(31) }}>
        {children}
      </p>
      <Tape style={{ top: u(-10), left: u(44) }} rotate={2} />
    </div>
  );
}

/* ---------- Ticket stub ---------- */

export function Ticket() {
  const notch = u(9);
  return (
    <div
      className="relative flex font-type text-[#3a2f24]"
      style={{
        width: u(236),
        height: u(92),
        background: "linear-gradient(180deg, #f3e9d3, #eadcbd)",
        maskImage: `radial-gradient(circle at 0 50%, transparent ${notch}, #000 calc(${notch} + 0.5px)), radial-gradient(circle at 100% 50%, transparent ${notch}, #000 calc(${notch} + 0.5px))`,
        maskSize: "51% 100%",
        maskPosition: "left, right",
        maskRepeat: "no-repeat",
      }}
    >
      <div
        className="flex items-center justify-center border-r-2 border-dashed border-[#c9b48c] font-grotesk font-bold uppercase text-[#c0392b]"
        style={{ width: u(46), fontSize: u(11), letterSpacing: "0.2em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Admit one
      </div>
      <div className="flex flex-1 flex-col justify-between" style={{ padding: `${u(10)} ${u(14)}` }}>
        <div className="flex items-baseline justify-between" style={{ fontSize: u(10) }}>
          <span>Nº 000124</span>
          <span>24·09·26</span>
        </div>
        <div className="font-serif italic leading-none text-[#2b2118]" style={{ fontSize: u(25) }}>
          Late show
        </div>
        <div className="flex justify-between" style={{ fontSize: u(9.5) }}>
          <span>ROW F</span>
          <span>SEAT 12</span>
          <span>CHF 18.–</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Film strip ---------- */

export function FilmStrip() {
  const frames = [
    "linear-gradient(160deg, #8fb4c9, #34566b)",
    "linear-gradient(200deg, #e6b979, #9a5a35)",
    "linear-gradient(140deg, #9fbf8f, #3f6149)",
  ];
  const holes = `repeating-linear-gradient(90deg, #efe9dd 0 ${u(6)}, transparent ${u(6)} ${u(14)})`;
  return (
    <div className="relative bg-[#1c1a17]" style={{ width: u(262), padding: `${u(15)} ${u(8)}`, boxShadow: "0 10px 16px -10px rgb(0 0 0 / .5)" }}>
      <span className="absolute inset-x-[4px] opacity-80" style={{ top: u(4), height: u(6), background: holes }} />
      <span className="absolute inset-x-[4px] opacity-80" style={{ bottom: u(4), height: u(6), background: holes }} />
      <div className="flex" style={{ gap: u(6) }}>
        {frames.map((bg, i) => (
          <div key={i} className="grain relative flex-1" style={{ aspectRatio: "4 / 3", background: bg }} />
        ))}
      </div>
      <span className="absolute font-mono text-[#e2a33a]" style={{ fontSize: u(7), right: u(10), bottom: u(-1) }}>
        KODAK 400 ▸ 23
      </span>
    </div>
  );
}

/* ---------- Pressed leaf ---------- */

export function Leaf() {
  return (
    <svg viewBox="0 0 60 110" style={{ width: u(66) }} className="block">
      <path
        d="M30 4c14 16 24 34 22 56-2 20-12 32-22 38C20 92 10 80 8 60 6 38 16 20 30 4z"
        fill="#8a9a5b"
        opacity="0.92"
      />
      <path d="M30 6v100" stroke="#5f6d3a" strokeWidth="1.2" fill="none" />
      {[22, 34, 46, 58, 70, 82].map((y, i) => (
        <g key={y} stroke="#6b7a44" strokeWidth="0.8" fill="none" opacity="0.8">
          <path d={`M30 ${y + 6} Q${38 + i} ${y + 2} ${46 - i * 1.5} ${y - 6}`} />
          <path d={`M30 ${y + 6} Q${22 - i} ${y + 2} ${14 + i * 1.5} ${y - 6}`} />
        </g>
      ))}
    </svg>
  );
}

/* ---------- Smiley sticker ---------- */

export function Smiley() {
  return (
    <div
      className="grid place-items-center rounded-full bg-[#f4c542]"
      style={{ width: u(66), height: u(66), boxShadow: `0 0 0 ${u(3)} #fff, 0 3px 6px rgb(0 0 0 / .2)` }}
    >
      <svg viewBox="0 0 24 24" style={{ width: u(40) }}>
        <circle cx="8.5" cy="9.5" r="1.5" fill="#1d1b18" />
        <circle cx="15.5" cy="9.5" r="1.5" fill="#1d1b18" />
        <path d="M7 14c1.2 2 2.9 3 5 3s3.8-1 5-3" fill="none" stroke="#1d1b18" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ---------- Receipt ---------- */

export function Receipt({ lines }: { lines: [string, string][] }) {
  const zig = u(7);
  return (
    <div
      className="relative bg-[#fbfaf6] font-mono uppercase text-[#3b3a36]"
      style={{
        width: u(158),
        padding: `${u(14)} ${u(12)} ${u(22)}`,
        fontSize: u(8.5),
        lineHeight: 1.7,
        maskImage: `linear-gradient(#000 0 0), conic-gradient(from -45deg at bottom, transparent 90deg, #000 0)`,
        maskSize: `100% calc(100% - ${zig}), calc(${zig} * 2) ${zig}`,
        maskPosition: "top, bottom",
        maskRepeat: "no-repeat, repeat-x",
        boxShadow: "0 1px 2px rgb(0 0 0 / .1)",
      }}
    >
      <div className="text-center font-bold" style={{ fontSize: u(11), letterSpacing: "0.2em" }}>
        Currently
      </div>
      <div className="text-center opacity-60">{"*".repeat(22)}</div>
      {lines.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-2">
          <span>{k}</span>
          <span className="truncate text-right">{v}</span>
        </div>
      ))}
      <div className="text-center opacity-60">{"*".repeat(22)}</div>
      <div className="text-center">thanks for stopping by</div>
      {/* barcode */}
      <div
        className="mx-auto"
        style={{
          marginTop: u(6),
          height: u(18),
          width: "80%",
          background: "repeating-linear-gradient(90deg, #3b3a36 0 1px, transparent 1px 3px, #3b3a36 3px 5px, transparent 5px 6px, #3b3a36 6px 7px, transparent 7px 10px)",
        }}
      />
    </div>
  );
}

/* ---------- Coffee ring (background, not draggable) ---------- */

export function CoffeeRing() {
  return (
    <svg viewBox="0 0 120 120" style={{ width: u(150) }} className="block mix-blend-multiply">
      <circle cx="60" cy="60" r="48" fill="none" stroke="#a8763e" strokeOpacity="0.09" strokeWidth="4" strokeDasharray="120 8 60 4 200 14" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#a8763e" strokeOpacity="0.05" strokeWidth="2" />
      <path d="M100 30 q6 -8 10 -4" stroke="#a8763e" strokeOpacity="0.08" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
