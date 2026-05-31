# klods — roadmap

A phased plan for getting klods from "scaffold that works" to "stable v1 you can build real apps with". Each phase ships a meaningful, releasable improvement; phases roughly correspond to minor versions.

## Phase 0 — v0 (done ✅)

Monorepo, `klods-css` with layout / utilities / first components, `klods-js` TS builders, self-generating docs, 6 passing tests, three working themes (`dark`, `playful`, `brutalist`).

---

## Phase 1 — Ship v0.1 publicly

Get it out the door before adding more surface area. Smaller surface = easier feedback.

1. **Plain-HTML demo page** in the docs (`/vanilla.html`) using only `<link rel="stylesheet">` and BEM classes — proves the no-JS path. This is the page Rails users will copy from.
2. **Cheat-sheet page** in the docs — one-screen reference of every class and modifier (the "I always forget" page).
3. **Initialise git repo** in `klods/`, push to a new GitHub repo `druewilding/klods`.
4. **GitHub Actions CI** — lint + format check + test + build on every PR.
5. **Changesets** for independent versioning of `klods-css` and `klods-js`.
6. **Publish v0.1.0** of `klods-css` and `klods-js` to npm.
7. **Deploy docs** to GitHub Pages from `apps/docs/dist` via Actions.
8. **README polish** — screenshot, one-liner installer, the "lego" pitch.

**Outcome:** anyone can `npm install klods-js klods-css` or `<link>` the CSS today.

---

## Phase 2 — Forms wave

Forms are the highest-value missing piece for real apps.

1. **CSS BEM**: `klods-form`, `klods-field`, `klods-label`, `klods-input`, `klods-select`, `klods-textarea`, `klods-checkbox`, `klods-radio`, `klods-switch`, `klods-help`, `klods-error`. Modifiers for size (`--sm` / `--lg`) and state (`--invalid`); inline vs stacked.
2. **Builders**: `form`, `field({ label, help, error, required }, input(...))` — `field` is opinionated and handles label association, `aria-describedby` for help, `aria-invalid` for errors. Plus `input`, `select`, `option`, `textarea`, `checkbox`, `radio`, `radioGroup`, `switch`.
3. **A11y baked in** — auto-generated `id`s when missing, `for` / `aria-labelledby` linking, focus styles using accent colour.
4. **Examples**: a contact form, a settings panel, a search bar with button.

**Outcome:** klods covers ~80% of typical app screens.

---

## Phase 3 — Interactive components

Native-first; smallest possible JS.

1. **Modal** — native `<dialog>` + `showModal()`. Builder `modal({ open, onClose }, [...])` with `modalTitle`, `modalBody`, `modalActions`. Tiny `openModal(node)` / `closeModal(node)` helpers. CSS handles backdrop + animation.
2. **Tabs** — ship the no-JS variant first (CSS-only via radio inputs or `<details>` group), layer JS-enhanced ARIA tabs on top later.
3. **Breadcrumbs** — `breadcrumbs({}, [crumb({ href }, "Home"), crumb({}, "Now")])`.
4. **Toast** — `toast({ variant, duration }, "Saved.")` with a mount point and a tiny imperative `toast.show(...)`.
5. **Tooltip** — using the popover API (`[popover]`) where supported, no positioning library.
6. **Disclosure** — thin wrapper around `<details>` / `<summary>` for FAQs and the like.

**Outcome:** v0.3 — all the "interactive bits" people expect.

---

## Phase 4 — Data display

1. **Table** — `klods-table` with zebra / borderless / dense modifiers, plus `tableCell({ align })`. Typed path: `rows: T[]` + `columns: Column<T>[]`; raw `<thead>` / `<tbody>` still possible.
2. **List** — `list`, `listItem` with leading / trailing slot conventions.
3. **Description list** — `descList`, `descTerm`, `descDetail`.
4. **Avatar** — image with fallback initials, sizes.
5. **KBD / code block** helpers — already partly there; promote to first-class.

---

## Phase 5 — Theming polish & DX

1. **Theme builder page** in the docs — sliders / inputs that mutate `--klods-*` on `<html>` so users can hand-tune a theme and copy a `:root` block out. (Still no editable code, just visual token tuning.)
2. **Per-component theming guide** — show overriding `--klods-card-bg` etc. Introduce **scoped tokens**: each component reads its own `--klods-card-bg` falling back to `--klods-color-surface`.
3. **Reduced motion** — honour `prefers-reduced-motion` for transitions / animations.
4. **Print styles** — `@layer klods.print` with sensible defaults.
5. **Density modifier** — `[data-density="compact"]` shrinks all spacing tokens.

---

## Phase 6 — Distribution & integrations

1. **CDN-friendly UMD bundle** — already built; add a `<script>`-tag example in docs and pin a jsDelivr / unpkg URL.
2. **Tailwind preset** (optional) — exports spacing / colour tokens as a Tailwind config.
3. **Rails example app** in `examples/rails-todo` — a tiny Rails 7 app using only `klods-css` via importmap. Doubles as a regression test.
4. **Express / HTML example app** in `examples/express-ssr` — uses `klods-js` server-side via `.toString()`. Demonstrates SSR.
5. **CodeSandbox templates** linked from the docs.

---

## Phase 7 — Quality & longevity

1. **Visual regression tests** — Playwright, screenshot every example in every theme, fail PRs on unintended changes. Reuses the `playwright-cucumber-template` setup.
2. **a11y audit** — axe-core on every docs example in CI.
3. **Bundle-size budget** — fail CI if `klods-css` > 25 kB min or `klods-js` ESM > 15 kB min.
4. **Type tests** — `tsd` or `expect-type` to verify the public API never silently changes.
5. **Migration & contribution guides** in the repo.

---

## Phase 8 — v1.0

When phases 1–7 are stable, cut **v1.0.0**: stable APIs, stable class names, stable token names, semver promise.

### Speculative / post-1.0

- **Web-component wrappers** (`<klods-card>`) for users who want JS sugar without a build step.
- **`@klods/icons`** — a tiny, themeable SVG icon set sized to the spacing scale.
- **`@klods/recipes`** — copy-paste page templates (dashboard, marketing, blog, settings).
- **Optional JSX runtime** so the same builders can be written as `<page sidebar>…</page>`.

---

## Recommended ordering

The lowest-risk, highest-leverage path is:

1. **Phase 1** in full → cut v0.1.0 and put klods in the world.
2. **Phase 2 (forms)** → unlocks "I can build a real app with this."
3. **Phase 3 (interactive)** → unlocks dialogs / toasts / tabs that every app needs.
4. **Phase 7 hooks (CI, bundle budget)** alongside, so each release stays honest.
5. **Phase 4 + 5** in parallel as time allows.
6. **Phase 6** once the API has settled.
7. **Phase 8** — v1.0.

## Status

| Phase | Status      |
| ----- | ----------- |
| 0     | ✅ done     |
| 1     | next        |
| 2–8   | not started |
