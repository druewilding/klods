/**
 * Vite plugin: post-build SSG step for the klods docs site.
 *
 * After the regular browser build finishes, this plugin:
 *   1. Builds src/ssg.ts as a Node CJS bundle (Vite handles import.meta.glob,
 *      exampleSourcePlugin transforms, and the __KLODS_VERSION__ define).
 *   2. Requires the resulting bundle and calls render() to get the full HTML string.
 *   3. Injects that HTML into the <div id="app"> placeholder in dist/index.html.
 *   4. Cleans up the temporary SSR build artefacts.
 *
 * The SSG step only runs during the browser build (not during the nested SSR
 * build that this plugin itself triggers) — guarded by the `isSsr` flag.
 */

import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { createRequire } from "module";
import { join } from "path";
import type { Options as PrettierOptions } from "prettier";
import type { Plugin, ResolvedConfig } from "vite";
import { build } from "vite";

import { exampleSourcePlugin } from "./vite-plugin-example-source.js";

export interface SsgPluginOptions {
  /** Absolute path to the docs app root (where vite.config.ts lives). */
  root: string;
  /** Values forwarded to Vite's `define` so the SSR bundle has __KLODS_VERSION__ etc. */
  define: Record<string, string>;
  /** Passed through to exampleSourcePlugin so source panes are correctly formatted. */
  prettierOverrides?: PrettierOptions;
}

export function ssgPlugin(options: SsgPluginOptions): Plugin {
  let isSsr = false;
  let resolvedConfig: ResolvedConfig;

  return {
    name: "klods-ssg",
    apply: "build",

    configResolved(cfg) {
      isSsr = !!cfg.build.ssr;
      resolvedConfig = cfg;
    },

    async closeBundle() {
      // Don't recurse: skip when we are ourselves the SSR build.
      if (isSsr) return;

      const { root, define, prettierOverrides = {} } = options;
      const ssrOutDir = join(root, ".ssg-temp");
      const ssrEntry = join(root, "src/ssg.ts");
      const ssrBundle = join(ssrOutDir, "ssg.cjs");
      const distIndex = join(root, "dist/index.html");

      if (!existsSync(distIndex)) {
        resolvedConfig.logger.warn("[klods-ssg] dist/index.html not found — skipping SSG step");
        return;
      }

      resolvedConfig.logger.info("[klods-ssg] Building SSR bundle…");

      await build({
        configFile: false,
        root,
        plugins: [exampleSourcePlugin(prettierOverrides)],
        define,
        resolve: {
          // Match the browser build: prefer TypeScript source for workspace packages.
          conditions: ["source", "import", "module", "browser", "default"],
        },
        build: {
          ssr: ssrEntry,
          outDir: ssrOutDir,
          emptyOutDir: true,
          minify: false,
          rollupOptions: {
            output: {
              // CJS so we can require() it synchronously with a simple createRequire call.
              format: "cjs",
              entryFileNames: "ssg.cjs",
            },
          },
        },
        // Keep SSR build output quiet so it doesn't swamp the main build log.
        logLevel: "warn",
      });

      resolvedConfig.logger.info("[klods-ssg] Running render()…");

      // Load the bundle via a require() rooted at the docs app directory so
      // external deps (highlight.js etc.) resolve against the workspace node_modules.
      const req = createRequire(join(root, "package.json"));
      // Bust the require cache in case of watch-mode rebuilds.
      delete req.cache[ssrBundle];
      const { render } = req(ssrBundle) as { render: () => string };
      const rendered = render();

      const template = readFileSync(distIndex, "utf8");
      const patched = template.replace('<div id="app"></div>', `<div id="app">${rendered}</div>`);
      writeFileSync(distIndex, patched);

      // Remove the temporary SSR artefacts — they're not part of the site.
      rmSync(ssrOutDir, { recursive: true, force: true });

      resolvedConfig.logger.info("[klods-ssg] Pre-rendered HTML injected into dist/index.html");
    },
  };
}
