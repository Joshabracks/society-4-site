import { RELEASES_API } from "./config";

export type GhAsset = {
  id: number;
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
};

export type GhRelease = {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string | null;
  html_url: string;
  assets: GhAsset[];
};

export type ReleasesState =
  | { status: "idle" | "loading" }
  | { status: "ok"; releases: GhRelease[] }
  | { status: "empty" }
  | { status: "error"; message: string };

export function platformForAsset(name: string): "windows" | "macos" | "linux" | "other" {
  const n = name.toLowerCase();
  if (n.includes("windows") || n.endsWith(".msi") || n.endsWith(".exe")) return "windows";
  if (n.includes("macos") || n.endsWith(".dmg")) return "macos";
  if (n.includes("linux") || n.endsWith(".appimage") || n.endsWith(".deb")) return "linux";
  return "other";
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function platformLabel(p: ReturnType<typeof platformForAsset>): string {
  switch (p) {
    case "windows":
      return "Windows";
    case "macos":
      return "macOS";
    case "linux":
      return "Linux";
    default:
      return "Other";
  }
}

let inflight: Promise<GhRelease[]> | null = null;

export function fetchReleases(): Promise<GhRelease[]> {
  if (!inflight) {
    inflight = (async () => {
      const res = await fetch(RELEASES_API, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) {
        throw new Error(`GitHub Releases API returned ${res.status}`);
      }
      const data = (await res.json()) as GhRelease[];
      return Array.isArray(data) ? data : [];
    })().finally(() => {
      setTimeout(() => {
        inflight = null;
      }, 0);
    });
  }
  return inflight;
}
