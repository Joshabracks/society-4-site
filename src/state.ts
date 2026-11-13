import type { Mode } from "./theme";
import type { DownloadOs, NodePlatform, ReleasesState } from "./releases";

export type ViewId =
  | "home"
  | "how-it-works"
  | "getting-started"
  | "downloads"
  | "run-an-agent"
  | "faq"
  | "privacy"
  | "changelog";

export const NAV: { id: ViewId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How it works" },
  { id: "getting-started", label: "Get started" },
  { id: "downloads", label: "Downloads" },
  { id: "run-an-agent", label: "Run an Agent" },
  { id: "faq", label: "FAQ" },
  { id: "privacy", label: "Privacy" },
  { id: "changelog", label: "Changelog" },
];

export const VIEWS: Record<ViewId, string> = {
  home: "Home",
  "how-it-works": "HowItWorks",
  "getting-started": "GettingStarted",
  downloads: "Downloads",
  "run-an-agent": "RunAnAgent",
  faq: "Faq",
  privacy: "Privacy",
  changelog: "Changelog",
};

export function parseHash(hash: string): ViewId {
  const raw = hash.replace(/^#/, "").split("/")[0]?.trim() || "home";
  if (raw in VIEWS) return raw as ViewId;
  return "home";
}

export type SiteData = {
  view: ViewId;
  mode: Mode;
  releases: ReleasesState;
  /** The OS the Run an Agent page shows commands for. */
  agentOs: NodePlatform;
  /** The OS the Downloads page shows files for. */
  downloadOs: DownloadOs;
};

/** This visitor's OS, as far as the browser says (Windows otherwise). */
export function guessOs(): NodePlatform {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  if (/Mac OS X|Macintosh/.test(ua)) return "macos";
  if (/Linux|X11/.test(ua) && !/Android/.test(ua)) return "linux";
  return "windows";
}

/**
 * This visitor's device for the Downloads page, phones included (Windows if
 * the browser doesn't say). iPads ask for the desktop site, so a "Mac" with a
 * touch screen is taken as iOS.
 */
export function guessDownloadOs(): DownloadOs {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  if (/Android/.test(ua)) return "android";
  return guessOs();
}

export function initialData(mode: Mode): SiteData {
  return {
    view: parseHash(typeof location !== "undefined" ? location.hash : ""),
    mode,
    releases: { status: "idle" },
    agentOs: guessOs(),
    downloadOs: guessDownloadOs(),
  };
}
