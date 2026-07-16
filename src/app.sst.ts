import { NAV, VIEWS, type ViewId } from "./state";
import type { Mode } from "./theme";
import type { ReleasesState } from "./releases";

type Ctx = {
  state: {
    data: {
      view: ViewId;
      mode: Mode;
      releases: ReleasesState;
    };
  };
};

export function AppRoot({ state }: Ctx): string {
  return `
    <div class="lcd-shell">
      <header class="lcd-topbar">
        <div class="lcd-brand">
          <p class="lcd-brand-name">Society 4</p>
          <p class="lcd-brand-tag">Chat without a host</p>
        </div>
        <Nav/>
        <div class="lcd-topbar-end">
          <button type="button" class="lcd-ghost" :click=toggleMode()>
            ${state.data.mode === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      <main>
        <${VIEWS[state.data.view] || "Home"}/>
      </main>
    </div>
  `;
}

export function Nav({ state }: Ctx): string {
  const view = state.data.view;
  return `
    <nav class="lcd-tabs" aria-label="Primary">
      ${NAV.map(
        (item) => `
        <button
          type="button"
          class="lcd-tab${item.id === view ? " is-active" : ""}"
          :click=setView(target="${item.id}")
        >${item.label}</button>
      `,
      ).join("")}
    </nav>
  `;
}
