#!/usr/bin/env node
/**
 * Stage working changes, bump site version on `dev`, commit with
 * conventional message, push.
 *
 *   npm run push:fix -- "fix downloads copy"
 *   npm run push:feat -- "group per-OS releases"
 *   npm run push:breaking -- "rename routes"
 */
import {
  bumpKind,
  bumpSemver,
  conventionalCommit,
  die,
  ensureDevBranch,
  gitOk,
  readSiteVersion,
  requireMessage,
  run,
  writeSiteVersion,
} from "./lib.mjs";

const kind = process.argv[2];
if (!["fix", "feat", "breaking"].includes(kind)) {
  die("usage: node scripts/push.mjs <fix|feat|breaking> -- \"message\"");
}

const message = requireMessage(process.argv);
const level = bumpKind(kind);

ensureDevBranch({ pull: false });

const { version: prev } = readSiteVersion();
const next = bumpSemver(prev, level);
writeSiteVersion(next);

run("git add -A");

if (kind === "breaking") {
  const subject = `feat!: ${message.trim()}`;
  const body = `BREAKING CHANGE: ${message.trim()}`;
  run(`git commit -m ${JSON.stringify(subject)} -m ${JSON.stringify(body)}`);
} else {
  run(`git commit -m ${JSON.stringify(conventionalCommit(kind, message))}`);
}

if (gitOk("rev-parse", "--verify", "origin/dev")) {
  try {
    run("git pull --rebase origin dev");
  } catch {
    die("git pull --rebase origin dev failed — resolve and re-run push:*");
  }
}

run("git push -u origin HEAD");

console.log(`bumped ${prev} → ${next} (${level}) on dev and pushed`);
console.log("next: merge dev → main, then npm run deploy");
