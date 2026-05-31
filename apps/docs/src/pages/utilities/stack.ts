import type { KlodsNode } from "klods-js";
import { el, stack } from "klods-js";

import { example } from "../../example.js";

export const label = "Stack";
export const anchor = "stack-vertical-with-gap";

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
    title: "Stack — vertical with gap",
    render: () => stack({ gap: 3 }, [box("one"), box("two"), box("three")]),
  }),
];
