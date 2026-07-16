export function Faq(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">FAQ</h1>
      <p class="lcd-muted">Common join, install, and connectivity issues.</p>

      <div class="lcd-faq">
        <details>
          <summary>Are the installers signed?</summary>
          <p>
            No. Current releases are <strong>unsigned CI builds</strong> — not code-signed
            and not Apple-notarized. Your OS may show a warning or block the first launch.
            That is expected until we ship signed / notarized builds. See&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="getting-started")>
              Getting started
            </button>&nbsp;for per-OS install steps.
          </p>
        </details>

        <details>
          <summary>macOS says the app is damaged</summary>
          <p>
            That message is usually <strong>Gatekeeper quarantine</strong> on an unsigned
            download, not a corrupt file.
          </p>
          <ol class="lcd-list">
            <li>
              Drag <strong>Society 4</strong> to <strong>Applications</strong> if you have
              not already.
            </li>
            <li>
              In Finder → Applications, <strong>Control-click</strong> (or right-click)&nbsp;<strong>Society 4</strong> → <strong>Open</strong> → confirm <strong>Open</strong>.
            </li>
            <li>
              If that is unavailable: open the app once so macOS records the block, then go to&nbsp;<strong>System Settings → Privacy &amp; Security</strong>, choose&nbsp;<strong>Open Anyway</strong>, authenticate, and confirm <strong>Open</strong>.
            </li>
            <li>
              <strong>Advanced fallback (Terminal)</strong> only if neither GUI path appears:&nbsp;<code>xattr -cr "/Applications/Society 4.app"</code>, then open the app again.
            </li>
          </ol>
        </details>

        <details>
          <summary>Windows SmartScreen blocks the installer</summary>
          <p>
            Unsigned installers often trigger “Windows protected your PC” or an unknown-publisher
            warning. Choose <strong>More info</strong>, then <strong>Run anyway</strong>&nbsp;(labels may vary by Windows version). Only continue if you downloaded Society 4
            from this site’s Downloads page.
          </p>
        </details>

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
