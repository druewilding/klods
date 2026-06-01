import type { KlodsNode } from "klods-js";
import { badge, box, cluster } from "klods-js";

import { example } from "../../example.js";

export const label = "Hide (responsive)";
export const anchor = "hide-responsive-hide-mobile-and-hide-tablet";

export const examples: KlodsNode[] = [
  example({
    title: "Hide (responsive) — hide-mobile and hide-tablet",
    description:
      "klods-hide-mobile hides an element on screens ≤ 480 px (phones). klods-hide-tablet hides an element on screens ≤ 768 px (phones and tablets). Resize the window to see the badges appear and disappear.",
    render: () =>
      cluster({}, [
        box({}, "Always visible"),
        badge({ class: "klods-hide-mobile", variant: "accent" }, "Hidden on mobile (≤ 480 px)"),
        badge({ class: "klods-hide-tablet", variant: "success" }, "Hidden on tablet + mobile (≤ 768 px)"),
      ]),
  }),
];
