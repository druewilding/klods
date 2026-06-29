# klods — roadmap

A phased plan for getting klods from "scaffold that works" to "stable v1 you can build real apps with". Each phase ships a meaningful, releasable improvement; phases roughly correspond to minor versions.

## Phase 0 — v0 → v1.0 (done ✅)

Monorepo, `klods-css` with layout / utilities / first components, `klods-js` TS builders, self-generating docs, 6 passing tests, three working themes (`dark`, `playful`, `brutalist`). Shipped as **v1.0.0** with the GitHub repo (`druewilding/klods`), Actions CI, Changesets, and npm publishing all set up from day one.

---

## Phase 1 — Ship publicly (done ✅)

1. ✅ **Plain-HTML demo page** in the docs (`/vanilla.html`) — no-JS path using only BEM classes.
2. ✅ **Git repo** initialised and pushed to `druewilding/klods`.
3. ✅ **GitHub Actions CI** — lint + format check + test + build on every PR (`ci.yml`).
4. ✅ **Release Please** for independent automated versioning of `klods-css` and `klods-js` (`release.yml`).
5. ✅ **Published to npm** — `klods-css` and `klods-js` live; now at **klods-css v1.12** / **klods-js v2.0**.
6. ✅ **Deploy docs** to GitHub Pages from `apps/docs/dist` via Actions (`docs.yml`).
7. ✅ **README polish** — screenshot, one-liner installer, the "lego" pitch.

**Outcome:** anyone can `npm install klods-js klods-css` or `<link>` the CSS today.

---

## Post-Phase-1 additions (klods-js v1.1 – v1.10)

Components and features added incrementally before moving to full form support:

- **v1.1** — `box` component
- **v1.2** — `stickyHeader` layout modifier
- **v1.3** — `fill` and `push` utilities
- **v1.4** — `toc`, `tocItem`, `tocLink` (table of contents component)
- **v1.5** — `section` layout component; `buttonGroup` with pill styling and `aria-pressed` support; `prose`, `lead`, `muted` text components; `row({ inline })` variant; URL-persistent theme switcher on docs and vanilla.html; tinted alert backgrounds via `color-mix()`; `sidebarPosition: "leading" | "trailing"` (RTL-friendly replacement for `sidebarRight`)
- **v1.6** — Trailing-sidebar support landed in JS builders.
- **v1.7** — Form components (Phase 2 — see below).
- **v1.8** — `text-center` utility.
- **v1.9** — Responsive layout, mobile sidebar drawer, hamburger nav (Phase 2b — see below).
- **v1.10** — Hamburger SVG bundled directly in `klods-css` so the no-JS path keeps zero JS.

---

## Phase 2 — Forms wave (done ✅)

Forms are the highest-value missing piece for real apps.

1. ✅ **CSS BEM**: `klods-form`, `klods-field`, `klods-label`, `klods-input`, `klods-select`, `klods-textarea`, `klods-checkbox`, `klods-radio`, `klods-switch`, `klods-help`, `klods-error`. Modifiers for size (`--sm` / `--lg`) and state (`--invalid`); inline vs stacked.
2. ✅ **Builders**: `form`, `field({ label, help, error, required }, input(...))` — `field` is opinionated and handles label association, `aria-describedby` for help, `aria-invalid` for errors. Plus `input`, `select`, `option`, `textarea`, `checkbox`, `radio`, `radioGroup`, `switch`.
3. ✅ **A11y baked in** — auto-generated `id`s when missing, `for` / `aria-labelledby` linking, focus styles using accent colour.
4. ✅ **Examples**: a contact form, a settings panel, a search bar with button.

**Outcome:** klods covers ~80% of typical app screens.

---

## Phase 2b — Responsive / mobile (done ✅)

Shipped across **klods-js v1.9 / klods-css v1.10–v1.12**.

1. ✅ **Layout breakpoints** — responsive spacing and column behaviour so `klods-page`, `klods-header`, `klods-sidebar`, and `klods-content` stack sensibly on small screens.
2. ✅ **Sidebar collapse** — sidebar hidden by default on mobile; `data-sidebar-open` toggle (JS helper `toggleSidebar` + CSS) reveals it as a drawer. Works in vanilla HTML too via the small JS file shipped from `klods-css`.
3. ✅ **Form fields** — full-width on mobile by default; tap targets meet WCAG 2.5.8 (24 × 24 px).
4. ✅ **Navigation** — `klods-nav--collapse` modifier with hamburger toggle (`navToggle` builder + `toggleNav` helper). Hamburger SVG ships directly in `klods-css` so it works no-JS.
5. ✅ **Tables** — `tableWrap` provides a horizontal scroll wrapper for narrow viewports.
6. ✅ **Docs** — the docs site itself is fully usable on a phone.

**Outcome:** klods is production-ready for mobile-first apps.

---

## Phase 2c — Builder ergonomics (done ✅, klods-js v2.0)

A focused DX pass on the TypeScript builders. **Breaking change** — hence the v2 bump.

1. ✅ **Optional props arg** — every builder and `el()` accepts `(children)` directly, so `cardTitle("Install")` replaces `cardTitle("Install")`. Detected at runtime via plain-prototype check, so class instances (`Date`, `URL`, …) still pass through as children.
2. ✅ **HTML tag shortcuts** — new `html.ts` module exports tag-named builders (`code`, `pre`, `p`, `span`, `ul`, `li`, `strong`, `h1`–`h6`, …) so `code("npm i klods-js")` replaces `el("code", "npm i klods-js")`. Names that collide with klods components (`nav`, `button`, `form`, `header`, `footer`, `section`, `table`, …) are intentionally not re-exported — use the BEM component or `el("nav", …)` for the unstyled native element.
3. ✅ **Void-tag safety** — `KlodsNode` constructor strips children for void tags (`img`, `br`, `hr`, `input`, …) so `.render()` and `.toString()` stay in sync.
4. ✅ **Docs sweep** — every example in `apps/docs` rewritten to use the new shapes; the docs are the proof-of-style.

---

## Phase 3 — Interactive components

Native-first; smallest possible JS.

1. ✅ **Modal** — native `<dialog>` + `showModal()`. Builder `modal(...)` with `modalTitle`, `modalBody`, `modalActions`, `modalClose`. Tiny `openModal(el)` / `closeModal(el)` helpers. CSS handles backdrop + animation.
2. ✅ **Tabs** — full ARIA tabs widget with keyboard navigation (arrow keys, Home, End). `tabs([tabPanel({ label }, ...)])` wires up tablist, roles, and show/hide. Scoped `--klods-tabs-active` token so themes can override the active color independently of accent.
3. ✅ **Breadcrumbs** — `breadcrumbs([crumb({ href }, "Home"), crumb("Now")])`.
4. ✅ **Toast** — `showToast({ variant: "success" }, "Saved.")` with a fixed `.klods-toast-region` mount point and auto-dismiss. `clearToasts()` helper for cleanup.
5. ✅ **Tooltip** — using the popover API (`[popover]`) where supported, no positioning library.
6. ✅ **Disclosure** — `details()` and `summary()` builders over the native `<details>` / `<summary>` elements, styled with `.klods-details`. No JS required.

**Outcome:** v0.3 — all the "interactive bits" people expect.

---

## Phase 4 — Data display

1. ✅ **Table** — `klods-table` component with docs examples.
2. ✅ **List** — `list`, `listItem` with leading / trailing slot conventions and `href` support for full-row navigation links.
3. ✅ **Built-in icons** — `packages/klods-js/src/icons.ts` with 19 builders (`checkCircleIcon`, `chevDownIcon`, `chevLeftIcon`, `chevRightIcon`, `chevUpIcon`, `closeIcon`, `copyIcon`, `dangerCircleIcon`, `editIcon`, `externalLinkIcon`, `eyeIcon`, `eyeOffIcon`, `infoCircleIcon`, `menuIcon`, `plusIcon`, `searchIcon`, `trashIcon`, `userIcon`, `warningIcon`). All use `makeIcon` factory; inherit color via `currentColor`; three sizes (small / medium / large); optional accessible label. New Icons section in docs.
4. ✅ **Description list** — `dl`, `dt`, `dd`.
5. ✅ **Avatar** — image with fallback initials, sizes.
6. ✅ **Code helpers** — `inlineCode` (`.klods-code`), `codeBlock` (`.klods-pre`), `kbd` (`.klods-kbd`), `samp` (`.klods-samp`), `varEl` (`.klods-var`).

---

## Phase 4b — klods-ruby (done ✅)

A Ruby gem that provides the same builder API as `klods-js` — same component names, same call shapes, same HTML output — so Ruby developers can use klods in any Ruby project (Rails, Sinatra, plain ERB, HAML) without touching JavaScript.

**Repo:** [`druewilding/klods-ruby`](https://github.com/druewilding/klods-ruby) — separate repository, separate gem release cycle. The contract between the two packages is the CSS class names (`klods-card`, `klods-list__item`, etc.), which never change without a major version bump on both sides.

All builders use `camelCase` → `snake_case`, otherwise 1-to-1 with TypeScript. Same three call shapes. Every builder returns a `Klods::Node`; in Rails the Railtie automatically makes all builders available in every ERB view and treats `Klods::Node` as HTML-safe with no extra work from the developer.

1. ✅ All components ported: card, button, badge, alert, list, breadcrumbs, tabs, form (field/input/select/checkbox/radio/radio_group/switch_input), modal, tooltip, toast, avatar, nav, table, details, dl, code helpers, box, prose, layout (page/header/sidebar/content/footer/stack/cluster/row/grid/center/spread), utilities (push/fill), sidebar_toggle, toc, icons (all 19)
2. ✅ RSpec coverage — 161 examples, 0 failures
3. ✅ Railtie — prepends `RailsSafety` onto `Klods::Node` so `to_s` returns `html_safe`; includes `Klods::Builders` into `ActionView` so all builders are available in ERB with no imports
4. ✅ StandardRB enforced in CI
5. ✅ Release Please automation — `feat:`/`fix:` commits open a Release PR that publishes to RubyGems on merge
6. ✅ Published to RubyGems as [`klods-ruby`](https://rubygems.org/gems/klods-ruby) — current version **v1.0.0**
7. ✅ `rails-server-template` — [`druewilding/rails-server-template`](https://github.com/druewilding/rails-server-template) smoke-tests the Railtie in a real Rails 7 app with page layout, sidebar, TOC, and API endpoint
8. ✅ **SSR-friendly interactive components** — modal, tabs, tooltip, and toast all emit self-contained inline event handlers (`onclick`, `onmouseenter`, etc.) so they work without any client-side JS bundle. The JS is vanilla, minimal, and mirrors the klods-js behaviour exactly.
9. ✅ **Auto-generated Ruby tabs** — every component example in the klods docs site shows a Ruby pane auto-translated from the TypeScript source via `ruby-gen.ts`.
10. ✅ **Opinionated self-wiring builders** — `modal_trigger`, `modal_dismiss`, `modal_close`, `toast_trigger`, `clear_toasts_trigger` wire their own event handlers automatically, so call sites need no `onclick` attributes.

**Imperative helper functions intentionally omitted** (DOM APIs with no server-side equivalent): `toggleNav`, `toggleSidebar`, `openModal`, `closeModal`, `activateTab`, `showToast`, `clearToasts`. SSR-friendly alternatives are provided: `toast_trigger` / `clear_toasts_trigger` replace `showToast` / `clearToasts`; `modal_trigger` replaces the need to call `openModal` manually.

---

## Phase 4c — Button as link (done ✅)

Both `klods-js` and `klods-ruby` needed a way to render a button-styled link. The CSS-only path was the right answer — the BEM class does all the styling work, so `a({ class: "klods-button" }, "Go")` works today and the same applies in klods-ruby with `a(class: "klods-button")`. No builder change needed; documented as the canonical pattern.

---

## Phase 5 — Theming polish & DX

1. **Theme builder page** in the docs — sliders / inputs that mutate `--klods-*` on `<html>` so users can hand-tune a theme and copy a `:root` block out. (Still no editable code, just visual token tuning.)
2. ✅ **Per-component theming guide** — scoped tokens added for card (`--klods-card-bg/border/radius`), button (`--klods-button-bg/fg/border/radius`), badge (`--klods-badge-bg/fg`), and modal (`--klods-modal-bg/radius`). Each falls back to the corresponding global token so there are zero breaking changes. Tabs, tooltip, and code syntax tokens already existed. Docs section added with a live side-by-side demo and full token reference.
3. ✅ **Reduced motion** — `prefers-reduced-motion: reduce` sets `--klods-transition: 0ms` in `@layer klods.tokens`, eliminating all transitions in one place. Modal `::backdrop` gets an explicit `transition: none` for safety with `allow-discrete`.
4. ✅ **Print styles** — `@layer klods.print` (last in the cascade stack, wins without `!important`). Hides sidebar, nav toggle, modals, toasts, tooltips; collapses sidebar grid; removes sticky headers; expands closed `<details>`; removes shadows; adds `break-inside: avoid` on cards and list items.
5. ✅ **Density modifier** — `[data-density="compact"]` in `@layer klods.tokens` drops all `--klods-space-*` tokens to ~75% of defaults. Inherits via CSS custom properties so it works on `<html>` or any container.

_Partially done: `data-theme` switching with URL persistence ships in v1.5. Items 2–5 shipped. Only the theme builder page remains._

---

## Phase 6 — Distribution & integrations

1. **CDN-friendly UMD bundle** — already built; add a `<script>`-tag example in docs and pin a jsDelivr / unpkg URL.
2. **Tailwind preset** (optional) — exports spacing / colour tokens as a Tailwind config.
3. **Rails example app** — [`druewilding/rails-server-template`](https://github.com/druewilding/rails-server-template) already smoke-tests klods-ruby in a real Rails 8 app (page layout, sidebar, TOC, API endpoint). The original `examples/rails-todo` plan is superseded by this; a more feature-complete standalone demo may follow.
4. **Express / HTML example app** — [`druewilding/express-server-template`](https://github.com/druewilding/express-server-template) demonstrates `klods-js` used server-side via `.toString()`. Supersedes the original `examples/express-ssr` plan.
5. **CodeSandbox templates** linked from the docs.
6. **Pre-rendered docs** — the docs site is currently a client-side SPA (blank body with JS disabled). Two options: (a) a build-time SSG step that runs `main.ts` under Node, calls `.toString()` on every section, and writes static HTML into `dist/index.html`; or (b) a Vite SSG plugin (`vite-ssg` etc.). Option (a) is the most klods-native approach since `.toString()` is already designed for SSR. The library itself works perfectly without JS — this is purely a docs-site gap.

---

## Phase 7 — Quality & longevity

1. **Visual regression tests** — Playwright, screenshot every example in every theme, fail PRs on unintended changes. Reuses the `playwright-cucumber-template` setup.
2. **a11y audit** — axe-core on every docs example in CI.
3. **Bundle-size budget** — fail CI if `klods-css` > 25 kB min or `klods-js` ESM > 15 kB min.
4. **Type tests** — `tsd` or `expect-type` to verify the public API never silently changes.
5. **Migration & contribution guides** in the repo.

---

## Phase 8 — v2.0 and beyond

`klods-js` is already at **v2.0** (the builder-ergonomics rewrite); `klods-css` is at **v1.12** and stays on its own track. The original "v1.0 stability promise" remains the spirit of this phase: when phases 3–7 are stable, both packages should be on stable APIs, stable class names, stable token names, and a real semver promise.

### Speculative / post-stable

- **Web-component wrappers** (`<klods-card>`) for users who want JS sugar without a build step.
- **`@klods/icons`** — a tiny, themeable SVG icon set sized to the spacing scale.
- **`@klods/recipes`** — copy-paste page templates (dashboard, marketing, blog, settings).
- **Optional JSX runtime** so the same builders can be written as `<page sidebar>…</page>`.

---

## Recommended ordering

The lowest-risk, highest-leverage path from here:

1. **Phase 3 (interactive)** → unlocks dialogs / toasts / tabs that every app needs.
2. **Phase 7 hooks (CI, bundle budget, a11y)** alongside, so each release stays honest.
3. **Phase 4 + 5** in parallel as time allows.
4. **Phase 6** once the API has settled.
5. **Stability sweep** — declare APIs, classes and tokens stable.

## Status

| Phase                   | Status                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 0                       | ✅ done                                                                                                                 |
| 1                       | ✅ done                                                                                                                 |
| Post-Phase-1            | ✅ done (v1.1–v1.10)                                                                                                    |
| 2 (forms)               | ✅ done                                                                                                                 |
| 2b (responsive)         | ✅ done                                                                                                                 |
| 2c (builder ergonomics) | ✅ done (klods-js v2.0)                                                                                                 |
| 3 (interactive)         | ✅ done (modal, tabs, toast, tooltip, details)                                                                          |
| 4 (data)                | ✅ done                                                                                                                 |
| 4b (klods-ruby)         | ✅ done (v1.0.0, druewilding/klods-ruby)                                                                                |
| 4c (button as link)     | ✅ done (CSS-only; documented `a.klods-button` pattern)                                                                 |
| 5 (theming)             | partial — scoped tokens, reduced motion, print, density done; theme builder page still to come                          |
| 6                       | partial — rails-server-template & express-server-template exist; CDN docs, CodeSandbox, pre-rendered docs still to come |
| 7                       | not started                                                                                                             |
| 8 (stability)           | ongoing                                                                                                                 |
