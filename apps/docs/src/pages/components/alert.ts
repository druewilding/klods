import type { KlodsNode } from "klods-js";
import { alert, stack } from "klods-js";

import { example } from "../../example.js";

export const label = "Alert";
export const anchor = "alert";

export const examples: KlodsNode[] = [
  example({
    title: "Alert",
    render: () =>
      stack({}, [
        alert({ variant: "info" }, "Heads up — info."),
        alert({ variant: "success" }, "All good."),
        alert({ variant: "warning" }, "Be careful."),
        alert({ variant: "danger" }, "Something broke."),
      ]),
  }),
];
