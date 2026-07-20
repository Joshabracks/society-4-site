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

export type PlatformId = "windows" | "macos" | "linux";

/** One desktop version, possibly merged from several per-OS GitHub Releases. */
export type VersionRelease = {
  version: string;
  assetsByPlatform: Partial<Record<PlatformId, GhAsset[]>>;
  platforms: PlatformId[];
  published_at: string | null;
  notes: string | null;
  html_urls: string[];
  /** Display label e.g. "0.3.1" */
  label: string;
};

export type ReleasesState =
  | { status: "idle" | "loading" }
  | { status: "ok"; versions: VersionRelease[] }
  | { status: "empty" }
  | { status: "error"; message: string };

export function platformForAsset(name: string): PlatformId | "other" {
  const n = name.toLowerCase();
  if (n.includes("windows") || n.endsWith(".msi") || n.endsWith(".exe")) return "windows";
  if (n.includes("macos") || n.endsWith(".dmg")) return "macos";
  if (n.includes("linux") || n.endsWith(".appimage") || n.endsWith(".deb")) return "linux";
  return "other";
}

/** Only desktop installers — never source archives or unrelated assets. */
export function isInstallerAsset(name: string): boolean {
  return platformForAsset(name) !== "other";
}

export function installerAssets(assets: GhAsset[]): GhAsset[] {
  return assets.filter((a) => isInstallerAsset(a.name));
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function platformLabel(p: PlatformId | "other"): string {
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

const PER_OS_TAG = /^(windows|linux|macos)(.+)$/i;
const LEGACY_TAG = /^v?(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]*)?)$/i;

export type ParsedTag =
  | { kind: "per-os"; platform: PlatformId; version: string }
  | { kind: "legacy"; version: string }
  | { kind: "unknown" };

export function parseReleaseTag(tag: string): ParsedTag {
  const perOs = tag.match(PER_OS_TAG);
  if (perOs) {
    const platform = perOs[1].toLowerCase() as PlatformId;
    const version = perOs[2].replace(/^v/i, "");
    if (/^\d+\.\d+\.\d+/.test(version)) {
      return { kind: "per-os", platform, version };
    }
  }
  const legacy = tag.match(LEGACY_TAG);
  if (legacy) {
    return { kind: "legacy", version: legacy[1] };
  }
  return { kind: "unknown" };
}

function cmpSemverDesc(a: string, b: string): number {
  const pa = a.replace(/^v/i, "").split(/[.+-]/).map((x) => Number.parseInt(x, 10) || 0);
  const pb = b.replace(/^v/i, "").split(/[.+-]/).map((x) => Number.parseInt(x, 10) || 0);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const d = (pb[i] || 0) - (pa[i] || 0);
    if (d) return d;
  }
  return 0;
}

function maxIsoDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

function addAsset(
  map: Partial<Record<PlatformId, GhAsset[]>>,
  platform: PlatformId,
  asset: GhAsset,
): void {
  const list = map[platform] ?? [];
  if (!list.some((x) => x.id === asset.id)) {
    list.push(asset);
  }
  map[platform] = list;
}

/**
 * Group GitHub Releases into desktop versions.
 * Supports per-OS tags (`windows0.3.1`) and legacy multi-asset `v0.3.1` releases.
 */
export function groupReleasesByVersion(releases: GhRelease[]): VersionRelease[] {
  const byVersion = new Map<
    string,
    {
      assetsByPlatform: Partial<Record<PlatformId, GhAsset[]>>;
      published_at: string | null;
      notes: string | null;
      html_urls: string[];
    }
  >();

  const ensure = (version: string) => {
    let g = byVersion.get(version);
    if (!g) {
      g = {
        assetsByPlatform: {},
        published_at: null,
        notes: null,
        html_urls: [],
      };
      byVersion.set(version, g);
    }
    return g;
  };

  for (const rel of releases) {
    const parsed = parseReleaseTag(rel.tag_name);
    if (parsed.kind === "unknown") continue;

    const g = ensure(parsed.version);
    g.published_at = maxIsoDate(g.published_at, rel.published_at);
    if (!g.notes && rel.body?.trim()) g.notes = rel.body.trim();
    if (!g.html_urls.includes(rel.html_url)) g.html_urls.push(rel.html_url);

    const assets = installerAssets(rel.assets);

    if (parsed.kind === "per-os") {
      if (assets.length) {
        for (const asset of assets) {
          const fromName = platformForAsset(asset.name);
          const platform = fromName === "other" ? parsed.platform : fromName;
          addAsset(g.assetsByPlatform, platform, asset);
        }
      }
      // Tag declares platform even if assets are oddly named — still prefer real assets only
    } else {
      for (const asset of assets) {
        const platform = platformForAsset(asset.name);
        if (platform !== "other") addAsset(g.assetsByPlatform, platform, asset);
      }
    }
  }

  const preferred: PlatformId[] = ["windows", "macos", "linux"];

  const versions: VersionRelease[] = [...byVersion.entries()]
    .map(([version, g]) => {
      const platforms = preferred.filter((p) => (g.assetsByPlatform[p]?.length ?? 0) > 0);
      return {
        version,
        label: version,
        assetsByPlatform: g.assetsByPlatform,
        platforms,
        published_at: g.published_at,
        notes: g.notes,
        html_urls: g.html_urls,
      };
    })
    .filter((v) => v.platforms.length > 0)
    .sort((a, b) => cmpSemverDesc(a.version, b.version));

  return versions;
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

export async function fetchVersionReleases(): Promise<VersionRelease[]> {
  const raw = await fetchReleases();
  return groupReleasesByVersion(raw);
}
