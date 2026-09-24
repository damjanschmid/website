"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

function timeParts(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = parts.find((p) => p.type === "hour")!.value;
  const minute = parts.find((p) => p.type === "minute")!.value;
  return { hour, minute };
}

/* Local time somewhere, with digits that roll over when they change */
export function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [t, setT] = useState<{ hour: string; minute: string } | null>(null);

  useEffect(() => {
    const tick = () => setT(timeParts(timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  const h = t ? Number(t.hour) : 12;
  const asleep = h < 7 || h >= 23;

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[12px] tabular-nums text-muted" title={asleep ? "Probably asleep" : "Probably awake"}>
      <span className="relative flex size-2">
        {!asleep && <span className="absolute inset-0 animate-ping rounded-full bg-[#3fb950] opacity-40" />}
        <span className={`relative size-2 rounded-full ${asleep ? "bg-muted/60" : "bg-[#3fb950]"}`} />
      </span>
      <span>{label}</span>
      <span className="inline-flex overflow-hidden text-fg">
        {t ? (
          <>
            <Digits value={t.hour} />
            <span className="animate-pulse px-px">:</span>
            <Digits value={t.minute} />
          </>
        ) : (
          <span className="opacity-0">00:00</span>
        )}
      </span>
    </span>
  );
}

function Digits({ value }: { value: string }) {
  return (
    <span className="inline-flex">
      {value.split("").map((d, i) => (
        <span key={i} className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2em]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              className="inline-block"
              initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
