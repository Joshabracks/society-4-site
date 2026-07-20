import { execFileSync, execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const SITE_ROOT = join(__dirname, "..");
export const PACKAGE_JSON = join(SITE_ROOT, "package.json");

export function die(msg, code = 1) {
  console.error(`error: ${msg}`);
  process.exit(code);
}

export function run(cmd, opts = {}) {
  const { cwd = SITE_ROOT, stdio = "inherit", env = process.env } = opts;
  return execSync(cmd, { cwd, stdio, env, encoding: "utf8" });
}

export function git(...args) {
  return execFileSync("git", args, {
    cwd: SITE_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

export function gitOk(...args) {
  try {
    git(...args);
    return true;
  } catch {
    return false;
  }
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** @param {"fix"|"feat"|"breaking"} kind */
export function bumpKind(kind) {
  if (kind === "fix") return "patch";
  if (kind === "feat") return "minor";
  if (kind === "breaking") return "major";
  die(`unknown bump kind: ${kind}`);
}

/** @param {string} version @param {"major"|"minor"|"patch"} level */
export function bumpSemver(version, level) {
  const m = String(version).match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!m) die(`invalid semver: ${version}`);
  let major = Number(m[1]);
  let minor = Number(m[2]);
  let patch = Number(m[3]);
  if (level === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (level === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }
  return `${major}.${minor}.${patch}`;
}

/** @param {"fix"|"feat"|"breaking"} kind @param {string} message */
export function conventionalCommit(kind, message) {
  const msg = message.trim();
  if (!msg) die("commit message is required");
  if (kind === "fix") return `fix: ${msg}`;
  if (kind === "feat") return `feat: ${msg}`;
  if (kind === "breaking") return null; // use dual -m
  die(`unknown kind: ${kind}`);
}

export function requireMessage(argv) {
  const args = argv.slice(3).filter((a) => a !== "--");
  const message = args.join(" ").trim();
  if (!message) {
    die('usage: npm run push:<fix|feat|breaking> -- "commit message"');
  }
  return message;
}

export function ensureDevBranch({ pull = true } = {}) {
  run("git fetch origin --prune");
  const current = git("rev-parse", "--abbrev-ref", "HEAD");
  if (current !== "dev") {
    if (gitOk("show-ref", "--verify", "--quiet", "refs/heads/dev")) {
      run("git checkout dev");
    } else if (gitOk("show-ref", "--verify", "--quiet", "refs/remotes/origin/dev")) {
      run("git checkout -b dev origin/dev");
    } else {
      die("branch 'dev' not found locally or on origin");
    }
  }
  if (pull && gitOk("rev-parse", "--verify", "origin/dev")) {
    run("git pull --ff-only origin dev");
  }
}

export function readSiteVersion() {
  const pkg = readJson(PACKAGE_JSON);
  if (!pkg.version) die("package.json has no version");
  return { pkg, version: String(pkg.version) };
}

export function writeSiteVersion(next) {
  const { pkg } = readSiteVersion();
  pkg.version = next;
  writeJson(PACKAGE_JSON, pkg);
}

export function remoteMainSiteVersion() {
  run("git fetch origin main --prune");
  if (!gitOk("rev-parse", "--verify", "origin/main")) {
    die("origin/main not found — fetch main first");
  }
  const raw = git("show", "origin/main:package.json");
  const pkg = JSON.parse(raw);
  if (!pkg.version) die("origin/main package.json has no version");
  return String(pkg.version);
}
