export function Faq(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">FAQ</h1>
      <p class="lcd-muted">Installing, joining, staying connected, and getting your account back.</p>

      <div class="lcd-faq">
        <details>
          <summary>Is there a server? Who can read my messages?</summary>
          <p>
            There's no Society 4 server. Messages go directly between the devices of a
            workspace's members, encrypted with keys only members hold, and signed by the
            device that sent them. A member relaying traffic for someone else can't read it.
          </p>
        </details>

        <details>
          <summary>Are the installers signed?</summary>
          <p>
            Not yet: they aren't code-signed, and the macOS build isn't notarized, so your
            OS may warn or block the first launch. Only install what you downloaded from this
            site. See&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="getting-started")>Getting started</button>&nbsp;for each platform's steps.
          </p>
        </details>

        <details>
          <summary>macOS says the app is damaged</summary>
          <p>That's usually <strong>Gatekeeper quarantine </strong>on an unsigned download, not a corrupt file.</p>
          <ol class="lcd-list">
            <li>Drag <strong>Society 4 </strong>to <strong>Applications</strong>.</li>
            <li>In Finder → Applications, <strong>Control-click </strong>it → <strong>Open </strong>→ confirm <strong>Open</strong>.</li>
            <li>Or open it once, then <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>.</li>
            <li>Last resort (Terminal): <code>xattr -cr "/Applications/Society 4.app"</code>.</li>
          </ol>
        </details>

        <details>
          <summary>Windows SmartScreen blocks the installer</summary>
          <p>
            Unsigned installers often trigger "Windows protected your PC". Choose
            <strong>More info</strong>, then <strong>Run anyway</strong>.
          </p>
        </details>

        <details>
          <summary>I lost my phone or computer. How do I get my account back?</summary>
          <ul class="lcd-list">
            <li>From another device that has your account: on the new one choose <strong>Link to one of my devices</strong>.</li>
            <li>With your twelve-word <strong>recovery phrase</strong>.</li>
            <li>From an <strong>account backup </strong>and its password.</li>
            <li>Through a workspace whose admins keep a backup for you: ask a member for an invite link, then <strong>Recover through a workspace</strong>.</li>
          </ul>
          <p>
            Afterwards, a member of each workspace can make you a <strong>recovery link </strong>
            (Settings → Active workspace → Members → your name) to rejoin. If the old device
            might be in someone else's hands, replace your account key in Settings → Account → Account key.
          </p>
        </details>

        <details>
          <summary>Joining is taking a long time</summary>
          <p>
            A link that needs approval waits for an admin or approver to let you in. If no one
            who can approve is online, it waits; you'll get in on your own once they are.
            Contact the person who sent you the link. If your request is declined, the app
            tells you.
          </p>
        </details>

        <details>
          <summary>The link only works on the same Wi-Fi</summary>
          <p>
            Under a new invite link, <strong>Where this link connects </strong>shows what it carries.
            "Only people on the same network can use this link right now" means none of the
            devices in it can be reached from outside yet. That's common for a phone on mobile
            data. Make the link again once a member who can be reached from anywhere is
            online (they relay), or from a computer on a network that allows it.
          </p>
        </details>

        <details>
          <summary>Chat says it's getting the message key</summary>
          <p>
            A new member gets the workspace's keys from members who are online. If no one is,
            chat unlocks as soon as someone comes online.
          </p>
        </details>

        <details>
          <summary>Others can't reach me</summary>
          <p>
            On Windows the app adds a firewall rule for its port on private networks. On macOS
            and Linux, allow incoming connections for Society 4, and on recent macOS allow
            Local Network access. When a direct connection isn't possible, a member who can be
            reached from anywhere relays for you.
          </p>
        </details>

        <details>
          <summary>Android: messages arrive late, or the app stops</summary>
          <p>
            Allow notifications when asked: that's what keeps Society 4 connected in the
            background. If your phone still stops it, let it run without battery limits
            (the app offers this in Settings → General → Notifications).
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
