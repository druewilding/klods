import { createRequire } from "module";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);
const { version: klodsVersion } = require("../../packages/klods-js/package.json") as { version: string };
const { version: klodsCssVersion } = require("../../packages/klods-css/package.json") as { version: string };

export default defineConfig(({ mode }) => ({
  // /klods/ in production so the site lives at druewilding.com/klods.
  // Root in dev so Vite's HMR and asset paths work normally.
  base: mode === "production" ? "/klods/" : "/",

  define: {
    // Injected at build time so the docs always show the version they were built with.
    __KLODS_VERSION__: JSON.stringify(klodsVersion),
    __KLODS_CSS_VERSION__: JSON.stringify(klodsCssVersion),
  },

  resolve: {
    // Prefer TypeScript source in dev so the docs can run without pre-building klods.
    conditions: ["source", "import", "module", "browser", "default"],
  },

  build: {
    outDir: "dist",
    target: "es2022",
  },

  esbuild: {
    // Preserve function source so example() can read it back via fn.toString().
    keepNames: true,
    minifyIdentifiers: false,
  },
}));
