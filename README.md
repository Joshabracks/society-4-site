# Society 4 — public site

Marketing and user docs for **Society 4**, served via GitHub Pages.

**Live:** https://joshabracks.github.io/society-4-site/

## Stack

- [State Street](https://joshabracks.github.io/State-Street/) SPA
- LCD Gray theme (light / dark), matching the desktop app
- Desktop installers published as **GitHub Releases** on this public repo (per-OS tags from local `npm run release`, or legacy multi-asset `v*` mirrors)

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
| `#how-it-works` | Peer mesh vs GitHub membership |
| `#getting-started` | Create / join onboarding |
| `#downloads` | Installers from Releases API |
| `#faq` | Troubleshooting |
| `#privacy` | Privacy & security |
| `#changelog` | Release notes |

## Releases

Public download assets live on this repo’s Releases (not in `dist/`).

**Per-OS tags** (preferred local flow): `windows0.3.1`, `macOS0.3.1`, `linux0.3.1` — each holds that platform’s installer. The site groups them by version so Downloads/Changelog show one “0.3.1” entry with up to three platforms.

**Legacy:** a single `v0.3.1` release with all three installers attached is still understood.

Release **tags** point at the stub `release-heads` branch (not `main`), so GitHub’s automatic “Source code” zip/tar is a one-file stub — not the website tree and not the private Society 4 app.

Publish installers from the private desktop repo with `npm run release` (see `society4/apps/desktop/README.md`), using `SOCIETY4_SITE_RELEASE_TOKEN` or `gh` auth.
