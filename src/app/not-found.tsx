import Link from "next/link";
import { RansomNote } from "@/components/ransom-note";

export default function NotFound() {
  return (
    <main data-theme="paper" className="paper-texture grid min-h-dvh place-items-center px-6 pb-24">
      <div className="text-center">
        <RansomNote text="404" />
        <h1 className="mt-10 font-serif text-[clamp(2rem,5vw,3rem)] leading-tight">This page wandered off.</h1>
        <p className="mt-3 text-[15px] text-muted">
          Maybe it&apos;s on <Link href="/else" className="text-fg underline decoration-accent underline-offset-4">the canvas</Link> somewhere. Or{" "}
          <Link href="/" className="text-fg underline decoration-accent underline-offset-4">go home</Link>.
        </p>
      </div>
    </main>
  );
}
