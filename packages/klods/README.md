# klods

Tiny, typed, lego-like builder API. Pairs with [`klods-css`](../klods-css).

```sh
npm install klods klods-css
```

```ts
import { content, footer, header, nav, navLink, navList, page, sidebar } from "klods";
import "klods-css";

page({ sidebar: true }, [
  header(
    {},
    nav({}, navList({}, [navLink({ href: "/", active: true }, "Home"), navLink({ href: "/about" }, "About")]))
  ),
  sidebar({}, "filters here"),
  content({ narrow: true }, "Hello world"),
  footer({}, "© 2026"),
]).render(document.body);
```

Every builder accepts arbitrary `class`, `id`, `data-*`, `aria-*`, event handlers and any other HTML attribute. See the [docs site](../../apps/docs) for the full reference.
