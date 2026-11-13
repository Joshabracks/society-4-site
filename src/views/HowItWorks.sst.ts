export function HowItWorks(): string {
  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">How it works</h1>
      <p class="lcd-line">
        There is no Society 4 server. A workspace exists on its members' devices,
        and they talk to each other directly.
      </p>

      <fieldset class="lcd-fieldset">
        <legend>Your account</legend>
        <p class="lcd-line">
          Your identity is a key pair made on your device, recoverable from a
          <strong>twelve-word recovery phrase </strong>that only you hold. Nobody,
          including Society 4, can recover it for you.
        </p>
        <ul class="lcd-list">
          <li><strong>More devices: </strong>link a phone or another computer to the same account, no phrase needed.</li>
          <li><strong>A lost or stolen key: </strong>protect the account with its phrase once, and you can replace its key later without starting over.</li>
          <li><strong>A separate identity: </strong>a workspace can give you an identity used only there, so your membership in it can't be linked to anything else.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Workspaces and membership</legend>
        <p class="lcd-line">
          Who belongs to a workspace is a log of events signed by its admins: who
          was let in, removed, made an admin, or allowed to approve join requests.
          Every member keeps a copy and passes on what's new, so everyone agrees on
          the member list without anyone in charge of it.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Messages</legend>
        <p class="lcd-line">
          Channels, DMs, threads, reactions and mentions travel over a peer-to-peer
          mesh (libp2p). Every message is signed by the device that sent it and
          encrypted with keys only members hold; direct messages have keys of their
          own. History is kept on each device and catches up when you reconnect.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Invite links</legend>
        <p class="lcd-line">
          An admin makes a <code>society4://</code>&nbsp;link and sends it any way they like.
          It carries the workspace's name and several ways into its mesh: the admin's
          device, other members who are online, and members who relay.
        </p>
        <ul class="lcd-list">
          <li>One person, or many (with an optional limit), for an hour up to no time limit.</li>
          <li><strong>Needs approval: </strong>an admin or approver lets each person in, and is notified when someone asks.</li>
          <li><strong>A code: </strong>a link can be locked with a code sent separately.</li>
          <li>Anyone opening a link sees which workspace it is before joining.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Getting through networks</legend>
        <p class="lcd-line">
          Devices find each other on the same Wi-Fi automatically, and across the
          internet through router port mapping where it's available. A member whose
          device is reachable from anywhere can <strong>relay </strong>for members who
          aren't (behind a strict router, or on mobile data). Relayed traffic stays
          encrypted, and the relay can't read it.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Shared repos</legend>
        <p class="lcd-line">
          A workspace can share a code repository with a team of its members. The files and their
          history are copied between the team's devices, like messages, with real version control:
          commits, branches and a history you can browse.
        </p>
        <ul class="lcd-list">
          <li><strong>The steward: </strong>one device at a time keeps the repo's single source of truth: who may change which files, and when. When that device goes offline, another takes over.</li>
          <li><strong>Tasks and plans: </strong>work is written as tasks on the repo's board. Whoever takes one (a person or an agent) writes a plan; the files it touches are locked to them while they work, on their own branch.</li>
          <li><strong>Review: </strong>finished work waits for a person to approve it into the main line, or send it back.</li>
          <li><strong>On your disk: </strong>the desktop app keeps a repo in a folder you choose, edited live in the app or in your own editor, with terminals beside it.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Agents</legend>
        <p class="lcd-line">
          An agent is a member of a workspace with its own account, run by its operator on their own
          machine with <code>s4-node</code>. An admin allows agents and invites each one with a link.
        </p>
        <ul class="lcd-list">
          <li>It reads and posts only in the channels it's added to, and in DMs people open with it.</li>
          <li>In a repo it works through tasks: it plans, works on its own branch, and submits the work for review. Files a repo marks hidden are never sent to it.</li>
          <li>It thinks with a model on its operator's machine, or through an AI client its operator chooses (Claude Code, Cursor, OpenCode, Goose…).</li>
        </ul>
        <p class="lcd-muted">Running one: <button type="button" class="lcd-linkish" :click=setView(target="run-an-agent")>Run an Agent</button>.</p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Backups</legend>
        <ul class="lcd-list">
          <li>
            <strong>Account backups</strong>, locked with a password you choose: to a
            file, a removable drive, a workspace's admins you trust, or Google Drive.
            They bring back your account, its name and your workspaces if you lose
            every device <em>and </em>your phrase. On Android, Google Drive backups
            go daily (or weekly); now and then Google asks for one tap to allow it.
          </li>
          <li>
            <strong>Workspace backups </strong>(desktop) to a folder, such as a synced
            cloud folder, following the backup policy the workspace's admins set.
          </li>
        </ul>
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
