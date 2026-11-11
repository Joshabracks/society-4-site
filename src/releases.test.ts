import { describe, expect, it } from "vitest";
import {
  groupReleasesByVersion,
  latestNodeRelease,
  nodeAssetOf,
  parseReleaseTag,
  platformForAsset,
  type GhAsset,
  type GhRelease,
} from "./releases";

let nextId = 1;
const asset = (name: string): GhAsset => ({
  id: nextId++,
  name,
  browser_download_url: `https://example.invalid/${name}`,
  size: 1000,
  content_type: "application/octet-stream",
});
const release = (tag: string, names: string[]): GhRelease => ({
  id: nextId++,
  tag_name: tag,
  name: tag,
  body: `notes for ${tag}`,
  published_at: "2026-11-10T00:00:00Z",
  html_url: `https://example.invalid/releases/${tag}`,
  assets: names.map(asset),
});

// As the release scripts name them (package.mjs, per-os.mjs, the CI build).
const WINDOWS = [
  "Society4-0.5.0-windows-x64.msi",
  "Society4-0.5.0-windows-x64.msi.sig",
  "s4-node-0.5.0-windows-x86_64.zip",
  "s4-node-cuda-windows-x86_64--ggml-cuda.dll",
  "s4-node-cuda-windows-x86_64--cudart64_12.dll",
  "s4-node-cuda-windows-x86_64--NVIDIA-EULA.txt",
  "backends.json",
  "backends.json.sig",
  "SHA256SUMS",
];
const MACOS = [
  "Society4-0.5.0-macos-aarch64.dmg",
  "Society4-0.5.0-macos-aarch64.app.tar.gz",
  "Society4-0.5.0-macos-aarch64.app.tar.gz.sig",
  "s4-node-0.5.0-macos-aarch64.tar.gz",
  "SHA256SUMS",
];
const LINUX = [
  "Society4-0.5.0-linux-x64.AppImage",
  "Society4-0.5.0-linux-x64.AppImage.sig",
  "s4-node-0.5.0-linux-x86_64.tar.gz",
  "s4-node-cuda-linux-x86_64--libggml-cuda.so",
  "backends.json",
  "backends.json.sig",
  "SHA256SUMS",
];

describe("release files", () => {
  it("only installers count as a platform's downloads", () => {
    expect(platformForAsset("Society4-0.5.0-windows-x64.msi")).toBe("windows");
    expect(platformForAsset("Society4-0.5.0-macos-aarch64.dmg")).toBe("macos");
    expect(platformForAsset("Society4-0.5.0-linux-x64.AppImage")).toBe("linux");
    expect(platformForAsset("Society4-v0.5.0-android-arm64.apk")).toBe("android");
    for (const name of [
      "s4-node-0.5.0-windows-x86_64.zip",
      "s4-node-cuda-windows-x86_64--cudart64_12.dll",
      "s4-node-cuda-linux-x86_64--libggml-cuda.so",
      "Society4-0.5.0-windows-x64.msi.sig",
      "Society4-0.5.0-macos-aarch64.app.tar.gz",
      "backends.json",
      "backends.json.sig",
      "SHA256SUMS",
      "latest.json",
    ]) {
      expect(platformForAsset(name), name).toBe("other");
    }
  });

  it("knows the agent node's archives, and nothing else, as the node", () => {
    expect(nodeAssetOf("s4-node-0.5.0-windows-x86_64.zip")).toEqual({ version: "0.5.0", platform: "windows", arch: "x86_64" });
    expect(nodeAssetOf("s4-node-0.5.0-macos-aarch64.tar.gz")).toEqual({ version: "0.5.0", platform: "macos", arch: "aarch64" });
    expect(nodeAssetOf("s4-node-0.5.0-linux-x86_64.tar.gz")).toEqual({ version: "0.5.0", platform: "linux", arch: "x86_64" });
    expect(nodeAssetOf("s4-node-cuda-windows-x86_64--cudart64_12.dll")).toBeNull();
    expect(nodeAssetOf("Society4-0.5.0-windows-x64.msi")).toBeNull();
  });

  it("reads per-OS tags, macOS's capital included, and legacy ones", () => {
    expect(parseReleaseTag("windows0.5.0")).toEqual({ kind: "per-os", platform: "windows", version: "0.5.0" });
    expect(parseReleaseTag("macOS0.5.0")).toEqual({ kind: "per-os", platform: "macos", version: "0.5.0" });
    expect(parseReleaseTag("android0.5.0")).toEqual({ kind: "per-os", platform: "android", version: "0.5.0" });
    expect(parseReleaseTag("v0.3.1")).toEqual({ kind: "legacy", version: "0.3.1" });
    expect(parseReleaseTag("updater")).toEqual({ kind: "unknown" });
  });
});

describe("versions", () => {
  const versions = groupReleasesByVersion([
    release("windows0.5.0", WINDOWS),
    release("macOS0.5.0", MACOS),
    release("linux0.5.0", LINUX),
    release("windows0.4.0", ["Society4-0.4.0-windows-x64.msi"]),
    release("updater", ["latest.json"]),
  ]);

  it("groups one version's per-OS releases, with installers only as downloads", () => {
    expect(versions.map((v) => v.version)).toEqual(["0.5.0", "0.4.0"]);
    const [v] = versions;
    expect(v.platforms).toEqual(["windows", "macos", "linux"]);
    expect(Object.values(v.assetsByPlatform).flat().map((a) => a!.name)).toEqual([
      "Society4-0.5.0-windows-x64.msi",
      "Society4-0.5.0-macos-aarch64.dmg",
      "Society4-0.5.0-linux-x64.AppImage",
    ]);
  });

  it("keeps each OS's node archive and checksums apart", () => {
    const [v, old] = versions;
    expect(v.nodeByPlatform.windows?.map((a) => a.name)).toEqual(["s4-node-0.5.0-windows-x86_64.zip"]);
    expect(v.nodeByPlatform.macos?.map((a) => a.name)).toEqual(["s4-node-0.5.0-macos-aarch64.tar.gz"]);
    expect(v.nodeByPlatform.linux?.map((a) => a.name)).toEqual(["s4-node-0.5.0-linux-x86_64.tar.gz"]);
    expect(v.sumsByPlatform.windows?.name).toBe("SHA256SUMS");
    expect(v.sumsByPlatform.windows?.id).not.toBe(v.sumsByPlatform.linux?.id);
    expect(old.nodeByPlatform).toEqual({});
    expect(latestNodeRelease(versions)?.version).toBe("0.5.0");
    expect(latestNodeRelease([old])).toBeNull();
  });
});
