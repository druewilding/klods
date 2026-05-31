import type { KlodsNode } from "klods-js";
import { el, toc } from "klods-js";

import { example } from "../../example.js";

export const label = "Table of contents";
export const anchor = "table-of-contents-toc";

export const examples: KlodsNode[] = [
  example({
    title: "Table of contents - toc",
    render: () =>
      toc({}, [
        el("li", {}, el("a", { href: "#" }, "Introduction")),
        el("li", {}, el("a", { href: "#" }, "Getting started")),
        el("li", {}, el("a", { href: "#" }, "Components")),
        el("li", {}, el("a", { href: "#" }, "Layout")),
        el("li", {}, el("a", { href: "#" }, "Utilities")),
      ]),
  }),
  example({
    title: "Toc with sub-items",
    render: () =>
      toc({}, [
        el("li", {}, el("a", { href: "#" }, "Components")),
        el("li", {}, [
          el("a", { href: "#" }, "Layout"),
          el("ul", { class: "klods-toc klods-toc--sub" }, [
            el("li", {}, el("a", { href: "#" }, "Page")),
            el("li", {}, el("a", { href: "#" }, "Sidebar")),
            el("li", {}, el("a", { href: "#" }, "Header")),
          ]),
        ]),
        el("li", {}, el("a", { href: "#" }, "Utilities")),
      ]),
  }),
];
