import type { KlodsNode } from "klods-js";
import { code, h2, lead, muted, p, pre, prose, textCenter } from "klods-js";

import { example } from "../../example.js";

export const label = "Prose";
export const anchor = "prose";

export const examples: KlodsNode[] = [
  example({
    title: "Prose",
    render: () =>
      prose([
        h2("A heading inside prose"),
        p([
          "Use ",
          code("klods-prose"),
          " to give a block of HTML content sensible spacing, heading rhythm, and styled inline code.",
        ]),
        p("Subsequent paragraphs get automatic top margin via the adjacent-sibling selector."),
        pre(code('<div class="klods-prose">…</div>')),
      ]),
  }),
  example({
    title: "Lead",
    render: () => lead("A lead paragraph introduces a section with slightly larger, muted text."),
  }),
  example({
    title: "Muted",
    render: () => p(["Regular text followed by ", muted("muted text"), " for secondary information."]),
  }),
  example({
    title: "Text center",
    render: () => textCenter([p("This text is centred using the text-center utility.")]),
  }),
];
