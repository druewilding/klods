import type { KlodsNode } from "klods-js";
import { box, cluster, push } from "klods-js";

import { example } from "../../example.js";

export const label = "Push";
export const anchor = "push-move-siblings-to-the-end-of-a-flex-row";

export const examples: KlodsNode[] = [
  example({
    title: "Push — move siblings to the end of a flex row",
    render: () => cluster([box("start"), push(), box("end")]),
  }),
];
