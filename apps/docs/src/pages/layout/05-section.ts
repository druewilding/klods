import type { KlodsNode } from "klods-js";
import { box, section, stack } from "klods-js";

import { example } from "../../example.js";

export const label = "Section";
export const anchor = "section";

export const examples: KlodsNode[] = [
  example({
    title: "Section",
    description:
      "Sibling sections are automatically separated by a top border and vertical spacing. Each section also has scroll-margin-top so that anchor links clear any sticky header.",
    render: () =>
      stack({ gap: 0 }, [
        section(box("First section")),
        section(box("Second section")),
        section(box("Third section")),
      ]),
  }),
];
