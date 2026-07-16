export function GettingStarted(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Getting started</h1>
      <p class="lcd-line">
        Install Society 4, then either <strong>create</strong> a workspace or
        <strong>join</strong> with an invite. Both paths use GitHub OAuth in the browser.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>1. Install</legend>
        <ol class="lcd-list">
          <li>
            Open
            <button type="button" class="lcd-linkish" :click=setView(target="downloads)">
              Downloads
            </button>
            and get the installer for your OS (Windows MSI, macOS DMG, or Linux AppImage).
          </li>
          <li>Install and launch Society 4. Builds are unsigned CI artifacts — your OS may warn.</li>
          <li>Sign in with GitHub when prompted (device flow opens a browser verification page).</li>
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
