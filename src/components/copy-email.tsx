"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlaneIcon } from "@/components/icons";

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;
const bouncy = { type: "spring", stiffness: 500, damping: 18 } as const;

const CALLOUT_MS = 1500; // how long the bubble stays
const COPIED_MS = 2000; // how long the check stays

/*
 * Shows my email. Click it and it copies to the clipboard: the pill holds
 * still, the paper plane pops into a check and a small bubble above says
 * "Copied" for a moment. Falls back to mailto: if copying fails.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [callout, setCallout] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  async function copy() {
    const ok = await writeToClipboard(email);
    if (!ok) {
      window.location.href = `mailto:${email}`;
      return;
    }
    timers.current.forEach(clearTimeout);
    setCopied(true);
    setCallout(true);
    timers.current = [
      setTimeout(() => setCallout(false), CALLOUT_MS),
      setTimeout(() => setCopied(false), COPIED_MS),
    ];
  }

  return (
    <div className="flex">
      <span className="relative">
        <motion.button
          type="button"
          onClick={copy}
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.965 }}
          transition={spring}
          aria-label={copied ? "Email copied to clipboard" : `Copy email address ${email}`}
          className="flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-[#f4f4f5] pr-[17px] pl-3.5 font-sans text-[14px] font-medium tracking-[-0.004em] text-muted ring-1 ring-black/[0.06] transition-colors duration-200 hover:bg-[#ededee]"
        >
          {/* icons stack on top of each other; the plane shrinks away, the check pops in */}
          <span className="relative size-[18px] shrink-0">
            <AnimatePresence initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  className="absolute inset-0 grid place-items-center text-[#1f9d55]"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.15 } }}
                  transition={bouncy}
                >
                  <CheckIcon size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="plane"
                  className="absolute inset-0 grid place-items-center text-muted"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.15 } }}
                  transition={bouncy}
                >
                  <PlaneIcon size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="whitespace-nowrap">{email}</span>
        </motion.button>

        {/* the bubble, centred above the pill */}
        <AnimatePresence>
          {callout && (
            <motion.span
              role="status"
              className="pointer-events-none absolute bottom-full left-1/2 mb-[9px] rounded-lg bg-fg px-2.5 pt-[7px] pb-2 font-sans text-[12px] leading-none font-medium tracking-[0.005em] text-bg"
              initial={{ opacity: 0, y: 6, scale: 0.9, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 4, scale: 0.95, x: "-50%", transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
              transition={bouncy}
            >
              Copied
              <span
                aria-hidden
                className="absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-[5px] rotate-45 rounded-[1.5px] bg-fg"
              />
            </motion.span>
          )}
        </AnimatePresence>
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
