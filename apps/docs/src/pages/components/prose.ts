import type { KlodsNode } from "klods-js";
import { el, lead, muted, prose } from "klods-js";

import { example } from "../../example.js";

export const label = "Prose";
export const anchor = "prose";

export const examples: KlodsNode[] = [
  example({
    title: "Prose",
    render: () =>
      prose({}, [
        el("h2", {}, "A heading inside prose"),
        el("p", {}, [
          "Use ",
          el("code", {}, "klods-prose"),
          " to give a block of HTML content sensible spacing, heading rhythm, and styled inline code.",
        ]),
        el("p", {}, "Subsequent paragraphs get automatic top margin via the adjacent-sibling selector."),
        el("pre", {}, [el("code", {}, '<div class="klods-prose">…</div>')]),
      ]),
  }),
  example({
    title: "Lead",
    render: () => lead({}, "A lead paragraph introduces a section with slightly larger, muted text."),
  }),
  example({
    title: "Muted",
    render: () => el("p", {}, ["Regular text followed by ", muted({}, "muted text"), " for secondary information."]),
  }),
];
