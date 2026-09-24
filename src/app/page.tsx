import { Bio } from "@/components/home/bio";
import { Collage } from "@/components/home/collage";
import { Greeting } from "@/components/home/greeting";
import { ArrowUpRightIcon, HoverIcon } from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main data-theme="paper" className="paper-texture relative min-h-dvh overflow-x-clip">
      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <Reveal y={-6} className="flex items-center gap-2.5 text-[14px] font-medium tracking-tight">
          <span className="size-2.5 rounded-full bg-accent" />
          {site.name}
        </Reveal>
        <Reveal y={-6} delay={0.1}>
          <LocalTime timeZone={site.timeZone} label={site.location} />
        </Reveal>
      </header>

      <section className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 pt-14 pb-36 sm:px-10 lg:min-h-[calc(100dvh-80px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pt-4 lg:pb-28">
        <div className="relative z-10 lg:pb-10">
          <Greeting />
          <Reveal delay={0.5} className="mt-10">
            <Bio />
          </Reveal>
          <Reveal delay={0.7} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
            {site.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-fg">
                <HoverIcon className="inline-flex items-center gap-1">
                  <span className="link-draw">{l.label}</span>
                  <ArrowUpRightIcon size={13} className="text-muted transition-colors group-hover:text-accent" />
                </HoverIcon>
              </a>
            ))}
          </Reveal>
        </div>

        <div className="relative -mx-2 sm:mx-0">
          <Collage />
        </div>
      </section>
    </main>
  );
}
