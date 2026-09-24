"use client";

import { useSyncExternalStore } from "react";

import type { Track } from "@/lib/track";

type State = { track: Track | null; loaded: boolean };

// One shared poller for every component that wants to know,
// so the dock and the speaker don't each hit the API.
let state: State = { track: null, loaded: false };
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

async function refresh() {
  if (typeof document !== "undefined" && document.hidden) return;
  try {
    const res = await fetch("/api/now-playing");
    const json = (await res.json()) as { track: Track | null };
    state = { track: json.track, loaded: true };
  } catch {
    state = { ...state, loaded: true };
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    refresh();
    timer = setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    }
  };
}

const serverState: State = { track: null, loaded: false };

export function useNowPlaying() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
}
