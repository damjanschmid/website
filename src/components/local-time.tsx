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
export function LocalTime({ timeZone, place }: { timeZone: string; place: string }) {
  const [t, setT] = useState<{ hour: string; minute: string } | null>(null);

  useEffect(() => {
    const tick = () => setT(timeParts(timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span className="inline-flex items-center gap-[0.6em] tabular-nums">
      <span className="inline-flex">
        {t ? (
          <>
            <Digits value={t.hour} />
            <span className="animate-pulse">:</span>
            <Digits value={t.minute} />
          </>
        ) : (
          <span className="opacity-0">00:00</span>
        )}
      </span>
      <span>{place}</span>
    </span>
  );
}

function Digits({ value }: { value: string }) {
  return (
    <span className="inline-flex">
      {value.split("").map((d, i) => (
        <span key={i} className="relative inline-block h-[1lh] overflow-hidden">
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
