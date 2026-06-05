import type { KlodsNode } from "klods-js";
import { box, stack } from "klods-js";

import { example } from "../../example.js";

export const label = "Stack";
export const anchor = "stack-vertical-with-gap";

export const examples: KlodsNode[] = [
  example({
    title: "Stack — vertical with gap",
    render: () => stack({ gap: 3 }, [box("one"), box("two"), box("three")]),
  }),
];
