import type { Mode } from "./theme";
import type { ReleasesState } from "./releases";

export type ViewId =
  | "home"
  | "how-it-works"
  | "getting-started"
  | "downloads"
  | "faq"
  | "privacy"
  | "changelog";

export const NAV: { id: ViewId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How it works" },
  { id: "getting-started", label: "Get started" },
  { id: "downloads", label: "Downloads" },
  { id: "faq", label: "FAQ" },
  { id: "privacy", label: "Privacy" },
  { id: "changelog", label: "Changelog" },
];

export const VIEWS: Record<ViewId, string> = {
  home: "Home",
  "how-it-works": "HowItWorks",
  "getting-started": "GettingStarted",
  downloads: "Downloads",
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
};

export function initialData(mode: Mode): SiteData {
  return {
    view: parseHash(typeof location !== "undefined" ? location.hash : ""),
    mode,
    releases: { status: "idle" },
  };
}
