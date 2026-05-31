import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    target: "es2022",
  },
  {
    entry: { klods: "src/index.ts" },
    format: ["iife"],
    globalName: "Klods",
    outExtension: () => ({ js: ".umd.js" }),
    minify: true,
    sourcemap: true,
    target: "es2020",
    clean: false,
  },
]);
