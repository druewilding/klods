import type { KlodsNode } from "klods-js";
import { box, spread } from "klods-js";

import { example } from "../../example.js";

export const label = "Spread";
export const anchor = "spread-push-children-apart";

export const examples: KlodsNode[] = [
  example({
    title: "Spread — push children apart",
    render: () => spread([box("start"), box("end")]),
  }),
];
