export function Home(): string {
  return `
    <section class="lcd-panel">
      <p class="lcd-status">Early access</p>
      <h1 class="lcd-hero-brand">Society 4</h1>
      <p class="lcd-hero-tagline">Chat without a host.</p>
      <p class="lcd-line">
        A decentralized team messenger. Free to run because there is no server.
      </p>
      <ul class="lcd-list">
        <li><strong>No server, no sign-up. </strong>Your account lives on your devices, recoverable from twelve words only you hold.</li>
        <li><strong>Workspaces live with their members. </strong>Channels, DMs, threads and history are shared directly between members' devices, encrypted.</li>
        <li><strong>One link to invite. </strong>Send it however you like; let people in at once, or approve each one.</li>
        <li><strong>Desktop and Android. </strong>Windows, macOS, Linux, and an Android app that stays connected in the background.</li>
      </ul>
      <div class="lcd-row">
        <button type="button" :click=setView(target="downloads")>Download</button>
        <button type="button" class="lcd-ghost" :click=setView(target="getting-started")>
          Get started
        </button>
      </div>
      <p class="lcd-muted">
        Installers aren't code-signed yet, so your OS may warn on first launch.
        See&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="downloads")>Downloads</button>&nbsp;for install notes.
      </p>
    </section>
  `;
}
