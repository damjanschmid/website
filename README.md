# website

My corner of the internet. Four pages, four moods:

| Page | Route | Style |
| --- | --- | --- |
| Home | `/` | Paper. A short bio and a collage you can rearrange, with a speaker that shows what I'm listening to. |
| Notes | `/notes` | Ink. Dark, quiet, editorial. MDX with categories. |
| Resources | `/resources` | Swiss. Articles, books, tools and people. Books live on a shelf. |
| Everything else | `/else` | Graphite. An infinite canvas for projects, pictures and random stuff. |

Colours morph between pages as you navigate, and a dock at the bottom ties it all together.

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Editing content

Most things live in `content/`, so you rarely need to touch components.

- **Notes**: add an `.mdx` file to `content/notes/`. The file name is the URL. See `content/notes/field-guide.mdx` (only visible in dev) for everything a note can do: galleries, zoomable figures, highlighter marks, scribbles, pull quotes, callouts, and a per-note accent colour.
- **Resources**: edit `content/resources.ts`. Give books a `color` for their spine.
- **Canvas**: edit `content/canvas.ts`. Every item has world coordinates (`x`, `y`) around the centre.
- **Greetings**: edit `src/content/greetings.ts`.
- **Bio**: edit `src/components/home/bio.tsx`.
- **Collage**: edit the `pieces` list in `src/components/home/collage.tsx`. For a real photo, put it in `public/collage/` and pass `src` to `<Polaroid>`.
- **Name, links, location**: `src/lib/site.ts`.

## Now playing

Copy `.env.example` to `.env.local` and fill in either Last.fm (easiest) or Spotify. Without keys the site shows a rotating demo track.

## Secrets

- The Konami code (↑ ↑ ↓ ↓ ← → ← → B A) anywhere.
- Click the greeting on the homepage a few times.
- Type my name.
- Wander far enough on the canvas.
- Leave the tab.
- Open the console.

## Stack

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, [Motion](https://motion.dev) for animation, MDX for notes. Fonts: Instrument Serif, Newsreader, Geist, Geist Mono, Geist Pixel, Inter Tight, Reenie Beanie and Special Elite.
