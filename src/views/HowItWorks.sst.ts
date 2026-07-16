export function HowItWorks(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">How it works</h1>
      <p class="lcd-line">
        Society 4 separates <strong>who may join</strong> from <strong>where chat lives</strong>.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>Peer mesh</legend>
        <p class="lcd-line">
          Messages, presence, and keys exchange peer-to-peer (libp2p). There is no mandatory
          Society 4 chat backend and no product-run relay you must use.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>GitHub membership</legend>
        <p class="lcd-line">
          Each workspace is bound to one <strong>private GitHub repository</strong>.
          Repo access (via browser OAuth) proves you are a member. The repo may also hold
          minimal bootstrap data and a sparse encrypted cold backup — never a live peer IP
          directory, and never plaintext chat as a message bus.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Invite tip</legend>
        <p class="lcd-line">
          An invite link (<code>society4://…</code>) encodes the workspace repo plus&nbsp;<strong>only the inviter’s dial tip</strong> (their machine). After you connect
          and prove membership, you discover other peers through mesh gossip — not through
          a GitHub address book.
        </p>
        <p class="lcd-muted">
          Sharing an invite exposes the inviter’s tip while it is reachable, not everyone’s
          addresses.
        </p>
      </fieldset>

      <div class="lcd-row">
        <button type="button" :click=setView(target="getting-started")>Get started</button>
        <button type="button" class="lcd-ghost" :click=setView(target="privacy")>
          Privacy &amp; security
        </button>
      </div>
    </section>
  `;
}
