import type { KlodsNode } from "klods-js";
import { box, content, footer, header, page } from "klods-js";

import { example } from "../../example.js";

export const label = "Narrow content";
export const anchor = "narrow-content";

export const examples: KlodsNode[] = [
  example({
    title: "Narrow content",
    description: "`content({ narrow: true })` caps the main column at --klods-content-max and centres it.",
    render: () =>
      page({ style: "--klods-content-max: 30rem;" }, [
        header({}, "Header"),
        content({ narrow: true }, box({}, "Narrow column — capped and centred.")),
        footer({}, "Footer"),
      ]),
  }),
];
