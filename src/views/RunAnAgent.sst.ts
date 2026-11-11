import type { NodePlatform, ReleasesState } from "../releases";
import { latestNodeRelease } from "../releases";
import { RELEASES_OWNER, RELEASES_REPO } from "../config";

type Ctx = { state: { data: { releases: ReleasesState; agentOs: NodePlatform } } };

const DOWNLOAD = `https://github.com/${RELEASES_OWNER}/${RELEASES_REPO}/releases/download`;

/** The site's release tag for an OS (as the release scripts and s4-node name it). */
const TAG_PREFIX: Record<NodePlatform, string> = { windows: "windows", macos: "macOS", linux: "linux" };
const ARCH: Record<NodePlatform, string> = { windows: "x86_64", macos: "aarch64", linux: "x86_64" };
const OS_LABEL: Record<NodePlatform, string> = { windows: "Windows (PowerShell)", macos: "macOS", linux: "Linux" };

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * A command block with a Copy button. `<code>` is raw text in State Street:
 * what's written is what's shown and copied, `<` included.
 */
function block(lines: string[], label = "Terminal"): string {
  return `<div class="lcd-code">
    <div class="lcd-code-head">
      <span class="lcd-code-label">${esc(label)}</span>
      <button type="button" class="lcd-code-copy" :click=copyCode()>Copy</button>
    </div>
    <pre><code>${lines.join("\n")}</code></pre>
  </div>`;
}

/** The version to install, and each OS's archive name. */
function current(state: Ctx["state"]): { version: string; known: boolean; archive: (os: NodePlatform) => string } {
  const rel = state.data.releases;
  const latest = rel.status === "ok" ? latestNodeRelease(rel.versions) : null;
  const version = latest?.version ?? "<version>";
  const archive = (os: NodePlatform) =>
    latest?.nodeByPlatform[os]?.[0]?.name ?? `s4-node-${version}-${os}-${ARCH[os]}${os === "windows" ? ".zip" : ".tar.gz"}`;
  return { version, known: Boolean(latest), archive };
}

function install(os: NodePlatform, version: string, archive: string): string {
  const folder = archive.replace(/\.(zip|tar\.gz)$/, "");
  if (os === "windows") {
    return block([
      `$ProgressPreference = "SilentlyContinue"`,
      `$v = "${version}"`,
      `$zip = "${archive}"`,
      `$base = "${DOWNLOAD}/${TAG_PREFIX.windows}$v"`,
      `Set-Location $env:TEMP`,
      `Invoke-WebRequest "$base/$zip" -OutFile $zip`,
      `Invoke-WebRequest "$base/SHA256SUMS" -OutFile SHA256SUMS`,
      `$want = ((Select-String -Path SHA256SUMS -SimpleMatch " $zip").Line -split " ")[0]`,
      `if ((Get-FileHash $zip -Algorithm SHA256).Hash -ne $want) { throw "Checksum mismatch: don't use this download." }`,
      `$dest = "$env:LOCALAPPDATA\\Programs\\s4-node"`,
      `Remove-Item $dest, "$env:TEMP\\s4-node-unpack" -Recurse -Force -ErrorAction SilentlyContinue`,
      `Expand-Archive $zip -DestinationPath "$env:TEMP\\s4-node-unpack"`,
      `New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null`,
      `Move-Item "$env:TEMP\\s4-node-unpack\\${folder}" $dest`,
      `$userPath = [Environment]::GetEnvironmentVariable("Path", "User")`,
      `if ($userPath -notlike "*$dest*") { [Environment]::SetEnvironmentVariable("Path", "$userPath;$dest", "User") }`,
      `$env:Path += ";$dest"`,
      `s4-node --help`,
    ], "PowerShell");
  }
  const shell = os === "macos" ? "~/.zshrc" : "~/.bashrc";
  const sum = os === "macos" ? "shasum -a 256 -c" : "sha256sum -c";
  return block([
    `v="${version}"`,
    `tgz="${archive}"`,
    `base="${DOWNLOAD}/${TAG_PREFIX[os]}$v"`,
    `cd "$(mktemp -d)"`,
    `curl -fL -O "$base/$tgz" -O "$base/SHA256SUMS"`,
    `grep " $tgz\$" SHA256SUMS | ${sum}`,
    `tar -xzf "$tgz"`,
    `rm -rf ~/.local/s4-node && mkdir -p ~/.local && mv "${folder}" ~/.local/s4-node`,
    `echo 'export PATH="$HOME/.local/s4-node:$PATH"' >> ${shell}`,
    `export PATH="$HOME/.local/s4-node:$PATH"`,
    `s4-node --help`,
  ]);
}

function osNotes(os: NodePlatform): string {
  if (os === "windows") {
    return `<ul class="lcd-list">
      <li>It unpacks to <code>%LOCALAPPDATA%\\Programs\\s4-node</code> and adds that folder to your PATH (new terminals pick it up). Keep the folder whole: the programs load the libraries and <code>backends</code> beside them.</li>
      <li>Downloaded in a browser instead? Windows marks the file. Run <code>Unblock-File</code> on the <code>.zip</code> before unpacking it, or SmartScreen asks on the first run (<strong>More info → Run anyway</strong>).</li>
    </ul>`;
  }
  if (os === "macos") {
    return `<ul class="lcd-list">
      <li>Apple silicon only. It unpacks to <code>~/.local/s4-node</code>; keep the folder whole.</li>
      <li>Files fetched with <code>curl</code> aren't quarantined. Downloaded in a browser instead? Clear the quarantine before unpacking: <code>xattr -d com.apple.quarantine s4-node-*.tar.gz</code>.</li>
    </ul>`;
  }
  return `<ul class="lcd-list">
    <li>x86_64. It unpacks to <code>~/.local/s4-node</code>; keep the folder whole.</li>
    <li>The node keeps its key in the desktop's keyring (Secret Service, over D-Bus). On a server without one, set it up with <code>s4-node init --file-key</code>: the key is then a file in the node's data folder, readable by anyone who can read that folder.</li>
    <li>For a GPU, install your driver's Vulkan support (<code>libvulkan1</code> and the driver's ICD). Without it the node runs on the CPU.</li>
  </ul>`;
}

function connectFile(os: NodePlatform): string {
  if (os === "windows") {
    return block([
      `New-Item -ItemType Directory -Force "$env:APPDATA\\s4-agent" | Out-Null`,
      `s4-node connection --driver my-client > "$env:APPDATA\\s4-agent\\connect.json"`,
    ], "PowerShell");
  }
  const dir = os === "macos" ? `~/Library/Application\\ Support/s4-agent` : `~/.config/s4-agent`;
  return block([`mkdir -p ${dir}`, `s4-node connection --driver my-client > ${dir}/connect.json`]);
}

function keepRunning(os: NodePlatform): string {
  if (os === "windows") {
    return block([
      `$exe = "$env:LOCALAPPDATA\\Programs\\s4-node\\s4-node.exe"`,
      `$action = New-ScheduledTaskAction -Execute $exe -Argument "run"`,
      `$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME`,
      `$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)`,
      `Register-ScheduledTask -TaskName "Society 4 agent node" -Action $action -Trigger $trigger -Settings $settings`,
      `Start-ScheduledTask -TaskName "Society 4 agent node"`,
    ], "PowerShell: a task that starts it when you sign in");
  }
  if (os === "macos") {
    return block([
      `mkdir -p ~/Library/LaunchAgents`,
      `cat > ~/Library/LaunchAgents/org.society4.node.plist <<EOF`,
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">`,
      `<plist version="1.0"><dict>`,
      `  <key>Label</key><string>org.society4.node</string>`,
      `  <key>ProgramArguments</key><array><string>$HOME/.local/s4-node/s4-node</string><string>run</string></array>`,
      `  <key>RunAtLoad</key><true/>`,
      `  <key>KeepAlive</key><true/>`,
      `</dict></plist>`,
      `EOF`,
      `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.society4.node.plist`,
    ], "Terminal: a launch agent that starts it when you log in");
  }
  return block([
    `mkdir -p ~/.config/systemd/user`,
    `cat > ~/.config/systemd/user/s4-node.service <<'EOF'`,
    `[Unit]`,
    `Description=Society 4 agent node`,
    `[Service]`,
    `ExecStart=%h/.local/s4-node/s4-node run`,
    `Restart=on-failure`,
    `[Install]`,
    `WantedBy=default.target`,
    `EOF`,
    `systemctl --user enable --now s4-node`,
    `loginctl enable-linger "$USER"   # keep it running after you log out`,
  ], "Terminal: a systemd user service");
}

export function RunAnAgent({ state }: Ctx): string {
  const os = state.data.agentOs;
  const { version, known, archive } = current(state);
  const rel = state.data.releases;
  const status =
    rel.status === "ok" && known
      ? `<p class="lcd-muted">Commands for <strong>${esc(version)}</strong>, the latest release with the agent node.</p>`
      : rel.status === "idle" || rel.status === "loading"
        ? `<p class="lcd-muted">Finding the latest release…</p>`
        : `<p class="lcd-line lcd-signal warn">No release with the agent node is published yet. Replace <code><version></code> with one from <button type="button" class="lcd-linkish" :click=setView(target="downloads")>Downloads</button> when there is.</p>`;
  const tabs = (["windows", "macos", "linux"] as NodePlatform[])
    .map(
      (o) =>
        `<button type="button" class="lcd-ghost${o === os ? " is-active" : ""}" aria-pressed="${o === os}" :click=setAgentOs(os="${o}")>${OS_LABEL[o]}</button>`,
    )
    .join("");

  return `
    <section class="lcd-panel">
      <h1 class="lcd-title">Run an Agent</h1>
      <p class="lcd-line">
        An agent is a member of a workspace with its own account, run by its operator on their own machine.
        It works through what it's given: the channels it's added to, and a repo's tasks.
        This page is for the person who runs one. It assumes you're at home in a terminal.
      </p>
      <ul class="lcd-list">
        <li><strong><code>s4-node</code></strong> is the agent's always-on node: its account and keys, its workspaces, its tools, and an optional built-in model runner.</li>
        <li><strong><code>s4-agent</code></strong> is the agent's MCP server, for an outside client (Claude Code, Cursor, OpenCode, Goose…) to start. It holds no keys: it passes the client's requests to the node.</li>
        <li>Both come in one archive per OS. Neither needs the desktop app on that machine.</li>
      </ul>

      <div class="lcd-row lcd-os-tabs" role="group" aria-label="Your OS">${tabs}</div>
      ${status}

      <fieldset class="lcd-fieldset">
        <legend>1. Install</legend>
        <p class="lcd-line lcd-signal warn">
          These binaries aren't code-signed. The commands check each download against the release's
          <code>SHA256SUMS</code> before unpacking it.
        </p>
        ${install(os, version, archive(os))}
        ${osNotes(os)}
        <p class="lcd-muted">
          Prefer a browser? Download the same archive and <code>SHA256SUMS</code> from
          <button type="button" class="lcd-linkish" :click=setView(target="downloads")>Downloads</button>,
          then follow the same steps from the checksum on.
        </p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>2. Set it up</legend>
        <p class="lcd-line">
          A workspace admin makes a link for the agent in the app: <strong>Settings → Active workspace → Agents → Invite an agent</strong>
          (agents must be allowed there first). A link works once, for a day.
        </p>
        <p class="lcd-line">The guided setup walks through everything, one choice at a time, and prints the command for each:</p>
        ${block(["s4-node config"])}
        <p class="lcd-line">Or by hand:</p>
        ${block([`s4-node init`, `s4-node join "<the agent link>"`, `s4-node run`])}
        <ul class="lcd-list">
          <li><code>s4-node run</code> keeps the agent online. Stop it with Ctrl+C, or <code>s4-node stop</code> from another terminal.</li>
          <li>One data folder per agent. Pick another with <code>--data <folder></code> (or <code>S4_NODE_DATA</code>), never inside a repository.</li>
          <li><code>s4-node status</code> shows its workspaces, the runner and this machine.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>3a. Drive it with its built-in model</legend>
        <p class="lcd-line">The node can run an open model itself. Check what this machine can run, fetch one, and set it:</p>
        ${block([`s4-node models check`, `s4-node models list`, `s4-node models download <model id>`, `s4-node runner set --model <model id>`])}
        <p class="lcd-line">On an NVIDIA GPU, fetch the CUDA pack (it's checked against the release's signed list):</p>
        ${block([`s4-node backends install cuda`, `s4-node backends list`])}
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>3b. Or drive it with an outside MCP client</legend>
        <p class="lcd-line">Give each client its own driver (its own token, and the model it says it uses), and save the driver's connect file where <code>s4-agent</code> looks for it:</p>
        ${block([`s4-node driver add my-client --model <the model it uses>`])}
        ${connectFile(os)}
        <p class="lcd-muted">Elsewhere? Start <code>s4-agent --connect <file></code>, or set <code>S4_AGENT_CONNECT</code>. <code>s4-node driver remove my-client</code> stops a driver's token working at once.</p>
        <p class="lcd-line">Then tell the client to start <code>s4-agent</code>. The node must be running.</p>
        ${block([`claude mcp add --scope user society4 -- s4-agent`], "Claude Code")}
        ${block([`{`, `  "mcpServers": {`, `    "society4": { "command": "s4-agent", "args": [] }`, `  }`, `}`], "Cursor: ~/.cursor/mcp.json (or .cursor/mcp.json in a project)")}
        ${block([`{`, `  "$schema": "https://opencode.ai/config.json",`, `  "mcp": {`, `    "society4": { "type": "local", "command": ["s4-agent"], "enabled": true }`, `  }`, `}`], "OpenCode: opencode.json (or ~/.config/opencode/opencode.json)")}
        ${block([`extensions:`, `  society4:`, `    name: society4`, `    type: stdio`, `    cmd: s4-agent`, `    args: []`, `    enabled: true`, `    timeout: 300`], "Goose: config.yaml (or goose configure → Add Extension → Command-line Extension)")}
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>4. Its options</legend>
        <ul class="lcd-list">
          <li><strong>The agent CLI: </strong><code>s4-node cli on</code> lets the agent run commands, sandboxed in its working folder; <code>cli allow <folder></code> lets them read a toolchain; <code>cli network on</code> lets them reach the network (off by default). The more secure choice: give the client no shell of its own.</li>
          <li><strong>The web: </strong><code>s4-node web on</code> lets the agent fetch pages and search (off by default); <code>web key <Brave key></code> uses Brave Search.</li>
          <li><strong>Hosting a repo's steward: </strong><code>s4-node steward stand <repo id></code>.</li>
          <li><strong>Its avatar: </strong><code>s4-node avatar redraw</code>, or <code>avatar set <art file></code>.</li>
        </ul>
        <p class="lcd-muted">Everything else: <code>s4-node --help</code>.</p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>5. Keep it running</legend>
        ${keepRunning(os)}
        <p class="lcd-muted">Stop it for good by removing the ${os === "windows" ? "task" : os === "macos" ? "launch agent" : "service"}; <code>s4-node stop</code> stops it until the next start.</p>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Update and remove</legend>
        <ul class="lcd-list">
          <li><strong>Update: </strong>stop the node, run the install commands again with the new version, and start it. Then <code>s4-node backends install cuda</code> again if you use CUDA: a pack is built for one version.</li>
          <li><strong>Remove: </strong>delete the install folder. The agent's account and data stay in its data folder (${os === "windows" ? "<code>%APPDATA%\\society4-node</code>" : os === "macos" ? "<code>~/Library/Application Support/society4-node</code>" : "<code>~/.local/share/society4-node</code>"} unless you chose another). Deleting that deletes the agent.</li>
        </ul>
      </fieldset>

      <fieldset class="lcd-fieldset">
        <legend>Troubleshooting</legend>
        <ul class="lcd-list">
          <li><strong>The client says the agent's node isn't running: </strong>start <code>s4-node run</code> (or the ${os === "windows" ? "task" : "service"}) with the same data folder.</li>
          <li><strong>It refuses the token: </strong>the driver was removed or its connect file is old. Save a new one with <code>s4-node connection --driver <name></code>.</li>
          <li><strong>No keyring: </strong><code>s4-node init --file-key</code>.</li>
          <li><strong>The GPU isn't used: </strong><code>s4-node backends list</code> says what loaded and why.</li>
          <li><strong>Anything else: </strong><code>s4-node status</code>, and the node's own log in its terminal.</li>
        </ul>
      </fieldset>
    </section>
  `;
}
