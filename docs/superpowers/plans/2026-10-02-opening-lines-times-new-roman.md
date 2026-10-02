# Opening Lines and Times New Roman Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder homepage greetings with Damjan's own lines and set the headline and body in Times New Roman while the footer keeps Geist Mono.

**Architecture:** Two independent edits. The greeting content lives in one data module whose selection functions stay unchanged apart from one new pool. The fonts are Tailwind v4 theme tokens in `globals.css` fed by `next/font` variables from `src/lib/fonts.ts`; two of the three tokens switch to a local font stack and their Google font imports go away.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, `next/font/google`, pnpm. No test runner is installed; verification is `pnpm lint`, `pnpm build` and the dev server in the browser.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-10-02-opening-lines-times-new-roman-design.md`. Copy greeting text and tooltips from it verbatim.
- Selection logic in `src/content/greetings.ts` (time of day double weight, special days first, 40% returning chance, shuffle excludes current) must not change.
- Font stack for serif and sans, exactly: `"Times New Roman", Times, "Nimbus Roman", serif`.
- `--font-mono` keeps Geist Mono via `next/font/google`.
- No markup or class name changes in components. Only `src/content/greetings.ts`, `src/lib/fonts.ts`, `src/app/globals.css` change.
- Dev server is started with the preview tool using the `dev` launch config, never with Bash.
- Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

### Task 1: Greeting content

**Files:**
- Modify: `src/content/greetings.ts` (the pool constants at lines 11-83 and the `candidates` function at lines 92-102)

**Interfaces:**
- Consumes: nothing new.
- Produces: unchanged exports `Greeting`, `candidates`, `firstGreeting`, `nextGreeting`. `src/components/greeting.tsx` keeps working without edits.

- [ ] **Step 1: Replace the pool constants**

Replace everything from the `const morning` line through the end of the `specialDays` array with:

```ts
const morning: Greeting[] = [
  { text: "Early bird" },
  { text: "Morning" },
  { text: "Guete Morge", note: "Swiss German for good morning" },
  { text: "Buongiorno", note: "Italian, one of the four Swiss languages" },
  { text: "Coffee first" },
  { text: "Already at it?" },
  { text: "Ah, you're finally awake", note: "Skyrim, every single time" },
];

const afternoon: Greeting[] = [
  { text: "Hoi", note: "Swiss German for hi" },
  { text: "Buongiorno", note: "Italian, one of the four Swiss languages" },
  { text: "Lunch break?" },
  { text: "En Guete", note: "Swiss German for enjoy your meal" },
  { text: "Taking a break?" },
  { text: "Procrastinating?" },
  { text: "Still at it?" },
];

const evening: Greeting[] = [
  { text: "Evening" },
  { text: "Guete Abig", note: "Swiss German for good evening" },
  { text: "Bonsoir", note: "French, one of the four Swiss languages" },
  { text: "Buonasera", note: "Italian for good evening" },
  { text: "Feierabend?", note: "German for \"done with work for today?\"" },
  { text: "Done for the day?" },
];

const lateNight: Greeting[] = [
  { text: "Night owl" },
  { text: "Up late?" },
  { text: "Still awake?" },
  { text: "Can't sleep?" },
  { text: "Go to bed" },
];

const anytime: Greeting[] = [
  { text: "Salut", note: "French, the casual one" },
  { text: "Hoi", note: "Swiss German for hi" },
  { text: "Grüezi", note: "Swiss German for hello" },
  { text: "Hallo" },
  { text: "Hey" },
  { text: "Ciao", note: "Italian, one of the four Swiss languages" },
  { text: "Bonjour", note: "French, one of the four Swiss languages" },
  { text: "Allegra", note: "Hello in Romansh, the smallest Swiss language" },
  { text: "Hello there", note: "General Kenobi" },
];

// for whoever is on a break or waiting on something
const working: Greeting[] = [
  { text: "Waiting for a build?" },
  { text: "Meeting running late?" },
  { text: "Between things?" },
  { text: "Killing time?" },
  { text: "Stuck on something?" },
  { text: "Quick break?" },
  { text: "Locked in?" },
];

const weekday: Record<number, Greeting[]> = {
  1: [{ text: "Monday, huh" }, { text: "New week" }],
  5: [{ text: "Almost weekend" }, { text: "Friday" }],
  6: [{ text: "Weekend" }, { text: "No work today, right?" }],
  0: [{ text: "Sunday" }, { text: "Slow one today" }],
};

const returning: Greeting[] = [
  { text: "Welcome back" },
  { text: "You again" },
  { text: "Back already?" },
  { text: "Still here?" },
];

// month is 1-based here
const specialDays: { month: number; day: number; greeting: Greeting }[] = [
  { month: 1, day: 1, greeting: { text: "Happy new year" } },
  { month: 8, day: 1, greeting: { text: "Happy 1. August", note: "Swiss National Day" } },
  { month: 10, day: 31, greeting: { text: "Boo" } },
  { month: 12, day: 24, greeting: { text: "Merry Christmas" } },
  { month: 12, day: 25, greeting: { text: "Merry Christmas" } },
  { month: 12, day: 31, greeting: { text: "Almost next year" } },
];
```

Also delete the sentence `These are placeholders, write your own.` from the header comment at the top of the file, keeping the rest of that comment.

- [ ] **Step 2: Add the working pool to `candidates`**

In `candidates`, add `...working,` directly after `...anytime,` so the pool reads:

```ts
  const pool = [
    ...timeOfDay(now.getHours()),
    ...timeOfDay(now.getHours()), // time of day gets double weight
    ...anytime,
    ...working,
    ...(weekday[now.getDay()] ?? []),
    ...(visits > 1 ? returning : []),
  ];
```

- [ ] **Step 3: Lint and type-check**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: no output from eslint, no errors from tsc.

- [ ] **Step 4: Check in the browser**

Start the `dev` launch config with the preview tool and open `http://localhost:3000`. Click the headline several times. Expected: only lines from the spec appear, "Sali" and "Halfway" never appear, the browser tooltip on "Hello there" reads "General Kenobi". No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/greetings.ts
git commit -m "Write my own opening lines

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Times New Roman for headline and body

**Files:**
- Modify: `src/lib/fonts.ts` (whole file)
- Modify: `src/app/globals.css:20-22`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `fontVariables` export from `src/lib/fonts.ts` still exists and is still a string, so `src/app/layout.tsx` needs no edit.

- [ ] **Step 1: Drop Geist and Instrument Serif from `src/lib/fonts.ts`**

Replace the whole file with:

```ts
import { Geist_Mono } from "next/font/google";

// headline and body use the local Times New Roman stack, see globals.css
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const fontVariables = geistMono.variable;
```

- [ ] **Step 2: Point the serif and sans tokens at Times New Roman**

In `src/app/globals.css`, replace lines 20-22 with:

```css
  --font-sans: "Times New Roman", Times, "Nimbus Roman", serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --font-serif: "Times New Roman", Times, "Nimbus Roman", serif;
```

- [ ] **Step 3: Lint and build**

Run: `pnpm lint && pnpm build`
Expected: eslint silent, build finishes with the `/` route listed and no warnings about fonts.

- [ ] **Step 4: Check in the browser**

With the dev server from Task 1 still running, reload `http://localhost:3000`. Use the browser JavaScript tool to read computed fonts:

```js
[
  getComputedStyle(document.querySelector("h1")).fontFamily,
  getComputedStyle(document.querySelector("main p")).fontFamily,
  getComputedStyle(document.querySelector("footer")).fontFamily,
]
```

Expected: the first two start with `"Times New Roman"`, the third contains `Geist Mono`. Check the network panel: no requests for Geist (non-mono) or Instrument Serif font files. No console errors. Take a screenshot for the final report.

- [ ] **Step 5: Commit**

```bash
git add src/lib/fonts.ts src/app/globals.css
git commit -m "Set the headline and body in Times New Roman

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```
