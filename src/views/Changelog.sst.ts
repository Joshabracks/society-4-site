import type { ReleasesState } from "../releases";
import type { GhRelease } from "../releases";

type Ctx = { state: { data: { releases: ReleasesState } } };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function releaseBlock(r: GhRelease): string {
  const title = escapeHtml(r.name || r.tag_name);
  const body = r.body ? escapeHtml(r.body.trim()) : "No release notes.";
  const when = r.published_at
    ? new Date(r.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  return `
    <fieldset class="lcd-fieldset">
      <legend>${escapeHtml(r.tag_name)}</legend>
      <p class="lcd-line"><strong>${title}</strong>${when ? ` · ${when}` : ""}</p>
      <pre class="lcd-release-body">${body}</pre>
      <p class="lcd-muted"><a href="${r.html_url}" target="_blank" rel="noopener">View on GitHub</a></p>
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
    body = rel.releases.map(releaseBlock).join("");
  }

  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Changelog</h1>
      <p class="lcd-muted">Notes from public mirrored releases.</p>
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
