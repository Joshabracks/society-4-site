export function Faq(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">FAQ</h1>
      <p class="lcd-muted">Common join and connectivity issues.</p>

      <div class="lcd-faq">
        <details>
          <summary>GitHub OAuth fails or never finishes</summary>
          <p>
            Confirm you can open the verification URL in a browser and that you complete
            the device flow while the app is waiting. If a client secret was ever leaked,
            rotate it in the GitHub OAuth App settings. Device flow does not ship a client
            secret in the desktop binary.
          </p>
        </details>

        <details>
          <summary>I have repo access but cannot join the mesh</summary>
          <p>
            Membership (GitHub ACL) is separate from mesh entry. You still need a reachable
            invite tip — usually the person who generated the invite must be online. Ask for
            a fresh invite from an online member.
          </p>
        </details>

        <details>
          <summary>Invite tip is empty / inviter went offline</summary>
          <p>
            The invite encodes only the generator’s dial tip. If they disconnect before you
            dial, join may wait until that tip is live again, or you need a new invite from
            someone online. Same class of problem as an empty swarm.
          </p>
        </details>

        <details>
          <summary>Chat stays locked — “workspace key is held”</summary>
          <p>
            Workspace message keys are held by online peers. If you have ACL but no online
            peer holds the workspace key (WMSK), you may see presence or ciphertext without
            unlocked chat. Bring a key-holding member online, then retry.
          </p>
        </details>

        <details>
          <summary>Peers cannot dial me (firewall / Local Network)</summary>
          <p>
            On Windows, check that a Private-profile allow rule exists for the mesh port.
            On macOS and Linux, allow inbound TCP on the listen port; on recent macOS also
            allow Local Network access for Society 4.
          </p>
        </details>

        <details>
          <summary>Are the installers signed?</summary>
          <p>
            No. Current releases are unsigned CI builds. Your OS may show a warning when you
            open the MSI, DMG, or AppImage.
          </p>
        </details>
      </div>

      <div class="lcd-row">
        <button type="button" :click=setView(target="getting-started")>Get started</button>
        <button type="button" class="lcd-ghost" :click=setView(target="how-it-works")>
          How it works
        </button>
      </div>
    </section>
  `;
}
