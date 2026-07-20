import type { ReleasesState, VersionRelease } from "../releases";
import { platformLabel } from "../releases";

type Ctx = { state: { data: { releases: ReleasesState } } };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function releaseBlock(v: VersionRelease): string {
  const title = escapeHtml(`Society 4 ${v.label}`);
  const body = v.notes ? escapeHtml(v.notes) : "No release notes.";
  const when = v.published_at
    ? new Date(v.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  const platforms = v.platforms.map(platformLabel).join(", ");
  const links = v.html_urls
    .map(
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener">View on GitHub</a>`,
    )
    .join(" · ");
  return `
    <fieldset class="lcd-fieldset">
      <legend>${escapeHtml(v.label)}</legend>
      <p class="lcd-line"><strong>${title}</strong>${when ? ` · ${when}` : ""}</p>
      <p class="lcd-muted">Platforms: ${escapeHtml(platforms)}</p>
      <pre class="lcd-release-body">${body}</pre>
      <p class="lcd-muted">${links}</p>
    </fieldset>
  `;
}

export function Changelog({ state }: Ctx): string {
  const rel = state.data.releases;

  let body = "";
  if (rel.status === "idle" || rel.status === "loading") {
    body = `<p class="lcd-muted">Loading release notes…</p>`;
  } else if (rel.status === "error") {
    body = `<p class="lcd-line">Could not load changelog: ${escapeHtml(rel.message)}</p>`;
  } else if (rel.status === "empty") {
    body = `<p class="lcd-line">No releases published yet.</p>`;
  } else if (rel.status === "ok") {
    body = rel.versions.map(releaseBlock).join("");
  }

  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Changelog</h1>
      <p class="lcd-muted">Notes from public desktop releases (grouped by version).</p>
      ${body}
      <div class="lcd-row">
        <button type="button" class="lcd-ghost" :click=loadReleases()>Refresh</button>
        <button type="button" class="lcd-ghost" :click=setView(target="downloads")>
          Downloads
        </button>
      </div>
    </section>
  `;
}
