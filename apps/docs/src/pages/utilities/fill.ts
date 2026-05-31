import type { KlodsNode } from "klods-js";
import { box, cluster, fill, push } from "klods-js";

import { example } from "../../example.js";

export const label = "Fill";
export const anchor = "fill-grow-to-fill-available-space";

export const examples: KlodsNode[] = [
  example({
    title: "Fill — grow to fill available space",
    render: () => cluster({}, [fill({}, [box({}, "fill"), box({}, "fill")]), box({}, "fixed"), box({}, "fixed")]),
  }),
  example({
    title: "Fill with push — push content to the end",
    render: () => fill({}, [push(), box({}, "pushed to end")]),
  }),
];
