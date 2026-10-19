import type { ReleasesState, VersionRelease, PlatformId, GhAsset } from "../releases";
import {
  formatBytes,
  platformLabel,
} from "../releases";

type Ctx = { state: { data: { releases: ReleasesState } } };

function flatAssets(v: VersionRelease): { platform: PlatformId; asset: GhAsset }[] {
  const preferred: PlatformId[] = ["windows", "macos", "linux", "android"];
  const rows: { platform: PlatformId; asset: GhAsset }[] = [];
  for (const platform of preferred) {
    const list = v.assetsByPlatform[platform];
    if (!list?.length) continue;
    for (const asset of list) {
      rows.push({ platform, asset });
    }
  }
  return rows;
}

function assetRows(v: VersionRelease, latest: boolean): string {
  const rows = flatAssets(v);
  if (!rows.length) {
    return `<p class="lcd-muted">No installer assets for this version yet.</p>`;
  }
  const missing = (["windows", "macos", "linux", "android"] as PlatformId[]).filter(
    (p) => !v.platforms.includes(p),
  );
  const links = rows
    .map(({ platform, asset }) => {
      const plat = platformLabel(platform);
      return `
        <div class="lcd-asset-row">
          <div>
            <p class="lcd-line"><strong>${plat} </strong>— ${asset.name}</p>
            <p class="lcd-muted">${formatBytes(asset.size)}</p>
          </div>
          <a href="${asset.browser_download_url}">Download</a>
        </div>
      `;
    })
    .join("");
  // Only for the latest: older versions predate some platforms (Android).
  const pending = latest && missing.length
    ? `<p class="lcd-muted">Not published yet: ${missing.map(platformLabel).join(", ")}</p>`
    : "";
  return `${links}${pending}`;
}

function versionBlock(v: VersionRelease, latest: boolean): string {
  const legend = latest ? `Latest — ${v.label}` : v.label;
  return `
    <fieldset class="lcd-fieldset">
      <legend>${legend}</legend>
      <p class="lcd-muted">Society 4 ${v.label}</p>
      ${assetRows(v, latest)}
    </fieldset>
  `;
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
      <p class="lcd-muted">Check back after the first desktop cut is published.</p>
    `;
  } else if (rel.status === "ok") {
    const [latest, ...older] = rel.versions;
    body = `
      ${versionBlock(latest, true)}
      ${older.map((v) => versionBlock(v, false)).join("")}
    `;
  }

  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Downloads</h1>
      <p class="lcd-line">
        Releases for Windows, macOS, Linux and Android.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>Unsigned builds — read before install</legend>
        <p class="lcd-line lcd-signal warn">
          These installers are <strong>not code-signed&nbsp;</strong> and the macOS build is&nbsp;<strong>not notarized</strong>. Your OS may warn or block the first launch —
          that is expected, not proof the download is corrupt.
        </p>
        <ul class="lcd-list">
          <li>
            <strong>Windows: </strong>SmartScreen / “Windows protected your PC” →
            <strong>&nbsp;More info&nbsp;</strong> → <strong>&nbsp;Run anyway </strong>(wording may vary).
          </li>
          <li>
            <strong>macOS: </strong>“damaged and can’t be opened” is usually Gatekeeper
            quarantine. Prefer Finder: drag to Applications, then Control-click /
            right-click → <strong>Open</strong>&nbsp;→&nbsp;<strong>Open</strong>. Or use&nbsp;<strong>System Settings → Privacy &amp; Security → Open Anyway</strong>&nbsp;after one blocked launch. Full steps on&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="getting-started")>
              Getting started
            </button>&nbsp;/&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="faq")>
              FAQ
            </button>.
          </li>
          <li>
            <strong>Linux: </strong>mark an AppImage executable
            (<code>chmod +x</code>) if needed; your desktop may still warn on an
            untrusted binary.
          </li>
          <li>
            <strong>Android: </strong>open the <code>.apk</code>&nbsp;on the phone; Android asks
            once to allow installs from your browser or files app.
          </li>
        </ul>
      </fieldset>

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
