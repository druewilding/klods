import type { KlodsNode } from "klods-js";
import { toc, tocItem, tocLink } from "klods-js";

import { example } from "../../example.js";

export const label = "Table of contents";
export const anchor = "table-of-contents-toc";

export const examples: KlodsNode[] = [
  example({
    title: "Table of contents - toc",
    render: () =>
      toc([
        tocItem(tocLink({ href: "#" }, "Introduction")),
        tocItem(tocLink({ href: "#" }, "Getting started")),
        tocItem(tocLink({ href: "#" }, "Components")),
        tocItem(tocLink({ href: "#" }, "Layout")),
        tocItem(tocLink({ href: "#" }, "Utilities")),
      ]),
  }),
  example({
    title: "Toc with sub-items",
    render: () =>
      toc([
        tocItem(tocLink({ href: "#" }, "Components")),
        tocItem([
          tocLink({ href: "#" }, "Layout"),
          toc({ sub: true }, [
            tocItem(tocLink({ href: "#" }, "Page")),
            tocItem(tocLink({ href: "#" }, "Sidebar")),
            tocItem(tocLink({ href: "#" }, "Header")),
          ]),
        ]),
        tocItem(tocLink({ href: "#" }, "Utilities")),
      ]),
  }),
];
