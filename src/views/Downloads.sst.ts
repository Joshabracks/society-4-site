import type { ReleasesState } from "../releases";
import {
  formatBytes,
  installerAssets,
  platformForAsset,
  platformLabel,
  type GhRelease,
} from "../releases";

type Ctx = { state: { data: { releases: ReleasesState } } };

function assetRows(release: GhRelease): string {
  const assets = installerAssets(release.assets);
  if (!assets.length) {
    return `<p class="lcd-muted">No installer assets on this release.</p>`;
  }
  const preferred = ["windows", "macos", "linux", "other"] as const;
  const sorted = [...assets].sort((a, b) => {
    return (
      preferred.indexOf(platformForAsset(a.name)) -
      preferred.indexOf(platformForAsset(b.name))
    );
  });
  return sorted
    .map((asset) => {
      const plat = platformLabel(platformForAsset(asset.name));
      return `
        <div class="lcd-asset-row">
          <div>
            <p class="lcd-line"><strong>${plat}</strong> — ${asset.name}</p>
            <p class="lcd-muted">${formatBytes(asset.size)}</p>
          </div>
          <a href="${asset.browser_download_url}">Download</a>
        </div>
      `;
    })
    .join("");
}

export function Downloads({ state }: Ctx): string {
  const rel = state.data.releases;

  let body = "";
  if (rel.status === "idle" || rel.status === "loading") {
    body = `<p class="lcd-muted">Loading releases…</p>`;
  } else if (rel.status === "error") {
    body = `<p class="lcd-line">Could not load releases: ${rel.message}</p>`;
  } else if (rel.status === "empty") {
    body = `
      <p class="lcd-line">No public releases yet.</p>
      <p class="lcd-muted">Check back after the first mirrored desktop cut is published.</p>
    `;
  } else if (rel.status === "ok") {
    const latest = rel.releases[0];
    const older = rel.releases.slice(1);
    body = `
      <fieldset class="lcd-fieldset">
        <legend>Latest — ${latest.tag_name}</legend>
        <p class="lcd-muted">${latest.name || latest.tag_name}</p>
        ${assetRows(latest)}
      </fieldset>
      ${
        older.length
          ? older
              .map(
                (r: GhRelease) => `
        <fieldset class="lcd-fieldset">
          <legend>${r.tag_name}</legend>
          <p class="lcd-muted">${r.name || r.tag_name}</p>
          ${assetRows(r)}
        </fieldset>
      `,
              )
              .join("")
          : ""
      }
    `;
  }

  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Downloads</h1>
      <p class="lcd-line">
        Major desktop releases for Windows, macOS, and Linux. Installers are
        <strong>unsigned CI builds</strong> — your OS may warn on open.
      </p>
      ${body}
      <div class="lcd-row">
        <button type="button" class="lcd-ghost" :click=loadReleases()>Refresh</button>
        <button type="button" class="lcd-ghost" :click=setView(target="getting-started")>
          Get started
        </button>
      </div>
    </section>
  `;
}
