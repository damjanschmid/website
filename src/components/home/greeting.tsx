"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { firstGreeting, nextGreeting, secretGreetings, type Greeting as G } from "@/content/greetings";
import { ShuffleIcon } from "@/components/icons";
import { celebrate } from "@/components/easter-eggs";

const SECRET_AFTER = 7;

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

export function Greeting() {
  const [greeting, setGreeting] = useState<G | null>(null);
  const [key, setKey] = useState(0);
  const clicks = useRef(0);
  const visits = useRef(1);

  useEffect(() => {
    visits.current = visitCount();
    setGreeting(firstGreeting({ now: new Date(), visits: visits.current }));
  }, []);

  // typing my name anywhere on the page gets a reaction
  useEffect(() => {
    const onName = () => {
      setGreeting({ text: "Hey, that's my name" });
      setKey((k) => k + 1);
    };
    window.addEventListener("easter:name", onName);
    return () => window.removeEventListener("easter:name", onName);
  }, []);

  function shuffle() {
    if (!greeting) return;
    clicks.current += 1;
    if (clicks.current % SECRET_AFTER === 0) {
      const secret = secretGreetings[Math.floor(clicks.current / SECRET_AFTER - 1) % secretGreetings.length];
      setGreeting(secret);
      celebrate();
    } else {
      setGreeting(nextGreeting({ now: new Date(), visits: visits.current }, greeting));
    }
    setKey((k) => k + 1);
  }

  return (
    <motion.div initial="rest" animate="rest" whileHover="hover" className="relative">
      <h1 className="font-serif text-[clamp(3rem,7.5vw,5.75rem)] leading-[0.95] tracking-[-0.02em] text-fg">
        <motion.button
          type="button"
          onClick={shuffle}
          whileTap={{ scale: 0.985 }}
          aria-label={greeting ? `${greeting.text}. Click for another greeting.` : "Hello"}
          className="-mx-2 block min-h-[1.9em] cursor-pointer rounded-2xl px-2 text-left outline-none sm:min-h-[1em]"
        >
          <span aria-hidden>
            <AnimatePresence mode="wait" initial={false}>
              {greeting && <Letters key={key} text={greeting.text} />}
            </AnimatePresence>
          </span>
        </motion.button>
      </h1>
      <button
        type="button"
        onClick={shuffle}
        tabIndex={-1}
        className="mt-3 flex h-5 cursor-pointer items-center gap-2 text-[13px] text-muted"
      >
        <motion.span
          variants={{ rest: { opacity: 0.55 }, hover: { opacity: 1 } }}
          className="inline-flex items-center gap-1.5"
        >
          <ShuffleIcon size={13} strokeWidth={1.8} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={greeting?.note ?? "default"}
              initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
              transition={{ duration: 0.25 }}
            >
              {greeting?.note ?? "click for another hello"}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </button>
    </motion.div>
  );
}

function Letters({ text }: { text: string }) {
  const words = text.split(" ");
  let index = 0;
  return (
    <motion.span className="inline" exit={{ opacity: 0, filter: "blur(10px)", y: -12, transition: { duration: 0.22 } }}>
      {words.map((word, w) => (
        <Fragment key={w}>
        <span className="inline-block whitespace-nowrap">
          {word.split("").map((char) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: "0.35em", filter: "blur(12px)", rotate: 6 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 + i * 0.028 }}
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
