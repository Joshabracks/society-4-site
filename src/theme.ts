export type Mode = "light" | "dark";

const STORAGE_MODE = "s4.site.theme.mode";

export function isMode(v: string | null | undefined): v is Mode {
  return v === "light" || v === "dark";
}

export function loadStoredMode(): Mode {
  const raw = localStorage.getItem(STORAGE_MODE);
  return isMode(raw) ? raw : "light";
}

export function applyDocumentTheme(mode: Mode): void {
  const root = document.documentElement;
  root.dataset.scheme = "lcd-gray";
  root.dataset.mode = mode;
  localStorage.setItem(STORAGE_MODE, mode);
}
