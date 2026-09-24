import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/*
 * Notes live in /content/notes as .mdx files with frontmatter:
 *
 *   ---
 *   title: Everything is mixed media
 *   date: 2026-09-20
 *   description: One line that shows up in the list.
 *   category: Thoughts
 *   accent: "#e8b04b"   # optional, tints links and highlights in this note
 *   draft: true         # optional, only visible in dev
 *   ---
 */

const dir = path.join(process.cwd(), "content/notes");

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  category: string;
  accent?: string;
  draft: boolean;
  readingMinutes: number;
};

function read(file: string): NoteMeta {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: String(data.title ?? file),
    date,
    description: data.description,
    category: data.category ?? "Unsorted",
    accent: data.accent,
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.round(words / 230)),
  };
}

const showDrafts = process.env.NODE_ENV === "development";

export function getNotes(): NoteMeta[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map(read)
    .filter((n) => showDrafts || !n.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNote(slug: string) {
  return getNotes().find((n) => n.slug === slug);
}

export function formatDate(date: string, style: "short" | "long" = "long") {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: style === "long" ? "numeric" : undefined,
  });
}
