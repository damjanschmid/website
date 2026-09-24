"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

/* ---------- Lightbox ---------- */

function Lightbox({ id, src, alt, onClose }: { id: string; src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[90] grid cursor-zoom-out place-items-center p-4 sm:p-10"
      onClick={onClose}
      initial={{ backgroundColor: "rgb(0 0 0 / 0)", backdropFilter: "blur(0px)" }}
      animate={{ backgroundColor: "rgb(0 0 0 / 0.78)", backdropFilter: "blur(10px)" }}
      exit={{ backgroundColor: "rgb(0 0 0 / 0)", backdropFilter: "blur(0px)" }}
    >
      <motion.img
        layoutId={id}
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      />
    </motion.div>,
    document.body,
  );
}

/* ---------- Figure: an image with a caption. Click to zoom. ---------- */

export function Figure({
  src,
  alt = "",
  caption,
  wide = false,
}: {
  src: string;
  alt?: string;
  caption?: React.ReactNode;
  wide?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <figure className={wide ? "my-12 sm:-mx-20" : "my-10"}>
      <motion.button type="button" onClick={() => setOpen(true)} className="block w-full cursor-zoom-in" whileHover="hover" initial="rest">
        <motion.img
          layoutId={id}
          src={src}
          alt={alt}
          className="block w-full rounded-xl object-cover ring-1 ring-fg/10"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.01 } }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        />
      </motion.button>
      {caption && <figcaption className="mt-3 text-center font-sans text-[13px] text-muted">{caption}</figcaption>}
      <AnimatePresence>{open && <Lightbox id={id} src={src} alt={alt} onClose={() => setOpen(false)} />}</AnimatePresence>
    </figure>
  );
}

/* Plain markdown images, ![alt](src), become zoomable too */
export function ZoomImage({ src, alt = "" }: { src?: string; alt?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  if (!src || typeof src !== "string") return null;
  return (
    <>
      <motion.img
        layoutId={id}
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className="my-8 block w-full cursor-zoom-in rounded-xl ring-1 ring-fg/10"
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      />
      <AnimatePresence>{open && <Lightbox id={id} src={src} alt={alt} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/* ---------- Gallery ---------- */

type Photo = { src: string; alt?: string; caption?: string };

/*
 * variant="stack": a pile of prints that fans out on hover
 * variant="grid":  a simple grid
 */
export function Gallery({ photos, variant = "stack", caption }: { photos: Photo[]; variant?: "stack" | "grid"; caption?: string }) {
  if (variant === "grid") {
    return (
      <figure className="my-12 sm:-mx-20">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => (
            <motion.div
              key={p.src + i}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[4/5] overflow-hidden rounded-lg ring-1 ring-fg/10"
            >
              <Image src={p.src} alt={p.alt ?? ""} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" unoptimized={p.src.endsWith(".svg")} />
            </motion.div>
          ))}
        </div>
        {caption && <figcaption className="mt-3 text-center font-sans text-[13px] text-muted">{caption}</figcaption>}
      </figure>
    );
  }

  const n = photos.length;
  return (
    <figure className="my-14">
      <motion.div className="relative mx-auto flex h-[260px] items-center justify-center sm:h-[300px]" initial="rest" whileHover="spread" whileTap="spread" animate="rest">
        {photos.map((p, i) => {
          const offset = i - (n - 1) / 2;
          return (
            <motion.div
              key={p.src + i}
              className="absolute w-[150px] bg-[#fdfcf8] p-2 pb-8 shadow-[0_2px_4px_rgb(0_0_0/0.2),0_18px_30px_-16px_rgb(0_0_0/0.6)] sm:w-[180px]"
              style={{ zIndex: n - Math.abs(Math.round(offset)) }}
              variants={{
                rest: { x: offset * 14, y: Math.abs(offset) * 4, rotate: offset * 5 + (i % 2 ? 2 : -2) },
                spread: { x: offset * 150, y: Math.abs(offset) * 10, rotate: offset * 4 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: Math.abs(offset) * 0.03 }}
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-300">
                <Image src={p.src} alt={p.alt ?? ""} fill sizes="180px" className="object-cover" unoptimized={p.src.endsWith(".svg")} />
              </div>
              {p.caption && <p className="absolute inset-x-0 bottom-1.5 text-center font-hand text-[20px] leading-none text-[#2b2a27]">{p.caption}</p>}
            </motion.div>
          );
        })}
      </motion.div>
      {caption && <figcaption className="mt-2 text-center font-sans text-[13px] text-muted">{caption}</figcaption>}
    </figure>
  );
}
