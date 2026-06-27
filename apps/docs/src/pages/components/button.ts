import type { KlodsNode } from "klods-js";
import { alert, button, cluster, p } from "klods-js";

import { example } from "../../example.js";

export const label = "Button";
export const anchor = "button";

export const examples: KlodsNode[] = [
  example({
    title: "Button",
    render: () =>
      cluster([
        button("Default"),
        button({ variant: "primary" }, "Primary"),
        button({ variant: "danger" }, "Danger"),
        button({ variant: "ghost" }, "Ghost"),
      ]),
  }),

  example({
    title: "Button as link",
    description:
      "Pass href and the builder renders an <a> instead of a <button> — same classes, valid HTML. All variants and extra attributes still work.",
    render: () =>
      cluster([
        button({ href: "#" }, "Default link"),
        button({ href: "#", variant: "primary" }, "Primary link"),
        button({ href: "#", variant: "ghost" }, "Ghost link"),
      ]),
  }),

  example({
    title: "Extending — pass through any attribute",
    description: "Every builder accepts class, id, data-*, aria-*, style, event handlers, etc.",
    render: () =>
      button(
        {
          variant: "primary",
          id: "save-btn",
          class: "my-tracker",
          "data-event": "click_save",
          "aria-label": "Save the document",
          onClick: () => alert("(no-op in the docs)"),
        },
        "Save"
      ),
  }),
];
