/*
 * Everything on the "Everything else" canvas.
 * x / y are world coordinates of the item's centre (0,0 is the middle).
 * Add, move and delete freely. Many of these are placeholders.
 */

export type CanvasItem = { id: string; x: number; y: number; rotate?: number } & (
  | { kind: "project"; title: string; year: string; description: string; tags: string[]; href?: string; cover: string }
  | { kind: "photo"; src: string; caption?: string; width?: number }
  | { kind: "sticky"; text: string; color: string }
  | { kind: "quote"; text: string; by: string }
  | { kind: "handwriting"; text: string; size?: number }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "music" }
  | { kind: "swatches"; colors: { hex: string; name: string }[] }
  | { kind: "cassette"; label: string }
  | { kind: "pin"; place: string; coords: string }
  | { kind: "egg" }
);

export const canvasItems: CanvasItem[] = [
  { id: "hello", kind: "handwriting", x: 0, y: -40, text: "hello, wanderer", size: 64, rotate: -3 },
  { id: "hint", kind: "handwriting", x: 20, y: 40, text: "drag anywhere to look around", size: 26, rotate: -2 },

  {
    id: "this-site",
    kind: "project",
    x: -560,
    y: -200,
    rotate: -2,
    title: "This website",
    year: "2026",
    description: "The thing you're looking at. Next.js, Motion and far too many hours spent on hover states.",
    tags: ["Design", "Code"],
    href: "https://github.com/damjanschmid/website",
    cover: "linear-gradient(135deg, #f2eee6 0%, #e2542b 55%, #1d1b18 100%)",
  },
  {
    id: "project-2",
    kind: "project",
    x: 560,
    y: -330,
    rotate: 2.5,
    title: "Project 02",
    year: "2025",
    description: "Placeholder. Put something you made here, in content/canvas.ts.",
    tags: ["Placeholder"],
    cover: "linear-gradient(160deg, #2f5bd3, #8fb4c9)",
  },
  {
    id: "project-3",
    kind: "project",
    x: -120,
    y: 470,
    rotate: 1,
    title: "Project 03",
    year: "2024",
    description: "Another placeholder. Projects can link somewhere, have tags and a cover.",
    tags: ["Placeholder", "Side project"],
    cover: "linear-gradient(200deg, #c8f560, #3a7d5c)",
  },

  { id: "photo-lake", kind: "photo", x: -920, y: 120, rotate: -6, src: "/notes/lake.svg", caption: "a lake, somewhere" },
  { id: "photo-dune", kind: "photo", x: 320, y: 210, rotate: 5, src: "/notes/dune.svg", caption: "hot" },
  { id: "photo-forest", kind: "photo", x: 980, y: 160, rotate: -3, src: "/notes/forest.svg", caption: "sunday walk" },
  { id: "photo-city", kind: "photo", x: -620, y: 560, rotate: 4, src: "/notes/city.svg", caption: "late" },
  { id: "photo-paper", kind: "photo", x: 760, y: 620, rotate: -5, src: "/notes/paper.svg", caption: "scraps", width: 260 },

  { id: "sticky-1", kind: "sticky", x: -280, y: -520, rotate: 4, text: "ideas > plans", color: "#fbe38a" },
  { id: "sticky-2", kind: "sticky", x: 1180, y: -120, rotate: -5, text: "more stuff coming, promise", color: "#f7b7c8" },
  { id: "sticky-3", kind: "sticky", x: -1180, y: -300, rotate: 3, text: "stay curious", color: "#b9e4c9" },

  { id: "eames", kind: "quote", x: 80, y: -560, text: "The details are not the details. They make the design.", by: "Charles Eames" },

  { id: "someday", kind: "list", x: -960, y: -620, rotate: -2, title: "Someday", items: ["a zine", "a typeface", "a tiny app", "something with sound", "this list, finished"] },

  { id: "music", kind: "music", x: 600, y: 10 },
  { id: "tape", kind: "cassette", x: -380, y: 150, rotate: -8, label: "mixtape vol. 1" },

  {
    id: "palette",
    kind: "swatches",
    x: 1240,
    y: 420,
    rotate: 3,
    colors: [
      { hex: "#f2eee6", name: "Paper" },
      { hex: "#121110", name: "Ink" },
      { hex: "#ff3d00", name: "Signal" },
      { hex: "#c8f560", name: "Acid" },
    ],
  },

  { id: "pin", kind: "pin", x: 40, y: 860, rotate: -2, place: "Zürich", coords: "47.3769° N, 8.5417° E" },

  { id: "edge", kind: "handwriting", x: 2600, y: 1900, text: "you found the edge. there is no edge.", size: 34, rotate: 4 },
  { id: "egg", kind: "egg", x: -2400, y: 1700 },
];
