import type { KlodsNode } from "klods-js";
import { box, cluster } from "klods-js";

import { example } from "../../example.js";

export const label = "Cluster";
export const anchor = "cluster-horizontal-wraps";

export const examples: KlodsNode[] = [
  example({
    title: "Cluster — horizontal, wraps",
    render: () => cluster({ gap: 3 }, [box({}, "A"), box({}, "B"), box({}, "C"), box({}, "D"), box({}, "E")]),
  }),
];
