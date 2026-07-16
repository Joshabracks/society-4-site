export function Home(): string {
  return `
    <section class="lcd-panel">
      <p class="lcd-status">Early PoC · Phase 3 text MVP</p>
      <h1 class="lcd-hero-brand">Society 4</h1>
      <p class="lcd-hero-tagline">Chat without a host.</p>
      <p class="lcd-line">
        A decentralized team messenger. Channels, DMs, and history live on a peer mesh —
        not on a Society 4 chat server. GitHub is used only for membership and sparse
        encrypted backup.
      </p>
      <div class="lcd-row">
        <button type="button" :click=setView(target="downloads")>Download</button>
        <button type="button" class="lcd-ghost" :click=setView(target="getting-started")>
          Get started
        </button>
      </div>
      <p class="lcd-muted">
        Desktop installers are unsigned CI builds — your OS may warn on first launch.
        See&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="downloads)">
          Downloads
        </button>&nbsp;for OS-specific install notes.
      </p>
    </section>
  `;
}
