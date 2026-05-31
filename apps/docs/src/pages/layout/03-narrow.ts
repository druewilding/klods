import type { KlodsNode } from "klods-js";
import { content, footer, header, page } from "klods-js";

import { example } from "../../example.js";

export const label = "Narrow content";
export const anchor = "narrow-content";

export const examples: KlodsNode[] = [
  example({
    title: "Narrow content",
    description: "`content({ narrow: true })` caps the main column at --klods-content-max and centres it.",
    render: () =>
      page({}, [
        header({}, "Header"),
        content({ narrow: true }, "Comfortably-narrow text column."),
        footer({}, "Footer"),
      ]),
  }),
];
