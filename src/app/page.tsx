import { AvatarSpinner } from "@/components/avatar-spinner";
import { CopyEmail } from "@/components/copy-email";
import { Greeting } from "@/components/greeting";
import { LocalTime } from "@/components/local-time";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import pkg from "../../package.json";

export default function Home() {
  return (
    <main className="relative grid min-h-dvh place-items-center px-6 pt-16 pb-24">
      <section className="w-full max-w-[520px]">
        <AvatarSpinner src="/me.jpg" alt={site.name} />

        <div className="mt-8">
          <Greeting />
        </div>

        {/* Placeholder bio. Rewrite this in your own words. */}
        <Reveal delay={0.35} className="mt-6 max-w-[34rem] space-y-4 text-[17px] leading-[1.6] text-fg/75">
          <p>
            I&apos;m {site.firstName}. I like making things that feel good to use, and I collect a lot along the way:
            links, books, songs, photos, half-finished ideas.
          </p>
          <p>Based in {site.location}. Always up for a good conversation.</p>
        </Reveal>

        <Reveal delay={0.5} className="mt-9">
          <CopyEmail email={site.email} />
        </Reveal>
      </section>

      <footer className="fixed inset-x-0 bottom-0 flex items-center justify-between px-6 pb-5 font-mono text-[12px] leading-[18px] text-muted sm:px-8 sm:pb-6">
        <Reveal y={6} delay={0.7}>
          <LocalTime timeZone={site.timeZone} place={site.location} />
        </Reveal>
        <Reveal y={6} delay={0.8}>
          <a href={site.repo} target="_blank" rel="noreferrer" className="link-draw transition-colors hover:text-fg" title="Source on GitHub">
            v{pkg.version}
          </a>
        </Reveal>
      </footer>
    </main>
  );
}
