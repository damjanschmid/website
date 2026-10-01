// Runs after `next build`: puts the ASCII signature at the very top of every
// prerendered page, above <!DOCTYPE html>. React can't render a bare HTML
// comment, so this is the only way to get it truly first.
// Comments before the doctype are valid HTML and don't trigger quirks mode.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const signature = readFileSync(new URL("./signature.txt", import.meta.url), "utf8").trim() + "\n";
const root = join(process.cwd(), ".next/server/app");

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

let signed = 0;
for (const file of htmlFiles(root)) {
  const html = readFileSync(file, "utf8");
  if (html.startsWith(signature)) continue; // already signed
  writeFileSync(file, signature + html);
  signed++;
}

console.log(`✓ Signed ${signed} page${signed === 1 ? "" : "s"}`);
