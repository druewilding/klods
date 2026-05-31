import type { KlodsNode } from "klods-js";
import { el, grid } from "klods-js";

import { example } from "../../example.js";

export const label = "Grid";
export const anchor = "grid-equal-columns";

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
    title: "Grid — equal columns",
    render: () => grid({ cols: 3, gap: 3 }, [box("1"), box("2"), box("3"), box("4"), box("5"), box("6")]),
  }),

  example({
    title: "Grid — fit — auto-responsive",
    description: "Sets the minimum item width via `--klods-grid-min` (defaults to 16rem).",
    render: () => grid({ fit: true, gap: 3 }, [box("a"), box("b"), box("c"), box("d")]),
  }),
];
