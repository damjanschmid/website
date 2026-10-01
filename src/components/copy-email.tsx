"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, MailIcon } from "@/components/icons";

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

/*
 * Shows my email. Click it and it copies to the clipboard:
 * the envelope turns into a check, the text rolls over and
 * a few sparks fly. Falls back to mailto: if copying fails.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const width = useSpring(0, spring);
  const pillWidth = useTransform(width, (w) => (w === 0 ? "auto" : w));
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  // watch the content's natural width so the pill can spring to it
  const measure = useCallback((el: HTMLSpanElement | null) => {
    observer.current?.disconnect();
    if (!el) return;
    observer.current = new ResizeObserver(([entry]) => {
      const w = entry.borderBoxSize[0].inlineSize;
      // first measurement snaps, later ones spring
      if (width.get() === 0) width.jump(w);
      else width.set(w);
    });
    observer.current.observe(el);
  }, [width]);

  async function copy() {
    const ok = await writeToClipboard(email);
    if (!ok) {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    setBurst((b) => b + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  const label = copied ? "Copied to clipboard" : email;

  return (
    <div className="flex">
      <span className="relative">
        <motion.button
          type="button"
          onClick={copy}
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          transition={spring}
          aria-label={copied ? "Email copied to clipboard" : `Copy email address ${email}`}
          style={{ width: pillWidth }}
          className="relative flex h-11 cursor-pointer items-center overflow-hidden rounded-full bg-[#f4f4f5] text-[14px] font-medium text-fg ring-1 ring-black/[0.06] transition-colors duration-200 hover:bg-[#ededee]"
        >
          {/* sheen that sweeps across on hover */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/90 to-transparent"
            variants={{ rest: { x: "0%" }, hover: { x: "500%", transition: { duration: 0.8, ease: "easeInOut" } } }}
          />

          {/* natural-width content; the button animates to match it */}
          <span ref={measure} className="flex w-max shrink-0 items-center gap-2.5 pr-5 pl-4">
            {/* icons stack on top of each other and cross-fade */}
            <span className="relative size-[18px] shrink-0">
              <AnimatePresence initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    className="absolute inset-0 grid place-items-center text-[#16a34a]"
                    initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.15 } }}
                    transition={spring}
                  >
                    <CheckIcon size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="mail"
                    className="absolute inset-0 grid place-items-center text-muted"
                    initial={{ scale: 0.4, opacity: 0, rotate: 45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.4, opacity: 0, y: -6, transition: { duration: 0.15 } }}
                    transition={spring}
                  >
                    <MailIcon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>

            {/*
              An invisible copy of the current label sets the width right away.
              The visible labels sit on top of it, so the outgoing one can roll
              away without pushing anything around.
            */}
            <span className="relative whitespace-nowrap">
              <span aria-hidden className="invisible">
                {label}
              </span>
              <AnimatePresence initial={false}>
                <RollingText key={label} text={label} />
              </AnimatePresence>
            </span>
          </span>
        </motion.button>
        {/* outside the button so they aren't clipped */}
        <span className="pointer-events-none absolute top-1/2 left-[25px]">
          <Sparks key={burst} show={burst > 0} />
        </span>
      </span>

    </div>
  );
}

// The async clipboard API is blocked in some embedded browsers,
// so fall back to the old textarea trick before giving up.
async function writeToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

/* Letters slide up one after another; on the way out they all leave together */
function RollingText({ text }: { text: string }) {
  return (
    <motion.span
      className="absolute inset-y-0 left-0 inline-flex"
      exit={{ y: "-90%", opacity: 0, filter: "blur(4px)", transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ y: "100%", opacity: 0, filter: "blur(3px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.04 + i * 0.012 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* A little burst of sparks from the icon */
function Sparks({ show }: { show: boolean }) {
  if (!show) return null;
  const n = 9;
  return (
    <span aria-hidden className="absolute">
      {Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 + 0.3;
        const dist = 22 + (i % 3) * 7;
        return (
          <motion.span
            key={i}
            className="absolute -mt-[2px] -ml-[2px] size-[4px] rounded-full"
            style={{ background: i % 3 === 0 ? "var(--accent)" : i % 3 === 1 ? "#16a34a" : "#f4c542" }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: [0, 1.4, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </span>
  );
}
