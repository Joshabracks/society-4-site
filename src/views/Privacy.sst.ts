export function Privacy(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Privacy &amp; security</h1>
      <p class="lcd-line">
        There's no Society 4 server, account system or analytics. What you write stays
        on the devices of the people you share a workspace with.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>Messages</legend>
        <ul class="lcd-list">
          <li>Encrypted with keys only the workspace's members hold; direct messages have their own keys.</li>
          <li>Signed by the sending device, and accepted only from members' devices.</li>
          <li>Relayed traffic stays encrypted: a member relaying for someone else can't read it.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Your keys and phrase</legend>
        <ul class="lcd-list">
          <li>Your keys stay on your device, protected by the system's key store (the Windows, macOS or Linux keychain, or the Android Keystore).</li>
          <li>Your recovery phrase is the only way back into your account. Nobody can recover it for you, and anyone who has it can act as you.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>What others can see</legend>
        <ul class="lcd-list">
          <li><strong>Members of a workspace: </strong>the name and picture you give that workspace, when you're online, and your messages there.</li>
          <li>
            <strong>Network addresses: </strong>devices that connect directly see each other's
            IP address, as with any peer-to-peer app. An invite link carries the addresses of
            the devices it lists, so share links only with the people you mean to invite.
          </li>
          <li><strong>Friends </strong>see the profile you set for friends, and becoming friends gives each of you the network addresses of the other's connected devices.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Backups</legend>
        <ul class="lcd-list">
          <li>Account backups are encrypted with a password you choose. Wherever they're kept, only that password opens them.</li>
          <li>With Google Drive (where available), Society 4 can see only the files it creates there, and Google sees only the encrypted file.</li>
          <li>Workspace backups follow the workspace's policy, which says who may write and read them.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>On your device only</legend>
        <p class="lcd-line">
          The Device log (Settings → Active workspace) records what your device did and
          refused, for working out problems. It's never sent to anyone.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Honest limits</legend>
        <p class="lcd-muted">
          Society 4 is early software and hasn't had an independent security audit. Keep
          your app up to date, and don't rely on it yet where a compromise would put people
          at risk.
        </p>
      </fieldset>

      <div class="lcd-row">
        <button type="button" :click=setView(target="how-it-works")>How it works</button>
        <button type="button" class="lcd-ghost" :click=setView(target="faq")>FAQ</button>
      </div>
    </section>
  `;
}
