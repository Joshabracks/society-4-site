import { State } from "@state-street/state-street";
import { applyDocumentTheme, loadStoredMode } from "./theme";
import { initialData, parseHash, type ViewId } from "./state";
import { fetchReleases } from "./releases";
import { AppRoot, Nav } from "./app.sst";
import { Home } from "./views/Home.sst";
import { HowItWorks } from "./views/HowItWorks.sst";
import { GettingStarted } from "./views/GettingStarted.sst";
import { Downloads } from "./views/Downloads.sst";
import { Faq } from "./views/Faq.sst";
import { Privacy } from "./views/Privacy.sst";
import { Changelog } from "./views/Changelog.sst";
import "./themes.css";

type MethodCtx = {
  state: {
    data: ReturnType<typeof initialData>;
  };
  target?: string;
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
  Faq,
  Privacy,
  Changelog,
};

function needsReleases(view: ViewId): boolean {
  return view === "downloads" || view === "changelog";
}

function loadReleases({ state }: MethodCtx): void {
  if (state.data.releases.status === "loading") return;
  state.data.releases = { status: "loading" };
  fetchReleases()
    .then((releases) => {
      state.data.releases =
        releases.length === 0
          ? { status: "empty" }
          : { status: "ok", releases };
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
};

function boot(): void {
  new State(`<AppRoot/>`, data, components, methods);

  window.addEventListener("hashchange", () => {
    const view = parseHash(location.hash);
    data.view = view;
    if (needsReleases(view)) {
      loadReleases({ state: { data } });
    }
  });

  if (!location.hash) {
    location.hash = data.view;
  } else if (needsReleases(data.view)) {
    loadReleases({ state: { data } });
  }
}

boot();
