import type { KlodsNode } from "klods-js";
import { details, p, stack, summary } from "klods-js";

import { example } from "../../example.js";

export const label = "Details";
export const anchor = "details";

export const examples: KlodsNode[] = [
  example({
    title: "Details",
    render: () =>
      details([
        summary("What is klods?"),
        p(
          "klods is a CSS design system and TypeScript component library for building apps without a heavy JS framework."
        ),
      ]),
  }),

  example({
    title: "Details — open by default",
    description: "Pass open to expand the panel on first render.",
    render: () =>
      details({ open: true }, [
        summary("Answer visible on load"),
        p("The native open attribute is passed straight through to the <details> element."),
      ]),
  }),

  example({
    title: "Details — FAQ group",
    description:
      "Stack several details together for a FAQ list. Each item manages its own open/closed state natively — no JS required.",
    render: () =>
      stack({ gap: 2 }, [
        details([
          summary("Do I need a build step?"),
          p("No. You can link klods-css directly from a CDN and use BEM classes in plain HTML."),
        ]),
        details([
          summary("Can I use it with React or Vue?"),
          p(
            "Yes. The klods-js builders output plain HTML strings or DOM nodes, so they compose cleanly with any framework."
          ),
        ]),
        details([
          summary("Is it accessible?"),
          p(
            "Yes. The native <details>/<summary> elements have built-in keyboard support and are announced correctly by screen readers."
          ),
        ]),
      ]),
  }),
];
