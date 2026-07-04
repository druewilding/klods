# klods docs

The self-generating documentation site.

```sh
npm run dev      # from the monorepo root, or:
npm run dev --workspace apps/docs
```

Every example uses the real `klods` package and shows three views from a single source of truth: the live preview, the TypeScript source, and the produced HTML.

## Building

```sh
npm run build --workspace apps/docs
```

`vite build` runs the browser bundle first, then a post-build SSG step (`vite-plugin-ssg.ts`) that:

1. Bundles `src/ssg.ts` as a Node CJS module (Vite resolves `import.meta.glob` and applies all transforms in the same pass).
2. Calls `render()` — which calls `shell().toString()` — to get the full HTML string.
3. Injects it into the `<div id="app">` in `dist/index.html`.
4. Cleans up the temporary SSR bundle.

The result is a fully pre-rendered `dist/index.html`. The browser JS still runs on load and re-renders for interactivity; the pre-rendered markup gives an immediate first paint and crawlable content with JS disabled.

To preview the pre-rendered output locally:

```sh
npm run preview --workspace apps/docs
```
