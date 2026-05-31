import type { KlodsNode } from "klods-js";
import { content, footer, header, page } from "klods-js";

import { example } from "../../example.js";

export const label = "Page";
export const anchor = "page-with-header-content-and-footer";

export const examples: KlodsNode[] = [
  example({
    title: "Page with header, content and footer",
    description: "The simplest layout. Uses CSS Grid under the hood and works without JS.",
    render: () => page({}, [header({}, "Header"), content({}, "Main content"), footer({}, "Footer")]),
  }),
];
