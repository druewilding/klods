import type { KlodsNode } from "klods-js";
import { box, row } from "klods-js";

import { example } from "../../example.js";

export const label = "Row";
export const anchor = "row-horizontal-no-wrap";

export const examples: KlodsNode[] = [
  example({
    title: "Row — horizontal, no wrap",
    render: () => row({ gap: 3 }, [box("left"), box("middle"), box("right")]),
  }),
];
