# klods

> Tiny, opinionated, fully themeable HTML/CSS/JS pieces that snap together like lego.

<img src="apps/docs/public/klods-icon.svg" width="24" height="24" alt="klods logo" />

`klods` (Danish for _block_) is a component kit with two independent packages you can use
separately or together.

📖 **[Live docs →](https://www.druewilding.com/klods/)**
&nbsp;&nbsp;
🎨 **[Vanilla HTML demo →](https://www.druewilding.com/klods/vanilla.html)**

## Quick start

### CDN — no build step

```html
<link rel="stylesheet" href="https://unpkg.com/klods-css/dist/klods.min.css" />
```

Then drop in BEM classes — `klods-button--primary`, `klods-card`, `klods-table--striped`, … See
the [vanilla demo](https://www.druewilding.com/klods/vanilla.html) for a full example.

### npm

```sh
npm install klods-css klods-js
```

### Ruby / Rails

```ruby
# Gemfile
gem "klods-ruby"
```

```sh
bundle install
```

The Railtie automatically makes all builders available in every ERB view:

```erb
<%= stack({ gap: 4 }, [
  card([cardTitle("Hello"), cardBody("Built with klods-ruby.")]),
  button({ variant: "primary" }, "Get started"),
]) %>
```

No imports, no JavaScript required. See the [klods-ruby repo](https://github.com/druewilding/klods-ruby) for full docs.

```ts
import "klods-css";
import { card, cardBody, cardTitle, content, footer, header, page, sidebar } from "klods-js";

page({ sidebar: true, stickyHeader: true }, [
  header("My App"),
  sidebar("…"),
  content(card([cardTitle("Welcome"), cardBody("Snap blocks together.")])),
  footer("© 2026"),
]).render(document.body);
```

Every builder accepts three call shapes — pick the shortest that fits:

```ts
cardTitle("Install"); // children only
cardTitle({ class: "x" }, "Install"); // props + children
cardTitle(); // empty
```

There are also tag shortcuts for plain HTML — `code`, `pre`, `p`, `ul`, `li`, `strong`, `em`, `h1`–`h6`, … — so the lego stays bumpy:

```ts
import { code, li, p, pre, ul } from "klods-js";

p({ class: "klods-muted" }, ["Run ", code("npm i klods-js"), " to get started."]);
ul([li("Tiny"), li("Themeable"), li("SSR-ready")]);
```

## Features

- **No-JS path** — every layout and component works with plain HTML and one `<link>` tag.
- **Typed builders** — `button({ variant: "primary" }, "Save")` generates the right markup automatically, with full TypeScript autocompletion.
- **Themeable** — four built-in themes (`default`, `dark`, `playful`, `brutalist`); override anything with CSS custom properties.
- **Cascade layers** — klods lives inside `@layer klods.*` so your own styles always win without needing `!important`.
- **SSR-ready** — every builder has a `.toString()` that returns valid HTML, so it works in Node, Rails, or any server-side template.

## Packages

| Package                                                   | Registry                                                                                  | Description                                           |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`klods-css`](packages/klods-css)                         | [![npm](https://img.shields.io/npm/v/klods-css)](https://www.npmjs.com/package/klods-css) | The stylesheet. Use it on its own.                    |
| [`klods-js`](packages/klods-js)                           | [![npm](https://img.shields.io/npm/v/klods-js)](https://www.npmjs.com/package/klods-js)   | TypeScript builder API (ESM/CJS/UMD).                 |
| [`klods-ruby`](https://github.com/druewilding/klods-ruby) | [![gem](https://img.shields.io/gem/v/klods-ruby)](https://rubygems.org/gems/klods-ruby)   | Ruby builder API — same components in Rails/ERB/HAML. |
| [`apps/docs`](apps/docs)                                  |                                                                                           | Self-generating documentation site.                   |

## Develop

```sh
npm install
npm run dev    # docs site at http://localhost:5173
npm run build  # builds CSS, TS package, and docs
npm test       # runs klods-js unit tests
```

## License

MIT © Drue Wilding
