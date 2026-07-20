export function GettingStarted(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Getting started</h1>
      <p class="lcd-line">
        Install Society 4, then either <strong>create</strong> a workspace or&nbsp;<strong>join</strong> with an invite. Both paths use GitHub OAuth in the browser.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>1. Install</legend>
        <p class="lcd-line lcd-signal warn">
          Installers are <strong>unsigned CI builds</strong> (not code-signed / not notarized).
          OS warnings on first launch are expected.
        </p>
        <ol class="lcd-list">
          <li>
            Open&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="downloads)">
              Downloads
            </button>&nbsp;and pick your OS (Windows / macOS / Linux). Installer filenames also include
            <code>windows</code>, <code>macos</code>, or <code>linux</code>.
          </li>
        </ol>

        <p class="lcd-line lcd-os-heading">Windows</p>
        <ol class="lcd-list">
          <li>Run the <code>.msi</code> (or <code>.exe</code>) installer.</li>
          <li>
            If SmartScreen / “Windows protected your PC” appears: choose&nbsp;<strong>More info</strong>, then <strong>Run anyway</strong>.
          </li>
          <li>Launch Society 4 and sign in with GitHub when prompted.</li>
        </ol>

        <p class="lcd-line lcd-os-heading">macOS</p>
        <ol class="lcd-list">
          <li>Open the <code>.dmg&nbsp;</code> and drag <strong>Society 4</strong> to <strong>Applications</strong>.</li>
          <li>
            In Finder → Applications, <strong>Control-click&nbsp;</strong> (or right-click)&nbsp;<strong>Society 4&nbsp;</strong> → <strong>Open</strong>, then confirm <strong>Open</strong>.
            This is the preferred path when macOS says the app is damaged or can’t be opened —
            that message is usually Gatekeeper quarantine, not a corrupt file.
          </li>
          <li>
            If that option is unavailable: try opening the app once normally, then open&nbsp;<strong>System Settings → Privacy &amp; Security</strong>, find the blocked-app notice,
            choose <strong>Open Anyway</strong>, authenticate, and confirm <strong>Open</strong>.
            The button appears only after macOS has blocked a recent launch.
          </li>
          <li>
            <strong>Advanced fallback (Terminal)</strong> — only if neither GUI path is offered:&nbsp;<code>xattr -cr "/Applications/Society 4.app"</code>, then open the app again.
          </li>
          <li>Sign in with GitHub when prompted (device flow opens a browser verification page).</li>
        </ol>

        <p class="lcd-line lcd-os-heading">Linux</p>
        <ol class="lcd-list">
          <li>
            For an AppImage: <code>chmod +x Society4-*.AppImage</code>, then run it.
            For a <code>.deb</code>: install with your package manager.
          </li>
          <li>Your desktop may warn about an untrusted binary — proceed if you trust this release.</li>
          <li>Sign in with GitHub when prompted.</li>
        </ol>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Create a workspace</legend>
        <ol class="lcd-list">
          <li>
            On GitHub, create an <strong>empty private repository</strong> for the team and
            invite collaborators who should be members.
          </li>
          <li>In Society 4, open or bind that repository as the workspace (first peer online).</li>
          <li>
            When others are ready, use <strong>Generate invite link</strong> while you are
            online so the invite includes a live dial tip.
          </li>
        </ol>
        <p class="lcd-muted">
          Membership is the private repo ACL. Chat history and keys stay on the peer mesh
          (plus optional sparse encrypted backup on the repo).
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Join via invite</legend>
        <ol class="lcd-list">
          <li>Ensure you have been granted access to the workspace’s private GitHub repo.</li>
          <li>
            Open the <code>society4://…</code> invite (or paste it in the app). Society 4
            completes browser GitHub login and checks repo access.
          </li>
          <li>
            The client dials the <strong>inviter tip</strong> in the link, authenticates on
            the mesh, then learns other peers via gossip.
          </li>
        </ol>
        <p class="lcd-muted">
          If the inviter goes offline before you dial, wait for them (or get a fresh invite
          from someone who is online).
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Mesh / firewall</legend>
        <ul class="lcd-list">
          <li>
            <strong>Windows:</strong> the app may add a Private-profile firewall allow rule
            for the mesh TCP port.
          </li>
          <li>
            <strong>macOS / Linux:</strong> allow inbound TCP on the listen port yourself if
            peers cannot dial you. On newer macOS, grant Local Network permission.
          </li>
        </ul>
      </fieldset>

      <div class="lcd-row">
        <button type="button" :click=setView(target="downloads")>Downloads</button>
        <button type="button" class="lcd-ghost" :click=setView(target="faq")>FAQ</button>
      </div>
    </section>
  `;
}
