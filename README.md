# website

My personal site. One page: a profile picture you can spin like a fidget spinner, a greeting that changes, a short bio and an email button that copies the address.

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Editing

- **Greetings**: `src/content/greetings.ts`. One is picked per visit based on time of day, weekday, special dates and whether you've been here before. Clicking the greeting shuffles.
- **Bio**: `src/app/page.tsx`.
- **Email, location, name**: `src/lib/site.ts`.
- **Profile picture**: put a photo in `public/` and pass it to the avatar, e.g. `<AvatarSpinner src="/me.jpg" alt="Damjan" />` in `src/app/page.tsx`.
- **Version** (bottom right): comes from `version` in `package.json`.
- **View-source signature**: `src/lib/signature.ts`. It renders in `<head>` inside a `<noscript>`, since React can't output a bare HTML comment.

## Stack

Next.js 16, React 19, Tailwind CSS 4, [Motion](https://motion.dev). Fonts: Instrument Serif, Geist, Geist Mono.
