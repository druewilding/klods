# klods

> Tiny, opinionated, fully themeable HTML / CSS / JS pieces that snap together like lego.

`klods` (Danish for _block_) is a component kit with two faces:

- **`klods-css`** — a single CSS file you drop into any HTML page or Rails app. BEM classes, CSS custom properties for theming, no JS required for the layout primitives.
- **`klods`** — a tiny TypeScript builder library that produces the same markup with a typed, lego-like API:

  ```ts
  page({ sidebar: true }, [
    header({}, nav({}, [...])),
    sidebar({}, [...]),
    content({}, "Hello"),
    footer({}, "© 2026"),
  ]).render(document.body);
  ```

Every builder accepts arbitrary `class`, `id`, `data-*`, `aria-*` and other attributes, so you can extend without forking.

## Packages

| Package                              | Description                           |
| ------------------------------------ | ------------------------------------- |
| [`klods-css`](packages/klods-css)    | The stylesheet. Use on its own.       |
| [`klods`](packages/klods)            | TypeScript builder API (ESM/CJS/UMD). |
| [`apps/docs`](apps/docs)             | Self-generating documentation site.   |

## Develop

```sh
npm install
npm run dev    # docs site at http://localhost:5173
npm run build  # builds CSS, TS package, and docs
```

## License

MIT © Drue Wilding
