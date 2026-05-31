import type { KlodsNode } from "klods-js";
import { cluster, el } from "klods-js";

import { example } from "../../example.js";

export const label = "Cluster";
export const anchor = "cluster-horizontal-wraps";

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
    title: "Cluster — horizontal, wraps",
    render: () => cluster({ gap: 3 }, [box("A"), box("B"), box("C"), box("D"), box("E")]),
  }),
];
