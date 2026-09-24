import { getNowPlaying } from "@/lib/now-playing";

export async function GET() {
  const track = await getNowPlaying();
  return Response.json(
    { track },
    { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } },
  );
}
