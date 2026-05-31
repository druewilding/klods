# klods — Copilot Instructions

klods is a tiny, opinionated, fully themeable HTML/CSS/JS component library that "feels like building with lego". It ships two packages from a single monorepo.

## Monorepo layout

```
klods/
├── packages/
│   ├── klods-css/       npm: klods-css     — SCSS source, built to dist/klods.css + klods.min.css
│   └── klods-js/        npm: klods-js      — TypeScript builder API, built to ESM + CJS + UMD
├── apps/
│   └── docs/            private            — Vite docs site, deployed to GitHub Pages at druewilding.com/klods
├── tsconfig.base.json   shared TS config
└── eslint.config.js     shared ESLint config (extends eslint-config-plus-prettier)
```

## The golden rule

**Every CSS component must have three things:**

1. **CSS** — BEM classes in `packages/klods-css/src/_components.scss` inside `@layer klods.components`
2. **JS builder** — exported function in `packages/klods-js/src/components.ts`
3. **Docs example** — at least one `example()` call in `apps/docs/src/pages/components.ts`

Never add CSS without a builder. Never add a builder without a docs example. The docs are the proof the component works.

## Adding a new component — checklist

1. **CSS** in `packages/klods-css/src/_components.scss`:
   - Use BEM: `.klods-{name}`, `.klods-{name}__element`, `.klods-{name}--modifier`
   - Use design tokens (`var(--klods-*)`) — never hardcode colours or sizes
   - Put styles inside `@layer klods.components { … }`

2. **JS builder** in `packages/klods-js/src/components.ts`:
   - Use the `builder()` factory for BEM classes with modifier props
   - Export a `{Name}Props` type for any non-HTML props
   - For wrappers with logic (e.g. defaulting `type="button"`), write a named function
   - For bare HTML element wrappers with no BEM class, call `el()` directly

3. **Docs example** in `apps/docs/src/pages/components.ts`:
   - Import the new builder at the top of the file
   - Add one or more `example({ title, render: () => … })` calls
   - Show every meaningful modifier/variant

4. **Build and verify**: `npm run build` from the repo root — all three packages must succeed

## CSS conventions

- Cascade layers (in order): `klods.reset` → `klods.tokens` → `klods.themes` → `klods.layout` → `klods.components` → `klods.utilities`
- All design tokens live in `_tokens.scss` as CSS custom properties on `:root`
- Token naming: `--klods-{category}-{name}` (e.g. `--klods-color-accent`, `--klods-space-4`)
- BEM naming: `klods-{block}`, `klods-{block}__element`, `klods-{block}--modifier`
- Never use `!important`. Never hardcode colours or spacing values.
- Themes override tokens in `_themes.scss` via `[data-theme="dark|playful|brutalist"]`

## JS builder conventions

- `builder({ tag, base, modifiers })` — factory for BEM components with modifier props
- `el(tag, attrs, children)` — escape hatch for raw HTML elements without BEM classes
- `KlodsAttrs` — all HTML attrs including `data-*`, `aria-*`, `style`, event handlers (`onClick` etc.)
- `KlodsChild` — `string | number | KlodsNode | KlodsChild[] | null | undefined`
- `.render(target?)` — mounts to DOM (appends to target or replaces `document.body`)
- `.toString()` — returns the HTML string (safe for SSR)
- Always export named `{Name}Props` types for any component-specific props

## Docs conventions

- The `example({ title, description?, render })` helper in `apps/docs/src/example.ts` calls `render()` once for the live preview, reads `render.toString()` for the TypeScript pane, and calls `.toString()` on the result for the HTML pane
- **Docs can never lie** — the code shown is the code that produced the preview
- Build minification is disabled (`minify: false` in `apps/docs/vite.config.ts`) so `fn.toString()` returns readable source
- **Anchor must match slug(title)** — `example()` sets `id={slug(title)}` on the card, where `slug` lowercases the title and replaces any run of non-alphanumeric characters with `-`. The `anchor` export in each page module must be the exact output of that function applied to the _first_ example's title, or the sidebar link will point nowhere. E.g. `"Fill — grow to fill available space"` → `"fill-grow-to-fill-available-space"`

## Build commands

```sh
npm run build               # build all packages in order
npm run build --workspace packages/klods-css
npm run build --workspace packages/klods-js
npm run build --workspace apps/docs
npm run dev                 # start docs dev server
npm test                    # run vitest unit tests
npm run lint                # ESLint --fix
npm run lint:check          # ESLint (no fix, for CI)
npm run format              # Prettier --write
npm run format:check        # Prettier --check (for CI)
```

## Releasing

Releases are fully automated:

- **Release Please** watches commits on `main` and opens a Release PR per package when there are releasable changes
- Merging the Release PR creates a GitHub Release + tag and triggers npm publish with provenance
- Packages version independently — `klods-css` and `klods-js` have separate changelogs and semver
- Commit messages must follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` etc.) for Release Please to detect changes

## Key dependencies

- `sass` — SCSS compiler for `klods-css`
- `tsup` — bundles `klods-js` to ESM + CJS + UMD + `.d.ts`
- `vite` + `vitest` — docs site and unit tests
- `eslint-config-plus-prettier` — shared lint/format config (Drue's own package)
