// What the bottom-right corner says: the PR the live site was merged from,
// or the commit itself when it didn't come through a PR.

export function prNumber(message: string): number | null {
  const title = message.split("\n", 1)[0].trim();
  // "Merge pull request #4 from …" for merges, "Some change (#4)" for squashes
  const match = title.match(/^Merge pull request #(\d+)\b/) ?? title.match(/\(#(\d+)\)$/);
  return match ? Number(match[1]) : null;
}

export function deployLink(repo: string, message = "", sha = "") {
  const pr = prNumber(message);
  if (pr) return { label: `#${pr}`, href: `${repo}/pull/${pr}` };
  if (sha) return { label: sha.slice(0, 7), href: `${repo}/commit/${sha}` };
  return { label: "dev", href: repo };
}
