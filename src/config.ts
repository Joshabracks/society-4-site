/** Public GitHub repo that hosts mirrored desktop installers. */
export const RELEASES_OWNER = "Joshabracks";
export const RELEASES_REPO = "society-4-site";

export const RELEASES_API =
  `https://api.github.com/repos/${RELEASES_OWNER}/${RELEASES_REPO}/releases`;

export const SITE_REPO_URL =
  `https://github.com/${RELEASES_OWNER}/${RELEASES_REPO}`;

/**
 * The oldest version the site lists. 0.5.0 replaced everything before it
 * (and the project is still pre-release), so older versions aren't offered.
 */
export const MIN_VERSION = "0.5.0";
