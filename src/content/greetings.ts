/*
 * Greetings for the homepage. One is picked on every visit, based on
 * time of day, weekday, special dates and whether you've been here before.
 * Clicking the greeting shuffles to another one.
 *
 * `note` is shown as a tooltip.
 */

export type Greeting = { text: string; note?: string };

type Context = { now: Date; visits: number };

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

function timeOfDay(hour: number) {
  if (hour >= 5 && hour < 12) return morning;
  if (hour >= 12 && hour < 18) return afternoon;
  if (hour >= 18 && hour < 23) return evening;
  return lateNight;
}

export function candidates({ now, visits }: Context): Greeting[] {
  const special = specialDays.find((d) => d.month === now.getMonth() + 1 && d.day === now.getDate());
  const pool = [
    ...timeOfDay(now.getHours()),
    ...timeOfDay(now.getHours()), // time of day gets double weight
    ...anytime,
    ...working,
    ...(weekday[now.getDay()] ?? []),
    ...(visits > 1 ? returning : []),
  ];
  return special ? [special.greeting, ...pool] : pool;
}

/** The first greeting of a visit. Special days always win. */
export function firstGreeting(ctx: Context): Greeting {
  const list = candidates(ctx);
  const special = specialDays.find(
    (d) => d.month === ctx.now.getMonth() + 1 && d.day === ctx.now.getDate(),
  );
  if (special) return special.greeting;
  if (ctx.visits > 1 && Math.random() < 0.4) return pick(returning);
  return pick(list);
}

export function nextGreeting(ctx: Context, current: Greeting): Greeting {
  const list = candidates(ctx).filter((g) => g.text !== current.text);
  return pick(list);
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
