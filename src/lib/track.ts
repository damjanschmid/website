export type Track = {
  title: string;
  artist: string;
  album?: string;
  image?: string;
  url?: string;
  isPlaying: boolean;
  source: "spotify" | "lastfm" | "demo";
};
