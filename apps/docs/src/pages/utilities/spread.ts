import type { KlodsNode } from "klods-js";
import { el, spread } from "klods-js";

import { example } from "../../example.js";

export const label = "Spread";
export const anchor = "spread-push-children-apart";

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
    title: "Spread — push children apart",
    render: () => spread({}, [box("start"), box("end")]),
  }),
];
