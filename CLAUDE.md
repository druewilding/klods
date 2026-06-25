# klods

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
   - For wrappers with logic (e.g. defaulting `type="button"`), write a named function with the standard three-overload signature (see "Builder call shapes" below)
   - For bare HTML element wrappers with no BEM class, use `tagBuilder("tagName")` from `core.ts` (or, if it's already in `html.ts`, just import it)

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

### Icons in CSS vs inline SVG in JS

**Use CSS `::before` + `mask-image` (data URL SVG) when:**

- The icon is _component chrome_ — it always appears, the user never swaps it out (e.g. the modal × close button, the sidebar-toggle hamburger, the select chevron).
- It must be single-color and theme automatically. Use `background-color: currentColor` so it inherits from the element's color token.
- It must work on the no-JS vanilla HTML path with no build step.

Pattern (copy from `.klods-sidebar-toggle::before` in `_layout.scss`):

```scss
&::before {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  background-color: currentColor;
  // stylelint-disable-next-line function-url-quotes
  mask-image: url("data:image/svg+xml,<svg …/>");
  mask-repeat: no-repeat;
  mask-size: contain;
}
```

**Switch to inline SVG in the JS builder when:**

- The icon changes per variant (e.g. different icons for info/success/warning/danger alert variants) — the logic belongs in the builder, not in multiple CSS modifier rules.
- The icon is multi-color or uses fills that can't be expressed with a single `currentColor`.
- The user is expected to override or swap the icon via children.

### Built-in icon builders

General-purpose icons live in `packages/klods-js/src/icons.ts` and are exported from `klods-js`. To add a new icon:

```ts
export const myIcon = makeIcon(
  '<path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="…"/>',
  "0 0 16 16"
);
```

`makeIcon(svgInner, viewBox)` returns a builder with the signature `(props?) => KlodsNode`. Props:

- `size?: "small" | "medium" | "large"` — renders at 12 / 20 / 32 px (default: `"medium"`)
- `label?: string` — when set, adds `aria-label` + `role="img"`; without it the icon is `aria-hidden="true"`
- Any `KlodsAttrs` (class, style, data-\*, …)

All icons use `currentColor` for strokes/fills so they automatically inherit color from context. Keep exports alphabetically ordered in the file.

**Icon docs** live in `apps/docs/src/pages/icons/` — one file per subsection (e.g. `built-in.ts`). Each file exports `anchor`, `label`, and `examples: KlodsNode[]`. The aggregator at `apps/docs/src/pages/icons.ts` picks them up via `import.meta.glob`.

A separate `@klods/icons` npm package is Phase 8 speculative work — bring Lucide, Heroicons, Phosphor etc. alongside klods in the meantime.

## JS builder conventions

- `builder({ tag, base, modifiers })` — factory for BEM components with modifier props
- `tagBuilder("tag")` — factory for plain HTML tags with no BEM class
- `el(tag, attrs?, children?)` — escape hatch for one-off raw HTML elements
- `KlodsAttrs` — all HTML attrs including `data-*`, `aria-*`, `style`, event handlers (`onClick` etc.)
- `KlodsChild` — `string | number | KlodsNode | KlodsChild[] | null | undefined`
- `.render(target?)` — mounts to DOM (appends to target or replaces `document.body`)
- `.toString()` — returns the HTML string (safe for SSR)
- Always export named `{Name}Props` types for any component-specific props

### Builder call shapes (the lego API)

Every builder — and `el()` — accepts the same three call shapes. Always prefer the shortest one that fits:

```ts
cardTitle(); // no props, no children
cardTitle("Install"); // children only (most common!)
cardTitle(["Save ", icon]); // an array of children counts as children
cardTitle({ class: "x" }); // props only
cardTitle({ class: "x" }, "Install"); // props + children
```

The first arg is detected at runtime: a plain object literal that isn't a `KlodsNode`, array, DOM `Node`, or `RawHtml` is treated as **props**; everything else is treated as **children**.

**Style rules for examples and docs:**

- **Always use the simplest possible call shape.** Drop the empty `{}` when there are no props (`cardBody("x")` not `cardBody({}, "x")`). Skip the array when there is only one child (`section(box("x"))` not `section([box("x")])`). No-arg builders take no args (`push()` not `push({})`).
- **Use HTML tag shortcuts** from `klods-js` for raw HTML — `code("npm i …")`, `pre(code(…))`, `p({ class: "klods-muted" }, "…")`, `ul([li("a"), li("b")])`, `strong("important")`, `em("emphasis")`, `h1`–`h6`, etc. Available in `packages/klods-js/src/html.ts`.
- **Don't use `el("tag", {}, …)`** when a tag shortcut exists — that's the old style.
- **`el(...)` is still needed** for HTML tags whose names collide with klods exports: `nav`, `button`, `form`, `header`, `footer`, `section`, `aside`, `input`, `select`, `option`, `textarea`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `card`. For those use the klods component if you want klods styling, or `el("nav", …)` if you specifically want an unstyled native element.

### When writing a new hand-written wrapper

Match the shape of `button`, `alert`, `navToggle` etc. — three overloads + `normalizeArgs(a, b)`:

```ts
export function widget(): KlodsNode;
export function widget(children: KlodsChild | KlodsChild[]): KlodsNode;
export function widget(props: (WidgetProps & KlodsAttrs) | null, children?: KlodsChild | KlodsChild[]): KlodsNode;
export function widget(
  a?: (WidgetProps & KlodsAttrs) | KlodsChild | KlodsChild[] | null,
  b?: KlodsChild | KlodsChild[]
): KlodsNode {
  const [props, children] = normalizeArgs<WidgetProps & KlodsAttrs>(a, b);
  // …
}
```

Wrappers whose first arg must be a typed required props object (`field`, `input`, `checkbox`, `radio`) keep their single-signature shape — overloading only applies where props are entirely optional.

## Docs conventions

- The `example({ title, description?, render })` helper in `apps/docs/src/example.ts` calls `render()` once for the live preview, reads `render.toString()` for the TypeScript pane, and calls `.toString()` on the result for the HTML pane
- **Docs can never lie** — the code shown is the code that produced the preview
- Build minification is disabled (`minify: false` in `apps/docs/vite.config.ts`) so `fn.toString()` returns readable source
- **Anchor must match slug(title)** — `example()` sets `id={slug(title)}` on the card, where `slug` lowercases the title and replaces any run of non-alphanumeric characters with `-`. The `anchor` export in each page module must be the exact output of that function applied to the _first_ example's title, or the sidebar link will point nowhere. E.g. `"Fill — grow to fill available space"` → `"fill-grow-to-fill-available-space"`

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

## Language

Always use US English spelling (e.g. "color" not "colour", "gray" not "grey", "center" not "centre").
