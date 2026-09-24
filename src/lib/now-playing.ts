import "server-only";

/*
 * What am I listening to?
 *
 * Works with either Spotify or Last.fm. Set the env vars for one of them
 * (see .env.example). With neither set, it returns a demo track so the
 * UI still has something to show.
 */

import type { Track } from "@/lib/track";

export type { Track };

export async function getNowPlaying(): Promise<Track | null> {
  try {
    if (process.env.SPOTIFY_REFRESH_TOKEN) return await fromSpotify();
    if (process.env.LASTFM_API_KEY && process.env.LASTFM_USERNAME) return await fromLastFm();
  } catch (err) {
    console.error("[now-playing]", err);
    return null;
  }
  return demoTrack();
}

/* ---------------- Spotify ---------------- */

async function spotifyToken() {
  const id = process.env.SPOTIFY_CLIENT_ID!;
  const secret = process.env.SPOTIFY_CLIENT_SECRET!;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`spotify token ${res.status}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

type SpotifyItem = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

function spotifyTrack(item: SpotifyItem, isPlaying: boolean): Track {
  return {
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album.name,
    image: item.album.images[0]?.url,
    url: item.external_urls.spotify,
    isPlaying,
    source: "spotify",
  };
}

async function fromSpotify(): Promise<Track | null> {
  const token = await spotifyToken();
  const headers = { Authorization: `Bearer ${token}` };

  const now = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers,
    cache: "no-store",
  });
  if (now.status === 200) {
    const json = (await now.json()) as { is_playing: boolean; item: SpotifyItem | null };
    if (json.item) return spotifyTrack(json.item, json.is_playing);
  }

  const recent = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers,
    cache: "no-store",
  });
  if (!recent.ok) return null;
  const json = (await recent.json()) as { items: { track: SpotifyItem }[] };
  return json.items[0] ? spotifyTrack(json.items[0].track, false) : null;
}

/* ---------------- Last.fm ---------------- */

type LastFmTrack = {
  name: string;
  url: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: { size: string; "#text": string }[];
  "@attr"?: { nowplaying?: string };
};

async function fromLastFm(): Promise<Track | null> {
  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: process.env.LASTFM_USERNAME!,
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
    limit: "1",
  });
  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`lastfm ${res.status}`);
  const json = (await res.json()) as { recenttracks: { track: LastFmTrack[] } };
  const t = json.recenttracks.track[0];
  if (!t) return null;
  const image = t.image.find((i) => i.size === "extralarge")?.["#text"] || t.image.at(-1)?.["#text"];
  return {
    title: t.name,
    artist: t.artist["#text"],
    album: t.album["#text"],
    image: image || undefined,
    url: t.url,
    isPlaying: t["@attr"]?.nowplaying === "true",
    source: "lastfm",
  };
}

/* ---------------- Demo ---------------- */

const demo: Omit<Track, "isPlaying" | "source">[] = [
  { title: "Avril 14th", artist: "Aphex Twin", album: "Drukqs" },
  { title: "Nightcall", artist: "Kavinsky", album: "OutRun" },
  { title: "Svefn-g-englar", artist: "Sigur Rós", album: "Ágætis byrjun" },
  { title: "Teardrop", artist: "Massive Attack", album: "Mezzanine" },
  { title: "Holocene", artist: "Bon Iver", album: "Bon Iver" },
];

function demoTrack(): Track {
  // rotate every 4 minutes so it feels a little alive
  const t = demo[Math.floor(Date.now() / 240_000) % demo.length];
  return {
    ...t,
    url: `https://open.spotify.com/search/${encodeURIComponent(`${t.title} ${t.artist}`)}`,
    isPlaying: true,
    source: "demo",
  };
}
