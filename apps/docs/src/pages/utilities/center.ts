import type { KlodsNode } from "klods-js";
import { box, center } from "klods-js";

import { example } from "../../example.js";

export const label = "Center";
export const anchor = "center-center-everything";

export const examples: KlodsNode[] = [
  example({
    title: "Center — center everything",
    render: () => center({ style: "min-height: 8rem; background: var(--klods-color-surface);" }, box({}, "centered")),
  }),
];
