import type { KlodsNode } from "klods-js";
import { button, buttonGroup } from "klods-js";

import { example } from "../../example.js";

export const label = "Button group";
export const anchor = "button-group";

export const examples: KlodsNode[] = [
  example({
    title: "Button group",
    render: () =>
      buttonGroup({ role: "group", "aria-label": "View" }, [
        button({ variant: "ghost" }, "Day"),
        button({ variant: "ghost" }, "Week"),
        button({ variant: "ghost" }, "Month"),
      ]),
  }),
  example({
    title: "Button group with active state",
    render: () =>
      buttonGroup({ role: "group", "aria-label": "View" }, [
        button({ variant: "ghost", "aria-pressed": "true" }, "Day"),
        button({ variant: "ghost", "aria-pressed": "false" }, "Week"),
        button({ variant: "ghost", "aria-pressed": "false" }, "Month"),
      ]),
  }),
];
