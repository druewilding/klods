import type { KlodsNode } from "klods-js";
import { alert, button, cluster } from "klods-js";

import { example } from "../../example.js";

export const label = "Buttons";
export const anchor = "buttons";

export const examples: KlodsNode[] = [
  example({
    title: "Buttons",
    render: () =>
      cluster({}, [
        button({}, "Default"),
        button({ variant: "primary" }, "Primary"),
        button({ variant: "danger" }, "Danger"),
        button({ variant: "ghost" }, "Ghost"),
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
          onClick: () => alert({}, "(no-op in the docs)"),
        },
        "Save"
      ),
  }),
];
