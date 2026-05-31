# klods

> Tiny, opinionated, fully themeable HTML/CSS/JS pieces that snap together like lego.

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

```ts
import "klods-css";
import { page, header, sidebar, content, footer, button, card } from "klods-js";

page({ sidebar: true, stickyHeader: true }, [
  header({}, "My App"),
  sidebar({}, "…"),
  content({}, card({}, button({ variant: "primary" }, "Save"))),
  footer({}, "© 2026"),
]).render(document.body);
```

## Features

- **No-JS path** — every layout and component works with plain HTML and one `<link>` tag.
- **Typed builders** — `button({ variant: "primary" }, "Save")` generates the right markup automatically, with full TypeScript autocompletion.
- **Themeable** — four built-in themes (`default`, `dark`, `playful`, `brutalist`); override anything with CSS custom properties.
- **Cascade layers** — klods lives inside `@layer klods.*` so your own styles always win without needing `!important`.
- **SSR-ready** — every builder has a `.toString()` that returns valid HTML, so it works in Node, Rails, or any server-side template.

## Packages

| Package                           | npm                                                                                       | Description                           |
| --------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| [`klods-css`](packages/klods-css) | [![npm](https://img.shields.io/npm/v/klods-css)](https://www.npmjs.com/package/klods-css) | The stylesheet. Use it on its own.    |
| [`klods-js`](packages/klods-js)   | [![npm](https://img.shields.io/npm/v/klods-js)](https://www.npmjs.com/package/klods-js)   | TypeScript builder API (ESM/CJS/UMD). |
| [`apps/docs`](apps/docs)          |                                                                                           | Self-generating documentation site.   |

## Develop

```sh
npm install
npm run dev    # docs site at http://localhost:5173
npm run build  # builds CSS, TS package, and docs
npm test       # runs klods-js unit tests
```

## License

MIT © Drue Wilding
