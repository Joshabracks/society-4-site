import type { DownloadOs, GhAsset, ReleasesState, VersionRelease } from "../releases";
import { formatBytes } from "../releases";

type Ctx = { state: { data: { releases: ReleasesState; downloadOs: DownloadOs } } };

const OS_CHOICES: { id: DownloadOs; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS (iPhone)" },
];

const osLabel = (os: DownloadOs) => OS_CHOICES.find((o) => o.id === os)?.label ?? os;

/** What to expect on first launch, for the chosen OS. */
const INSTALL_NOTES: Record<Exclude<DownloadOs, "ios">, string> = {
  windows: `
    <p class="lcd-line lcd-signal warn">The installer is <strong>not code-signed</strong>, so Windows may warn on first launch. That's expected, not a sign the download is corrupt.</p>
    <p class="lcd-muted">SmartScreen / “Windows protected your PC” → <strong>More info</strong> → <strong>Run anyway</strong> (wording may vary).</p>`,
  macos: `
    <p class="lcd-line lcd-signal warn">The app is <strong>not code-signed or notarized</strong>, so macOS may block the first launch. That's expected, not a sign the download is corrupt.</p>
    <p class="lcd-muted">“Damaged and can't be opened” is usually Gatekeeper quarantine. Drag the app to Applications, then Control-click / right-click → <strong>Open</strong> → <strong>Open</strong>. Or use <strong>System Settings → Privacy &amp; Security → Open Anyway</strong> after one blocked launch. Full steps on <button type="button" class="lcd-linkish" :click=setView(target="getting-started")>Getting started</button>.</p>`,
  linux: `
    <p class="lcd-line lcd-signal warn">The AppImage is <strong>not code-signed</strong>; your desktop may warn about an untrusted binary.</p>
    <p class="lcd-muted">Mark it executable (<code>chmod +x</code>) if needed, then run it.</p>`,
  android: `
    <p class="lcd-muted">The app is signed. Open the <code>.apk</code> on the phone; Android asks once to allow installs from your browser or files app. For 64-bit ARM phones.</p>`,
};

function assetRow(asset: GhAsset): string {
  return `
    <div class="lcd-asset-row">
      <div>
        <p class="lcd-line">${asset.name}</p>
        <p class="lcd-muted">${formatBytes(asset.size)}</p>
      </div>
      <a href="${asset.browser_download_url}">Download</a>
    </div>`;
}

function section(title: string, assets: GhAsset[] | undefined, os: DownloadOs, extra = ""): string {
  const rows = assets?.length
    ? assets.map(assetRow).join("")
    : `<p class="lcd-muted">Not available for ${osLabel(os)} in this version.</p>`;
  return `<p class="lcd-line lcd-os-heading">${title}</p>${rows}${extra}`;
}

/** The chosen OS's downloads from the newest version. */
function osDownloads(v: VersionRelease, os: Exclude<DownloadOs, "ios">): string {
  const messenger = section("Society 4 - Workspace Messenger", v.assetsByPlatform[os], os, INSTALL_NOTES[os]);
  const node =
    os === "android"
      ? ""
      : section(
          "Society 4 - Agent Node",
          v.nodeByPlatform[os],
          os,
          `<p class="lcd-muted">The node (<code>s4-node</code> + <code>s4-agent</code>) runs an agent from the command line. See <button type="button" class="lcd-linkish" :click=setView(target="run-an-agent")>Run an Agent</button>.</p>`,
        );
  const sums = v.sumsByPlatform[os];
  return `
    <fieldset class="lcd-fieldset">
      <legend>Society 4 ${v.label} — ${osLabel(os)}</legend>
      ${messenger}
      ${node}
      ${sums ? `<p class="lcd-muted">Checksums: <a href="${sums.browser_download_url}">SHA256SUMS</a></p>` : ""}
    </fieldset>`;
}

const IOS = `
  <fieldset class="lcd-fieldset">
    <legend>iOS (iPhone)</legend>
    <p class="lcd-line lcd-os-heading">Coming soon</p>
    <p class="lcd-line">Society 4 for iPhone is on the way. Until then, use the desktop app or Android.</p>
  </fieldset>`;

function picker(os: DownloadOs): string {
  const options = OS_CHOICES.map(
    (o) => `<option value="${o.id}"${o.id === os ? " selected" : ""}>${o.label}</option>`,
  ).join("");
  return `
    <label class="lcd-os-picker">
      <span class="lcd-line">Download for</span>
      <select :change=setDownloadOs()>${options}</select>
    </label>`;
}

export function Downloads({ state }: Ctx): string {
  const os = state.data.downloadOs;
  let body: string;
  if (os === "ios") {
    body = IOS;
  } else {
    const rel = state.data.releases;
    if (rel.status === "idle" || rel.status === "loading") {
      body = `<p class="lcd-muted">Loading releases…</p>`;
    } else if (rel.status === "error") {
      body = `<p class="lcd-line">Could not load releases: ${rel.message}</p>`;
    } else if (rel.status === "empty") {
      body = `
        <p class="lcd-line">No public releases yet.</p>
        <p class="lcd-muted">Check back soon.</p>`;
    } else if (rel.status === "ok") {
      body = osDownloads(rel.versions[0], os);
    } else {
      body = `<p class="lcd-muted">Loading releases…</p>`;
    }
  }

  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Downloads</h1>
      <p class="lcd-line">Pick your operating system to get the Society 4 app and, on desktop, the agent node.</p>
      ${picker(os)}
      ${body}
      <div class="lcd-row">
        <button type="button" class="lcd-ghost" :click=loadReleases()>Refresh</button>
        <button type="button" class="lcd-ghost" :click=setView(target="getting-started")>Get started</button>
      </div>
    </section>
  `;
}
