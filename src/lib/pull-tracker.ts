/*
 * Gesture bookkeeping for the pull-up at the bottom of the page.
 *
 * Everything is incremental: the pull is the sum of each frame's finger
 * movement, not the distance from where the first finger landed. That is
 * what lets a second finger take over from the first without a jump, the
 * way a native sheet behaves.
 */

export const THRESHOLD = 140; // px of lift before it arms
export const MAX = 360; // px the page approaches but never quite reaches

const VELOCITY_WINDOW = 100; // ms of samples that count toward the release velocity

/*
 * raw finger travel -> how far the page actually lifts
 *
 * Starts out 1:1 and gets harder with the square of the travel, like iOS's
 * own overscroll. Unlike an exponential it never goes dead: every extra
 * centimetre of pull still moves the page, just less and less.
 */
export function rubber(raw: number) {
  return (MAX * raw) / (raw + MAX);
}

/** inverse of rubber, so a pull can resume from wherever the page currently is */
export function unrubber(p: number) {
  const clamped = Math.min(p, MAX - 1e-3);
  return (MAX * clamped) / (MAX - clamped);
}

type Touch = { id: number; y: number };

export class PullTracker {
  raw = 0;
  private fingers = new Map<number, number>(); // id -> last y
  private samples: { t: number; raw: number }[] = [];

  get active() {
    return this.fingers.size > 0;
  }

  down(id: number, y: number, t: number) {
    this.fingers.set(id, y);
    if (this.samples.length === 0) this.samples.push({ t, raw: this.raw });
  }

  /** feed the current positions of the fingers that moved; returns the new raw pull */
  move(touches: Touch[], t: number) {
    let total = 0;
    let count = 0;
    for (const { id, y } of touches) {
      const last = this.fingers.get(id);
      if (last === undefined) continue;
      total += last - y; // up is positive
      this.fingers.set(id, y);
      count++;
    }
    if (count > 0) this.raw = Math.max(0, this.raw + total / count);
    this.samples.push({ t, raw: this.raw });
    this.samples = this.samples.filter((s) => t - s.t <= VELOCITY_WINDOW);
    return this.raw;
  }

  /** returns true when that was the last finger */
  up(id: number) {
    this.fingers.delete(id);
    return this.fingers.size === 0;
  }

  /** px/s over the recent samples, positive when pulling up */
  velocity(t: number) {
    const recent = this.samples.filter((s) => t - s.t <= VELOCITY_WINDOW);
    if (recent.length < 2) return 0;
    const first = recent[0];
    const last = recent[recent.length - 1];
    const dt = last.t - first.t;
    return dt > 0 ? ((last.raw - first.raw) / dt) * 1000 : 0;
  }

  reset(raw = 0) {
    this.fingers.clear();
    this.samples = [];
    this.raw = raw;
  }
}
