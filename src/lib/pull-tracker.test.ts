import { describe, expect, it } from "vitest";
import { MAX, PullTracker, THRESHOLD, rubber, unrubber } from "./pull-tracker";

describe("PullTracker", () => {
  it("accumulates upward movement from one finger", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    expect(t.move([{ id: 1, y: 480 }], 16)).toBe(20);
    expect(t.move([{ id: 1, y: 450 }], 32)).toBe(50);
  });

  it("hands off between fingers without a jump", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    t.move([{ id: 1, y: 400 }], 16); // raw 100
    t.down(2, 700, 20); // second finger lands far away
    expect(t.move([{ id: 1, y: 400 }, { id: 2, y: 700 }], 32)).toBe(100); // nothing moved, nothing changes
    expect(t.up(1)).toBe(false); // first finger lifts, gesture continues
    expect(t.move([{ id: 2, y: 650 }], 48)).toBe(150); // second finger carries on
    expect(t.up(2)).toBe(true); // last finger releases
  });

  it("averages the movement of fingers that moved together", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    t.down(2, 600, 0);
    expect(t.move([{ id: 1, y: 480 }, { id: 2, y: 560 }], 16)).toBe(30);
  });

  it("ignores touches it was never told about", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    expect(t.move([{ id: 1, y: 490 }, { id: 9, y: 100 }], 16)).toBe(10);
    expect(t.up(9)).toBe(false);
    expect(t.active).toBe(true);
  });

  it("clamps at zero and reverses immediately", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    expect(t.move([{ id: 1, y: 600 }], 16)).toBe(0); // pulled the wrong way
    expect(t.move([{ id: 1, y: 590 }], 32)).toBe(10); // reversing lifts at once
  });

  it("reports velocity in px/s, positive when pulling up", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    expect(t.velocity(0)).toBe(0);
    for (let i = 1; i <= 6; i++) t.move([{ id: 1, y: 500 - i * 10 }], i * 16); // 10px per 16ms
    expect(t.velocity(96)).toBeCloseTo(625, -1);
    for (let i = 1; i <= 7; i++) t.move([{ id: 1, y: 440 + i * 10 }], 96 + i * 16); // then back down
    expect(t.velocity(208)).toBeLessThan(0);
  });

  it("only uses recent samples for velocity", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    t.move([{ id: 1, y: 300 }], 16); // fast
    t.move([{ id: 1, y: 300 }], 500); // then held still for a long time
    expect(t.velocity(500)).toBe(0);
  });

  it("resets to a given raw with no fingers", () => {
    const t = new PullTracker();
    t.down(1, 500, 0);
    t.move([{ id: 1, y: 400 }], 16);
    t.reset(40);
    expect(t.active).toBe(false);
    expect(t.raw).toBe(40);
    t.down(2, 300, 100);
    expect(t.move([{ id: 2, y: 290 }], 116)).toBe(50);
  });
});

describe("rubber", () => {
  it("tracks 1:1 below the threshold", () => {
    expect(rubber(0)).toBe(0);
    expect(rubber(THRESHOLD / 2)).toBe(THRESHOLD / 2);
    expect(rubber(THRESHOLD)).toBe(THRESHOLD);
  });

  it("resists past the threshold and never reaches MAX", () => {
    expect(rubber(THRESHOLD + 100)).toBeLessThan(THRESHOLD + 100);
    expect(rubber(THRESHOLD + 100)).toBeGreaterThan(THRESHOLD);
    expect(rubber(10_000)).toBeLessThanOrEqual(MAX);
    expect(rubber(10_000)).toBeGreaterThan(MAX - 1);
  });

  it("is continuous at the threshold", () => {
    expect(rubber(THRESHOLD + 0.001) - rubber(THRESHOLD)).toBeCloseTo(0.001, 3);
  });

  it("inverts cleanly", () => {
    for (const x of [0, 30, 150, 200, 400, 900]) expect(unrubber(rubber(x))).toBeCloseTo(x, 6);
    expect(unrubber(MAX)).toBeGreaterThan(1000); // clamps instead of blowing up
    expect(Number.isFinite(unrubber(MAX + 50))).toBe(true);
  });
});
