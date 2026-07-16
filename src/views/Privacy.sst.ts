export function Privacy(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Privacy &amp; security</h1>
      <p class="lcd-line">
        Society 4 is designed to keep chat off a central product host. GitHub is an
        intentional, narrow membership and backup plane — not a live message bus.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>What GitHub sees</legend>
        <ul class="lcd-list">
          <li>That you authenticate (OAuth) and whether you can access the workspace private repo.</li>
          <li>
            Sparse bootstrap / encrypted cold-archive material when the product writes it —
            not a full peer IP roster, and not raw workspace message keys.
          </li>
          <li>Collaborator ACL changes you make on the repo (who may join as a member).</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>What stays on the mesh</legend>
        <ul class="lcd-list">
          <li>Live chat, presence, and peer discovery after the invite tip.</li>
          <li>Dial addresses learned through gossip (not published as a GitHub directory).</li>
          <li>Keys held by online peers for unlocking workspace ciphertext.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Invite exposure</legend>
        <p class="lcd-line">
          An invite reveals the <strong>inviter’s dial tip</strong> (and workspace repo
          identity for ACL). It does not export the whole network’s addresses. Treat invites
          like temporary join credentials: share with intended members only.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Honest limits</legend>
        <p class="lcd-muted">
          This is an early proof of concept. Do not treat Society 4 as a hardened
          high-assurance messenger yet. Prefer private repos, trusted collaborators, and
          up-to-date desktop builds.
        </p>
      </fieldset>

      <div class="lcd-row">
        <button type="button" :click=setView(target="how-it-works")>How it works</button>
        <button type="button" class="lcd-ghost" :click=setView(target="faq")>FAQ</button>
      </div>
    </section>
  `;
}
