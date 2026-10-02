# Opening lines and Times New Roman

Date: 2026-10-02

## Goal

Replace the placeholder greetings on the homepage with lines Damjan would actually say, and set the whole page in Times New Roman.

## Scope

- `src/content/greetings.ts`: new greeting content. The selection logic (time of day, weekday, returning visitor, special days, shuffle on click) stays as is, with one addition: a new "waiting or working" pool.
- `src/lib/fonts.ts` and `src/app/globals.css`: all three font tokens point at a local Times New Roman stack. Google font loading is removed.
- `src/app/layout.tsx`: drop the font variable class names once the Google fonts are gone.

Nothing else on the page changes.

## Voice

Casual, spoken, multilingual the way Zürich is (Swiss German, French, Italian, Romansh). Lines may acknowledge that the visitor is probably on a break or waiting on something. No jokes about the website itself, no corporate tone, nothing out of character. Two insider references are allowed, each explained in its tooltip.

## Greeting pools

Tooltips (`note`) are given in parentheses. Lines without one have no tooltip.

Morning, 5 to 12:
Early bird · Morning · Guete Morge (Swiss German for good morning) · Buongiorno (Italian, one of the four Swiss languages) · Coffee first · Already at it? · Ah, you're finally awake (Skyrim, every single time)

Afternoon, 12 to 18:
Hoi (Swiss German for hi) · Buongiorno (Italian, one of the four Swiss languages) · Lunch break? · En Guete (Swiss German for enjoy your meal) · Taking a break? · Procrastinating? · Still at it?

Evening, 18 to 23:
Evening · Guete Abig (Swiss German for good evening) · Bonsoir (French, one of the four Swiss languages) · Buonasera (Italian for good evening) · Feierabend? (German for "done with work for today?") · Done for the day?

Late night, 23 to 5:
Night owl · Up late? · Still awake? · Can't sleep? · Go to bed

Anytime:
Salut (French, the casual one) · Hoi (Swiss German for hi) · Grüezi (Swiss German for hello) · Hallo · Hey · Ciao (Italian, one of the four Swiss languages) · Bonjour (French, one of the four Swiss languages) · Allegra (Hello in Romansh, the smallest Swiss language) · Hello there (General Kenobi)

Waiting or working, anytime, single weight (time of day keeps double weight):
Waiting for a build? · Meeting running late? · Between things? · Killing time? · Stuck on something? · Quick break? · Locked in?

Weekday:
Monday: Monday, huh · New week
Friday: Almost weekend · Friday
Saturday: Weekend · No work today, right?
Sunday: Sunday · Slow one today
Wednesday has no line.

Returning visitor:
Welcome back · You again · Back already? · Still here?

Special days (always shown first on that day):
1 Jan: Happy new year · 1 Aug: Happy 1. August (Swiss National Day) · 31 Oct: Boo · 24 and 25 Dec: Merry Christmas · 31 Dec: Almost next year
Valentine's Day is removed.

## Font

All three Tailwind font tokens (`--font-sans`, `--font-mono`, `--font-serif`) resolve to the same stack:

```
"Times New Roman", Times, "Nimbus Roman", serif
```

The `next/font/google` imports (Geist, Geist Mono, Instrument Serif) are deleted, so the page downloads no web fonts. Times New Roman is native on macOS, Windows and iOS. Android and most Linux systems fall back to their default serif, which is accepted. The existing class names (`font-serif`, `font-sans`, `font-mono`) stay in the components so no markup changes.

## Testing

Manual check in the dev server: headline, body and footer render in Times New Roman, the greeting shuffles on click, tooltips show for the lines that have one, and there are no console errors or font requests in the network panel. `pnpm lint` and `pnpm build` pass.
