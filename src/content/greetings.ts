/*
 * Greetings for the homepage. One is picked on every visit, based on
 * time of day, weekday, special dates and whether you've been here before.
 * Clicking the greeting shuffles to another one. Click it enough times
 * and you get one of the secret ones.
 *
 * `note` shows up as a small hint on hover (handy for the Swiss ones).
 */

export type Greeting = { text: string; note?: string };

type Context = { now: Date; visits: number };

const morning: Greeting[] = [
  { text: "Good morning" },
  { text: "Morning, early bird" },
  { text: "Coffee first?" },
  { text: "Rise and shine" },
];

const afternoon: Greeting[] = [
  { text: "Good afternoon" },
  { text: "Afternoon, friend" },
  { text: "Post-lunch slump?" },
];

const evening: Greeting[] = [
  { text: "Good evening" },
  { text: "Evening, you" },
  { text: "Long day?" },
];

const lateNight: Greeting[] = [
  { text: "Up late?" },
  { text: "Hello, night owl" },
  { text: "Can't sleep either?" },
  { text: "Shouldn't you be asleep?" },
];

const anytime: Greeting[] = [
  { text: "Hey there" },
  { text: "Oh, hello" },
  { text: "Hi, come on in" },
  { text: "Nice to see you" },
  { text: "Grüezi", note: "Swiss German for hello" },
  { text: "Hoi zäme", note: "Swiss German for hi everyone" },
  { text: "Salü", note: "Swiss German, the casual one" },
  { text: "Bonjour", note: "Hello in French, one of four Swiss languages" },
  { text: "Ciao", note: "Italian, another one of the four" },
  { text: "Allegra", note: "Hello in Romansh, the smallest Swiss language" },
];

const weekday: Record<number, Greeting[]> = {
  1: [{ text: "Monday again, huh" }],
  3: [{ text: "Halfway there" }],
  5: [{ text: "Happy Friday" }, { text: "Friday feeling?" }],
  6: [{ text: "Slow Saturday?" }],
  0: [{ text: "Sunday, slowly" }],
};

const returning: Greeting[] = [
  { text: "Welcome back" },
  { text: "Oh, you again. Nice." },
  { text: "Back for more?" },
  { text: "Good to see you again" },
];

// month is 1-based here
const specialDays: { month: number; day: number; greeting: Greeting }[] = [
  { month: 1, day: 1, greeting: { text: "Happy new year" } },
  { month: 2, day: 14, greeting: { text: "Happy Valentine's" } },
  { month: 8, day: 1, greeting: { text: "Happy 1. August", note: "Swiss National Day" } },
  { month: 10, day: 31, greeting: { text: "Boo" } },
  { month: 12, day: 24, greeting: { text: "Merry Christmas" } },
  { month: 12, day: 25, greeting: { text: "Merry Christmas" } },
  { month: 12, day: 31, greeting: { text: "Almost next year" } },
];

export const secretGreetings: Greeting[] = [
  { text: "Okay, you found it. Hi, friend." },
  { text: "Seven clicks. You're thorough." },
  { text: "This one's just for you" },
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
