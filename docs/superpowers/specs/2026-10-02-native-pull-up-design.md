# Native-feeling pull-up gesture

Date: 2026-10-02

## Goal

Make the swipe-up-past-the-bottom gesture on the home page feel like a native
sheet. Today it tracks only the first finger's start point, so a second finger
makes it jump and lifting the first finger releases it mid-gesture. It also
rubber-bands from the first pixel and ignores fling velocity.

The end state stays as it is: pull far enough to arm ("Let go"), release, and
everything springs back down. The sheet never stays open.

## Behaviour

- Any number of fingers can take part. A finger landing or lifting never moves
  the page. Finger A pulls, finger B lands, A lifts, B keeps pulling: one
  continuous motion.
- Release happens only when the last finger leaves.
- Movement is incremental. Reversing direction responds at once; there is no
  dead travel after pulling back down to rest.
- The first 150px of pull track the fingers 1:1. Beyond that the page rubber
  bands exponentially toward a 280px maximum, so it gets heavy exactly where it
  arms.
- On release the page springs back to rest carrying the fingers' velocity. A
  flick upward overshoots a little, then settles. Velocity is clamped to about
  1500px/s so nothing flies off.
- Grabbing the page while it is springing back catches it where it is.
- Touches that start on a button or link are ignored. A gesture can only start
  when the page is scrolled to its bottom. While nothing is being pulled, moving
  a finger downward is left to the browser so normal scrolling still works.
- Arming threshold, haptic, labels and progress ring are unchanged.

## Components

### `src/lib/pull-tracker.ts` (new, pure)

A `PullTracker` class with no DOM dependency.

State: `fingers: Map<number, number>` (id to last Y), `raw: number`, a ring of
`{ t, raw }` samples from the last ~100ms.

- `down(id, y, t)`: register a finger. Does not change `raw`.
- `move(touches: { id, y }[], t)`: for each registered finger in the list, add
  `lastY - y` to a running total and update `lastY`. Add the average of those
  deltas to `raw`, clamp at 0, push a sample. Returns the new `raw`.
- `up(id)`: forget the finger. Returns `true` when no fingers remain.
- `velocity(t)`: px/s of `raw` over the samples within the last 100ms, positive
  when pulling up. 0 when there is only one sample.
- `reset(raw = 0)`: clear fingers and samples, set `raw`. Used to resume from a
  mid-spring position.
- `active`: whether any finger is registered.

### Curve (same module)

- `rubber(raw)`: `raw` for `raw <= THRESHOLD`, otherwise
  `THRESHOLD + (MAX - THRESHOLD) * (1 - exp(-(raw - THRESHOLD) / (MAX - THRESHOLD)))`.
- `unrubber(p)`: exact inverse, clamped so it never takes `log` of a
  non-positive number.
- `THRESHOLD = 150`, `MAX = 280` exported from here and imported by the
  component.

### `src/components/pull-up.tsx`

Keeps its rendering. The effect becomes bookkeeping around one tracker:

- `touchstart`: for each changed touch, skip it if its target is inside a
  `button` or `a`. If the tracker has no fingers and the page is not at the
  bottom, skip it. If the tracker has no fingers, stop any running spring and
  `reset(unrubber(pull.get()))`. Then `down(id, clientY, now)`.
- `touchmove`: if the tracker is inactive, return. Call `move`. If the result
  is 0 and the page did not move upward this frame, return without
  `preventDefault`. Otherwise `preventDefault`, set `pull` to `rubber(raw)`,
  update the armed state as today.
- `touchend` / `touchcancel`: `up(id)` for each changed touch. When it returns
  `true` and a pull was in progress, release: `animate(pull, 0, { type:
  "spring", stiffness: 380, damping: armed ? 22 : 34, velocity })` where
  `velocity` is the tracker's velocity mapped through the curve's local slope
  and clamped to ±1500px/s.
- The sheet grows from 300px to 360px tall so spring overshoot never exposes
  the body behind it. Its content stays anchored to the top.

## Testing

Add `vitest` as a dev dependency and a `test` script. One file,
`src/lib/pull-tracker.test.ts`, covering:

- Two-finger handoff produces no jump and continues from where finger A left.
- `up` returns `true` only for the last finger.
- `raw` clamps at 0 and reversing direction moves immediately.
- Velocity sign and rough magnitude for a steady upward move; 0 with one sample.
- `rubber` is 1:1 below the threshold, never exceeds `MAX`, and
  `unrubber(rubber(x)) ≈ x`.

Manual verification on the iOS Simulator (Safari, local dev server): one-finger
pull and release, two-finger handoff with `touch2_path`, catching the page
mid-spring, and a fast flick, each with a screenshot.

## Out of scope

- The sheet staying open or holding real content.
- Desktop or mouse support.
- Momentum from a page scroll carrying into the pull.
