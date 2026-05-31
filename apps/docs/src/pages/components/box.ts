import type { KlodsNode } from "klods-js";
import { box, stack } from "klods-js";

import { example } from "../../example.js";

export const label = "Box";
export const anchor = "box";

export const examples: KlodsNode[] = [
  example({
    title: "Box",
    render: () =>
      stack({ gap: 3 }, [
        box({}, "A padded container with a surface background."),
        box({}, "Great for grouping related content, call-outs, or as a visual placeholder."),
      ]),
  }),
];
