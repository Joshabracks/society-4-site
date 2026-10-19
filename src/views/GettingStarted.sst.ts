export function GettingStarted(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Getting started</h1>
      <p class="lcd-line">
        Install Society 4, set up your account (the app walks you through it), then
        create a workspace or join one with an invite link. No sign-up, no email.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>1. Install</legend>
        <p class="lcd-line lcd-signal warn">
          Installers aren't <strong>code-signed </strong>yet (and the macOS build isn't
          notarized). Warnings on first launch are expected.
        </p>
        <p class="lcd-line">
          Open&nbsp;<button type="button" class="lcd-linkish" :click=setView(target="downloads")>Downloads</button>&nbsp;and pick your platform.
        </p>

        <p class="lcd-line lcd-os-heading">Windows</p>
        <ol class="lcd-list">
          <li>Run the <code>.msi </code>(or <code>.exe</code>) installer.</li>
          <li>If SmartScreen says "Windows protected your PC": choose <strong>More info</strong>, then <strong>Run anyway</strong>.</li>
        </ol>

        <p class="lcd-line lcd-os-heading">macOS</p>
        <ol class="lcd-list">
          <li>Open the <code>.dmg </code>and drag <strong>Society 4 </strong>to <strong>Applications</strong>.</li>
          <li>
            In Finder → Applications, <strong>Control-click </strong>(or right-click)
            <strong>Society 4 </strong>→ <strong>Open</strong>, then confirm <strong>Open</strong>.
            If macOS says the app is damaged, that's usually Gatekeeper quarantine, not a corrupt file.
          </li>
          <li>
            If that isn't offered: open the app once, then go to <strong>System Settings → Privacy &amp; Security </strong>and choose <strong>Open Anyway</strong>.
          </li>
          <li>
            Last resort (Terminal): <code>xattr -cr "/Applications/Society 4.app"</code>, then open it again.
          </li>
        </ol>

        <p class="lcd-line lcd-os-heading">Linux</p>
        <ol class="lcd-list">
          <li>AppImage: <code>chmod +x Society4-*.AppImage</code>, then run it. A <code>.deb</code>: install with your package manager.</li>
        </ol>

        <p class="lcd-line lcd-os-heading">Android</p>
        <ol class="lcd-list">
          <li>Download the <code>.apk </code>on the phone and open it. Android asks once to allow installs from your browser or files app.</li>
          <li>When the app asks, allow notifications: it then stays connected in the background, and DMs and mentions notify you.</li>
        </ol>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>2. Set up your account</legend>
        <p class="lcd-line">The first time you open Society 4 it asks whether you've used it before.</p>
        <p class="lcd-line"><strong>New here:</strong></p>
        <ol class="lcd-list">
          <li>Create your account. You're shown your <strong>recovery phrase</strong>: twelve words that are the only way back into your account if you lose your device.</li>
          <li>Save them somewhere secure (the app can copy them), then type back the three it highlights.</li>
          <li>Choose the name people will see. You can change it per workspace later.</li>
          <li>Optionally set up an account backup: a password, then a file, a drive, or another place to keep it.</li>
        </ol>
        <p class="lcd-line"><strong>Used it before: </strong>bring your account to this device in one of four ways.</p>
        <ul class="lcd-list">
          <li><strong>Link to one of my devices: </strong>approve it from a device that already has your account (it shows six words to check).</li>
          <li><strong>Enter my recovery phrase.</strong></li>
          <li><strong>Restore from an account backup, </strong>with its password.</li>
          <li><strong>Recover through a workspace </strong>whose admins keep a backup for you.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>3. Create a workspace</legend>
        <ol class="lcd-list">
          <li>Choose <strong>Create a workspace </strong>and give it a name.</li>
          <li>Optionally make it one where each member has an identity used only there.</li>
          <li>
            Invite people from <strong>Settings → Active workspace → Invite people</strong>:
            <strong>Create invite link </strong>copies it straight to the clipboard. Under
            <strong>Link options </strong>you can let several people use it, set how long it
            works, require approval, or lock it with a code you send separately.
          </li>
          <li>Send the link however you like: a message, email, or the Share button on a phone.</li>
        </ol>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>4. Join with an invite link</legend>
        <ol class="lcd-list">
          <li>Open the <code>society4:// </code>link, or paste it in <strong>Join</strong>.</li>
          <li>Check the workspace's name, and enter the code if the link has one.</li>
          <li>
            Choose <strong>Join</strong>. If the link needs approval, you'll see "Joining…"
            until an admin lets you in. If it takes more than a minute, the people who can
            approve may be offline: contact the person who sent you the link.
          </li>
        </ol>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Firewalls and networks</legend>
        <ul class="lcd-list">
          <li><strong>Windows: </strong>the app adds a firewall rule for its own port on private networks.</li>
          <li><strong>macOS and Linux: </strong>if others can't reach you directly, allow incoming connections for Society 4. On recent macOS, allow Local Network access.</li>
          <li>On mobile data or behind a strict router, a member who can be reached from anywhere relays for you automatically.</li>
        </ul>
      </fieldset>

      <div class="lcd-row">
        <button type="button" :click=setView(target="downloads")>Downloads</button>
        <button type="button" class="lcd-ghost" :click=setView(target="faq")>FAQ</button>
      </div>
    </section>
  `;
}
