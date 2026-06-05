import type { KlodsNode } from "klods-js";
import { box, cluster } from "klods-js";

import { example } from "../../example.js";

export const label = "Cluster";
export const anchor = "cluster-horizontal-wraps";

export const examples: KlodsNode[] = [
  example({
    title: "Cluster — horizontal, wraps",
    render: () =>
      cluster({ gap: 3 }, [
        box("JavaScript"),
        box("TypeScript"),
        box("CSS"),
        box("Accessibility"),
        box("Performance"),
        box("HTML"),
        box("Responsive"),
        box("Animation"),
        box("Grid"),
        box("Flexbox"),
        box("Dark mode"),
        box("Forms"),
        box("Typography"),
        box("Tokens"),
        box("Theming"),
      ]),
  }),
];
