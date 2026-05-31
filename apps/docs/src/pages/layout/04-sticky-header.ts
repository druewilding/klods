import type { KlodsNode } from "klods-js";
import { content, footer, header, page } from "klods-js";

import { example } from "../../example.js";

export const label = "Sticky header";
export const anchor = "sticky-header";

export const examples: KlodsNode[] = [
  example({
    title: "Sticky header",
    description: "`stickyHeader: true` keeps the header pinned to the top of the viewport as the page scrolls.",
    render: () =>
      page({ stickyHeader: true }, [header({}, "Sticky header"), content({}, "Main content"), footer({}, "Footer")]),
  }),
];
