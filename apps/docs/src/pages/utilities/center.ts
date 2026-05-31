import type { KlodsNode } from "klods-js";
import { center, el } from "klods-js";

import { example } from "../../example.js";

export const label = "Center";
export const anchor = "center-center-everything";

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
    title: "Center — center everything",
    render: () => center({ style: "min-height: 8rem; background: var(--klods-color-surface);" }, box("centered")),
  }),
];
