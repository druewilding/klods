import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    target: "es2022",
  },
  esbuild: {
    // Preserve function source so example() can read it back via fn.toString().
    keepNames: true,
    minifyIdentifiers: false,
  },
});
