# klods-js

Tiny, typed, lego-like builder API. Pairs with [`klods-css`](../klods-css).

```sh
npm install klods-js klods-css
```

```ts
import "klods-css";
import { content, footer, header, nav, navLink, navList, page, sidebar } from "klods-js";

page({ sidebar: true }, [
  header(nav(navList([navLink({ href: "/", active: true }, "Home"), navLink({ href: "/about" }, "About")]))),
  sidebar("filters here"),
  content({ narrow: true }, "Hello world"),
  footer("© 2026"),
]).render(document.body);
```

## The lego API

Every builder accepts three call shapes — always reach for the shortest one that fits:

```ts
cardTitle(); // no props, no children
cardTitle("Install"); // children only
cardTitle(["Save ", icon]); // array of children
cardTitle({ class: "x" }); // props only
cardTitle({ class: "x" }, "Install"); // props + children
```

The first arg is detected at runtime: a plain object that isn't a node, array, DOM `Node`, or `raw()` marker is treated as **props**; everything else is **children**. So you never need a stray `{}` for a no-props call.

## Tag shortcuts for raw HTML

For plain HTML elements without BEM styling, import the tag-named builder instead of using `el()`:

```ts
import { code, em, h2, li, p, pre, strong, ul } from "klods-js";

p({ class: "klods-muted" }, ["Run ", code("npm i klods-js"), " to get started."]);
pre(code('<link rel="stylesheet" href="…" />'));
ul([li([strong("Tiny"), " — under 10 KB gzipped"]), li([em("Themeable"), " out of the box"])]);
```

Available shortcuts include `code`, `pre`, `p`, `span`, `div`, `strong`, `em`, `small`, `kbd`, `mark`, `sub`, `sup`, `time`, `ul`, `ol`, `li`, `dl`, `dt`, `dd`, `a`, `h1`–`h6`, `article`, `figure`, `figcaption`, `blockquote`, `hr`, `br`, `img`, `video`, `audio`, `source`, `iframe`, `label`, `fieldset`, `legend`.

Names that collide with klods components (`nav`, `button`, `form`, `header`, `footer`, `section`, `aside`, `input`, `select`, `option`, `textarea`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `card`) are **not** exported as raw shortcuts — use the klods component if you want styling, or `el("nav", …)` if you specifically need an unstyled native element.

## Escape hatches

- `el(tag, attrs?, children?)` — generic element builder. Same overloaded call shapes as the rest. Useful for one-off tags not in `html.ts`.
- `tagBuilder("tag")` — make your own tag shortcut.
- `raw(html)` — embed pre-escaped HTML as a child without re-escaping.
- `.render(target?)` — mount to DOM.
- `.toString()` — render to an HTML string (SSR-safe).

Every builder accepts arbitrary `class`, `id`, `data-*`, `aria-*`, event handlers and any other HTML attribute. See the [docs site](../../apps/docs) for the full reference.
