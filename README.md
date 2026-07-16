# Society 4 — public site

Marketing and user docs for **Society 4**, served via GitHub Pages.

**Live:** https://joshabracks.github.io/society-4-site/

## Stack

- [State Street](https://joshabracks.github.io/State-Street/) SPA
- LCD Gray theme (light / dark), matching the desktop app
- Desktop installers published as **GitHub Releases** on this public repo (mirrored from the private `society-4` release workflow)

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

Public download assets live on this repo’s Releases (not in `dist/`). Each release
attaches **only** the three platform installers (Windows / macOS / Linux).

Release **tags** point at the stub `release-heads` branch (not `main`), so GitHub’s
automatic “Source code” zip/tar is a one-file stub — not the website tree and not the
private Society 4 app.

The private `society-4` Desktop Release workflow mirrors installers here using the
`SOCIETY4_SITE_RELEASE_TOKEN` secret (`target_commitish: release-heads`).
