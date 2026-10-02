import { describe, expect, it } from "vitest";
import { deployLink, prNumber } from "./deploy";

const repo = "https://github.com/damjanschmid/website";

describe("prNumber", () => {
  it("reads merge commits", () => {
    expect(prNumber("Merge pull request #4 from damjanschmid/some-branch\n\nTrace the plane")).toBe(4);
  });

  it("reads squash merges", () => {
    expect(prNumber("Trace the paper plane (#12)\n\n* first commit")).toBe(12);
  });

  it("ignores ordinary commits, even ones that mention a PR", () => {
    expect(prNumber("Trace the paper plane")).toBeNull();
    expect(prNumber("Undo what #4 did to the footer")).toBeNull();
    expect(prNumber("Fix the footer\n\nMerge pull request #4 broke it")).toBeNull();
  });
});

describe("deployLink", () => {
  it("links to the PR when there is one", () => {
    expect(deployLink(repo, "Merge pull request #4 from x/y", "6cccdf2abc")).toEqual({
      label: "#4",
      href: `${repo}/pull/4`,
    });
  });

  it("falls back to the commit", () => {
    expect(deployLink(repo, "Trace the paper plane", "6cccdf2abcdef")).toEqual({
      label: "6cccdf2",
      href: `${repo}/commit/6cccdf2abcdef`,
    });
  });

  it("says dev when there's no git at all", () => {
    expect(deployLink(repo)).toEqual({ label: "dev", href: repo });
  });
});
