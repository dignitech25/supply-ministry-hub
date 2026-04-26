import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

/**
 * Asset versioning plugin.
 *
 * Hashes selected files in /public and rewrites their `?v=...` query strings
 * inside index.html and src/components/SEO.tsx so social platforms and
 * browsers re-fetch the asset only when its bytes actually change.
 *
 * Runs:
 * - Once on `vite build` (buildStart)
 * - Once on `vite dev` startup (configureServer)
 * - On change when the watched asset is edited in dev
 */

type AssetTarget = {
  /** Path relative to project root */
  file: string;
  /** Basename used to find references (e.g. "og-image.jpg") */
  basename: string;
};

const TARGETS: AssetTarget[] = [
  { file: "public/og-image.jpg", basename: "og-image.jpg" },
  { file: "public/favicon.png", basename: "favicon.png" },
];

const FILES_TO_REWRITE = ["index.html", "src/components/SEO.tsx"];

function hashFile(absPath: string): string {
  const buf = readFileSync(absPath);
  return createHash("sha1").update(buf).digest("hex").slice(0, 8);
}

function rewriteVersions(rootDir: string): { changed: string[]; versions: Record<string, string> } {
  const versions: Record<string, string> = {};
  for (const target of TARGETS) {
    const abs = resolve(rootDir, target.file);
    if (!existsSync(abs)) continue;
    versions[target.basename] = hashFile(abs);
  }

  const changed: string[] = [];
  for (const rel of FILES_TO_REWRITE) {
    const abs = resolve(rootDir, rel);
    if (!existsSync(abs)) continue;
    const original = readFileSync(abs, "utf8");
    let updated = original;
    for (const [basename, v] of Object.entries(versions)) {
      // Match e.g. /og-image.jpg?v=abc123 or og-image.jpg?v=2  (no ?v= also handled)
      const escaped = basename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // With existing ?v=
      const withV = new RegExp(`(${escaped})\\?v=[^"'\\s)]+`, "g");
      updated = updated.replace(withV, `$1?v=${v}`);
    }
    if (updated !== original) {
      writeFileSync(abs, updated);
      changed.push(rel);
    }
  }
  return { changed, versions };
}

export function assetVersioningPlugin(): Plugin {
  let rootDir = process.cwd();
  const watchedAbs = new Set<string>();

  const run = (label: string) => {
    try {
      const { changed, versions } = rewriteVersions(rootDir);
      const summary = Object.entries(versions)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      if (changed.length) {
        // eslint-disable-next-line no-console
        console.log(`[asset-versioning:${label}] updated ${changed.join(", ")} (${summary})`);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[asset-versioning:${label}] skipped:`, (err as Error).message);
    }
  };

  return {
    name: "asset-versioning",
    configResolved(config) {
      rootDir = config.root || process.cwd();
      for (const t of TARGETS) {
        watchedAbs.add(resolve(rootDir, t.file));
      }
    },
    buildStart() {
      run("build");
    },
    configureServer(server) {
      run("dev");
      server.watcher.on("change", (file) => {
        if (watchedAbs.has(file)) run("dev:change");
      });
    },
  };
}

// Allow running directly via `node scripts/asset-versioning.ts` style usage
const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const root = resolve(__dirname, "..");
  const { changed, versions } = rewriteVersions(root);
  // eslint-disable-next-line no-console
  console.log("Versions:", versions);
  // eslint-disable-next-line no-console
  console.log("Changed:", changed);
}