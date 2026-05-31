import type { KlodsNode } from "klods-js";
import { badge, cluster } from "klods-js";

import { example } from "../../example.js";

export const label = "Badge";
export const anchor = "badge";

export const examples: KlodsNode[] = [
  example({
    title: "Badge",
    render: () =>
      cluster({}, [
        badge({}, "default"),
        badge({ variant: "accent" }, "accent"),
        badge({ variant: "success" }, "success"),
        badge({ variant: "danger" }, "danger"),
      ]),
  }),
];
