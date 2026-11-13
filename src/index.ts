import { State } from "@state-street/state-street";
import { applyDocumentTheme, loadStoredMode } from "./theme";
import { initialData, parseHash, type ViewId } from "./state";
import { fetchVersionReleases } from "./releases";
import { AppRoot, Nav } from "./app.sst";
import { Home } from "./views/Home.sst";
import { HowItWorks } from "./views/HowItWorks.sst";
import { GettingStarted } from "./views/GettingStarted.sst";
import { Downloads } from "./views/Downloads.sst";
import { RunAnAgent } from "./views/RunAnAgent.sst";
import { Faq } from "./views/Faq.sst";
import { Privacy } from "./views/Privacy.sst";
import { Changelog } from "./views/Changelog.sst";
import { SOCIETY_4_OPEN_LINK } from "./config";
import "./themes.css";

type MethodCtx = {
  state: {
    data: ReturnType<typeof initialData>;
  };
  target?: string;
  os?: string;
  event?: Event;
};

const mode = loadStoredMode();
applyDocumentTheme(mode);

const data = initialData(mode);

const components = {
  AppRoot,
  Nav,
  Home,
  HowItWorks,
  GettingStarted,
  Downloads,
  RunAnAgent,
  Faq,
  Privacy,
  Changelog,
};

function needsReleases(view: ViewId): boolean {
  return view === "downloads" || view === "changelog" || view === "run-an-agent";
}

function loadReleases({ state }: MethodCtx): void {
  if (state.data.releases.status === "loading") return;
  state.data.releases = { status: "loading" };
  fetchVersionReleases()
    .then((versions) => {
      state.data.releases =
        versions.length === 0
          ? { status: "empty" }
          : { status: "ok", versions };
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      state.data.releases = { status: "error", message };
    });
}

const methods = {
  setView: ({ state, target }: MethodCtx) => {
    const view = (target as ViewId) || "home";
    state.data.view = view;
    location.hash = view;
    if (needsReleases(view)) {
      loadReleases({ state });
    }
  },
  toggleMode: ({ state }: MethodCtx) => {
    const next = state.data.mode === "dark" ? "light" : "dark";
    state.data.mode = next;
    applyDocumentTheme(next);
  },
  loadReleases,
  setAgentOs: ({ state, os }: MethodCtx) => {
    if (os === "windows" || os === "macos" || os === "linux") state.data.agentOs = os;
  },
  /** The Downloads page's OS picker. */
  setDownloadOs: ({ state, event }: MethodCtx) => {
    const os = (event?.target as HTMLSelectElement | null)?.value;
    if (os === "windows" || os === "macos" || os === "linux" || os === "android" || os === "ios") {
      state.data.downloadOs = os;
    }
  },
  /** Copy the Society 4 Open workspace invite (home page banner). */
  copyInvite: ({ event }: MethodCtx) => {
    const button = (event?.target as Element | null)?.closest("button") ?? null;
    if (!button) return;
    navigator.clipboard
      .writeText(SOCIETY_4_OPEN_LINK)
      .then(() => {
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy invite link"), 1500);
      })
      .catch(() => {
        button.textContent = "Copy failed";
        setTimeout(() => (button.textContent = "Copy invite link"), 1500);
      });
  },
  /** Copy a command block's text, as shown. */
  copyCode: ({ event }: MethodCtx) => {
    const button = (event?.target as Element | null)?.closest("button") ?? null;
    const text = button?.closest(".lcd-code")?.querySelector("code")?.textContent ?? "";
    if (!button || !text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1500);
      })
      .catch(() => {
        button.textContent = "Select and copy";
      });
  },
};

function boot(): void {
  // Write through the State's own data (a proxy): writes to the plain object
  // passed in don't schedule a render.
  const app = new State(`<AppRoot/>`, data, components, methods);
  const state = { data: app.data as typeof data };

  window.addEventListener("hashchange", () => {
    const view = parseHash(location.hash);
    state.data.view = view;
    if (needsReleases(view)) {
      loadReleases({ state });
    }
  });

  if (!location.hash) {
    location.hash = state.data.view;
  } else if (needsReleases(state.data.view)) {
    loadReleases({ state });
  }
}

boot();
