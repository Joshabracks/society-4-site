#!/usr/bin/env node
/**
 * Gate site deploy: local version must match origin/main, then build and
 * trigger the existing GitHub Pages workflow (Actions).
 *
 *   npm run deploy
 *
 * Prefers pushing current main (if already on main and clean with matching
 * version). Otherwise runs `gh workflow run` for pages.yml on main.
 */
import { execFileSync } from "node:child_process";
import {
  die,
  git,
  gitOk,
  readSiteVersion,
  remoteMainSiteVersion,
  run,
  SITE_ROOT,
} from "./lib.mjs";

const { version } = readSiteVersion();
const mainVersion = remoteMainSiteVersion();
if (version !== mainVersion) {
  die(
    `local version ${version} !== origin/main ${mainVersion} — merge the bump to main first`,
  );
}

const branch = git("rev-parse", "--abbrev-ref", "HEAD");
if (branch !== "main") {
  die(`deploy must run on main (currently on ${branch})`);
}

const status = git("status", "--porcelain");
if (status) {
  die("working tree is not clean — commit or stash before deploy");
}

// Ensure local main matches origin/main tip for the versioned tree
run("git pull --ff-only origin main");

console.log(`building site ${version}…`);
run("npm run build");

console.log("triggering Pages workflow on main…");
try {
  execFileSync(
    "gh",
    ["workflow", "run", "pages.yml", "--ref", "main"],
    { cwd: SITE_ROOT, stdio: "inherit" },
  );
} catch {
  // Fallback: empty commit push to retrigger push-based deploy
  if (!gitOk("rev-parse", "--verify", "origin/main")) {
    die("gh workflow run failed and origin/main is missing");
  }
  console.warn("gh workflow run failed — pushing an empty commit to trigger Pages");
  run('git commit --allow-empty -m "chore: trigger pages deploy"');
  run("git push origin main");
}

console.log(
  `deploy triggered for ${version}. Pages still runs on GitHub Actions.`,
);
