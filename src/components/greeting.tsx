"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { firstGreeting, nextGreeting, type Greeting as G } from "@/content/greetings";

function visitCount() {
  try {
    const n = Number(localStorage.getItem("visits") ?? "0") + 1;
    // only count a new visit once per browser session
    if (!sessionStorage.getItem("counted")) {
      localStorage.setItem("visits", String(n));
      sessionStorage.setItem("counted", "1");
      return n;
    }
    return Math.max(1, n - 1);
  } catch {
    return 1;
  }
}

/* A greeting that depends on when (and how often) you visit. Click for another one. */
export function Greeting() {
  const [greeting, setGreeting] = useState<G | null>(null);
  const [key, setKey] = useState(0);
  const visits = useRef(1);

  useEffect(() => {
    visits.current = visitCount();
    // picked on the client because it depends on the visitor's clock
    setGreeting(firstGreeting({ now: new Date(), visits: visits.current }));
  }, []);

  function shuffle() {
    if (!greeting) return;
    setGreeting(nextGreeting({ now: new Date(), visits: visits.current }, greeting));
    setKey((k) => k + 1);
  }

  return (
    <h1 className="font-serif text-[clamp(2.75rem,8vw,4rem)] leading-[1] tracking-[-0.02em] text-fg">
      <motion.button
        type="button"
        onClick={shuffle}
        whileTap={{ scale: 0.98 }}
        title={greeting?.note ?? "Click for another hello"}
        aria-label={greeting ? `${greeting.text}. Click for another greeting.` : "Hello"}
        className="-mx-1 block min-h-[1em] cursor-pointer rounded-xl px-1 text-left outline-none"
      >
        <span aria-hidden>
          <AnimatePresence mode="wait" initial={false}>
            {greeting && <Letters key={key} text={greeting.text} />}
          </AnimatePresence>
        </span>
      </motion.button>
    </h1>
  );
}

function Letters({ text }: { text: string }) {
  const words = text.split(" ");
  let index = 0;
  return (
    <motion.span className="inline" exit={{ opacity: 0, filter: "blur(8px)", y: -10, transition: { duration: 0.2 } }}>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char) => {
              const i = index++;
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.35em", filter: "blur(10px)", rotate: 6 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 + i * 0.026 }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}
