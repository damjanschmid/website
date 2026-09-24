/*
 * Resources: articles, books, tools, people and places for inspiration.
 * A starter list, swap in your own. Types are free-form, a new type shows
 * up as a new filter. Books get a spine on the shelf (pick a colour!).
 */

export type Resource = {
  title: string;
  url: string;
  type: "Article" | "Book" | "Tool" | "Person" | "Inspiration" | (string & {});
  by?: string;
  year?: number;
  note?: string;
  /** book spine colour */
  color?: string;
};

export const resources: Resource[] = [
  // Inspiration
  { title: "Design Spells", url: "https://designspells.com", type: "Inspiration", note: "Design details that feel like magic. A collection of tiny delights." },
  { title: "Detail", url: "https://detail.design", type: "Inspiration", by: "Rene Wang", note: "The small decisions that make products feel considered." },
  { title: "Are.na", url: "https://www.are.na", type: "Inspiration", note: "A calm place to collect things and connect ideas. Basically a collage tool." },
  { title: "Cosmos", url: "https://www.cosmos.so", type: "Inspiration", note: "Moodboards without the noise." },

  // People
  { title: "Chester How", url: "https://chester.how", type: "Person", note: "A digital garden with projects built mostly for fun." },
  { title: "Stefan Wittwer", url: "https://www.stefanwittwer.com/writing", type: "Person", note: "Clear writing on product, design and trade-offs." },
  { title: "Lee Robinson", url: "https://leerob.com", type: "Person", note: "Minimal personal site, maximum signal." },

  // Articles
  { title: "Taste for Makers", url: "https://paulgraham.com/taste.html", type: "Article", by: "Paul Graham", year: 2002, note: "Taste isn't just personal preference. There's such a thing as good." },
  { title: "How to Do Great Work", url: "https://paulgraham.com/greatwork.html", type: "Article", by: "Paul Graham", year: 2023, note: "Curiosity, delight and the desire to do something impressive." },
  { title: "Invisible Details of Interaction Design", url: "https://rauno.me/craft/interaction-design", type: "Article", by: "Rauno Freiberg", note: "Why some interfaces feel right and others don't." },

  // Books
  { title: "Grid Systems in Graphic Design", url: "https://en.wikipedia.org/wiki/Josef_M%C3%BCller-Brockmann", type: "Book", by: "Josef Müller-Brockmann", year: 1981, color: "#ff3d00", note: "The Swiss bible. This page borrows from it." },
  { title: "Less but Better", url: "https://en.wikipedia.org/wiki/Dieter_Rams", type: "Book", by: "Dieter Rams", year: 1995, color: "#d8d4ca", note: "Ten principles for good design, and the reason the homepage has a speaker." },
  { title: "Steal Like an Artist", url: "https://austinkleon.com/steal/", type: "Book", by: "Austin Kleon", year: 2012, color: "#101010", note: "Nothing is original. Collect what you love and remix it." },
  { title: "The Design of Everyday Things", url: "https://en.wikipedia.org/wiki/The_Design_of_Everyday_Things", type: "Book", by: "Don Norman", year: 1988, color: "#2f5bd3", note: "Why doors are hard to open." },
  { title: "Thinking with Type", url: "https://thinkingwithtype.com", type: "Book", by: "Ellen Lupton", year: 2004, color: "#f4c542", note: "Typography, explained properly." },
  { title: "Shape Up", url: "https://basecamp.com/shapeup", type: "Book", by: "Ryan Singer", year: 2019, color: "#3a7d5c", note: "Shaping work before building it. Free to read online." },
  { title: "The Creative Act", url: "https://en.wikipedia.org/wiki/The_Creative_Act:_A_Way_of_Being", type: "Book", by: "Rick Rubin", year: 2023, color: "#efe7da", note: "On paying attention." },

  // Tools
  { title: "Motion", url: "https://motion.dev", type: "Tool", note: "The animation library behind every wiggle on this site." },
  { title: "Figma", url: "https://www.figma.com", type: "Tool" },
  { title: "Raycast", url: "https://www.raycast.com", type: "Tool", note: "The launcher I'd miss most." },
];
