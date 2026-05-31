import type { KlodsNode } from "klods-js";
import { el, row } from "klods-js";

import { example } from "../../example.js";

export const label = "Row";
export const anchor = "row-horizontal-no-wrap";

const box = (label: string): KlodsNode =>
  el(
    "div",
    {
      style:
        "padding:var(--klods-space-3);background:var(--klods-color-surface-2);border-radius:var(--klods-radius-sm);min-width:4rem;text-align:center;",
    },
    label
  );

export const examples: KlodsNode[] = [
  example({
    title: "Row — horizontal, no wrap",
    render: () => row({ gap: 3 }, [box("left"), box("middle"), box("right")]),
  }),
];
