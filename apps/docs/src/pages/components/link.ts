import type { KlodsNode } from "klods-js";
import { link, strong } from "klods-js";

import { example } from "../../example.js";

export const label = "Link";
export const anchor = "link";

export const examples: KlodsNode[] = [
  example({
    title: "Link",
    render: () => link({ href: "#" }, "A styled link"),
  }),
  example({
    title: "Link — plain",
    description:
      "Inherits color and removes underline. Use for wordmarks, logo links, and nav items where the link context is implied.",
    render: () => link({ href: "#", plain: true }, strong("WatchThis")),
  }),
];
