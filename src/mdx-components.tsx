import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Figure, Gallery, ZoomImage } from "@/components/mdx/media";
import { Callout, Divider, Mark, PullQuote, Scribble } from "@/components/mdx/text";

/*
 * How markdown looks inside notes, plus the components every note can use
 * without importing anything: <Figure>, <Gallery>, <Mark>, <Scribble>,
 * <PullQuote>, <Callout>, <Divider>.
 */

const components: MDXComponents = {
  h2: ({ children, id }) => (
    <h2 id={id} className="mt-14 mb-4 font-serif text-[2rem] leading-tight tracking-[-0.01em] text-fg">
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className="mt-10 mb-3 font-sans text-[1.05rem] font-semibold tracking-tight text-fg">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-5">{children}</p>,
  a: ({ href = "", children }) => {
    const external = /^https?:/.test(href);
    const cls =
      "text-fg underline decoration-accent/50 decoration-[1.5px] underline-offset-[4px] transition-[text-decoration-color] duration-300 hover:decoration-accent";
    return external ? (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  },
  ul: ({ children }) => <ul className="my-5 list-none space-y-2 pl-0 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-1 [&>li]:before:top-[0.1em] [&>li]:before:text-accent [&>li]:before:content-['–']">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:font-sans marker:text-[0.85em] marker:text-muted">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-accent pl-5 italic text-fg/75 [&>p]:my-2">{children}</blockquote>
  ),
  hr: () => <Divider />,
  code: ({ children }) => (
    <code className="rounded-md bg-fg/[0.07] px-1.5 py-0.5 font-mono text-[0.82em] text-fg">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-8 overflow-x-auto rounded-2xl border border-line bg-fg/[0.04] p-5 font-mono text-[13px] leading-relaxed [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => <ZoomImage src={typeof src === "string" ? src : undefined} alt={alt} />,
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto font-sans text-[14px]">
      <table className="w-full border-collapse [&_td]:border-b [&_td]:border-line [&_td]:py-2 [&_td]:pr-4 [&_th]:border-b [&_th]:border-fg/30 [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-medium">
        {children}
      </table>
    </div>
  ),
  Figure,
  Gallery,
  Mark,
  Scribble,
  PullQuote,
  Callout,
  Divider,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
