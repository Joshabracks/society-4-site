# Society 4 — public site

Marketing and user docs for **Society 4**, served via GitHub Pages. All of Society 4's public documentation lives here.

**Live:** https://joshabracks.github.io/society-4-site/

## Stack

- [State Street](https://joshabracks.github.io/State-Street/) SPA
- LCD Gray theme (light / dark), matching the desktop app
- Installers published as **GitHub Releases** on this public repo (per-OS tags from local `npm run release`, e.g. `windows0.4.0`, `android0.4.0`, or legacy multi-asset `v*` mirrors)

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

Vite `base` is `/society-4-site/` for project Pages.

### Version bump + deploy

```bash
# stage working tree + bump + conventional commit on origin/dev
npm run push:fix -- "tweak downloads copy"
npm run push:feat -- "group per-OS releases"
npm run push:breaking -- "rename hash routes"

# after merging that bump to main:
npm run deploy
```

`deploy` requires local `package.json` version === **`origin/main`**, runs `npm run build`, then triggers the **Pages** workflow via `gh workflow run` (still uses Actions minutes). Requires `gh` auth and a `dev` branch for `push:*`.

## Pages

| Hash | Page |
|------|------|
| `#home` | Landing |
| `#how-it-works` | Accounts, membership, messages, invite links, networks, shared repos, agents, backups |
| `#getting-started` | Install, set up an account, create or join a workspace |
| `#downloads` | Installers (desktop and Android APK) and the agent node, from the Releases API |
| `#run-an-agent` | Installing and running `s4-node` / `s4-agent` from the command line |
| `#faq` | Troubleshooting |
| `#privacy` | Privacy & security |
| `#changelog` | Release notes |

## Releases

Public downloads live on this repo's Releases (not in `dist/`), **one release per OS and version**:
`windows0.5.0`, `macOS0.5.0`, `linux0.5.0`, `android0.5.0`. Each holds that OS's files:

| File | What it is |
|------|------------|
| `Society4-<v>-<os>-<arch>.<ext>` | The app's installer (and, for the in-app updater, its update package and `.sig`) |
| `s4-node-<v>-<os>-<arch>.zip` / `.tar.gz` | The agent node, with `s4-agent` (desktop OSes only) |
| `s4-node-cuda-<os>-<arch>--<file>`, `backends.json`, `.sig` | The node's CUDA pack and its signed list (Windows, Linux); `s4-node backends install cuda` fetches them |
| `SHA256SUMS` | Every file's SHA-256, as `sha256sum` writes them |

The site groups the per-OS releases by version: Downloads lists installers and node archives, and Run an Agent
fills the latest version with a node into its commands. Older `v0.3.1`-style releases (all OSes in one) are still
read.

Two flows publish them from the private Society 4 repo:

- **CI** (`.github/workflows/desktop-release.yml`, on a version bump merged to main): every OS at once, with signed
  update packages; it also replaces `latest.json` on the fixed `updater` release, which installed apps check.
- **Local** (`npm run release` in `society4/apps/desktop`): this machine's OS only, with its node; no updater feed.
  Needs `SOCIETY4_SITE_RELEASE_TOKEN` or `gh` auth.

Release **tags** point at the stub `release-heads` branch (not `main`), so GitHub's automatic "Source code"
zip/tar is a one-file stub, not the website tree and not the private Society 4 app.
